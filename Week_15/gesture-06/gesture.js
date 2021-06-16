// 监听
export class Listener {
  constructor(el, recognizer) {
    let isListeningMouse = false; // 用于防止重复监听mouseup和mousemove事件（其实我觉得也可以把mouseup和mousemove的监听拿出来，只需要判断一下event.buttons不为0才执行逻辑就行）

    let contexts = new Map();  // 保存多个context

    el.addEventListener('mousedown', event => {
      let context = Object.create(null);
      // event.button:0,1,2,3,4  
      // 1 << event.button: 1,2,4,8,16
      contexts.set("mouse" + (1 << event.button), context);

      recognizer.start(event, context)
      let mousemove = event => {
        let button = 1;
        while (button <= event.buttons) {
          if (button & event.buttons) {//判断对应的键有没有被按下
            // 中键按下时event.buttons = 4,右键按下时event.buttons = 2
            // 交换中键（2）和右键（4）的值
            let key;
            if (button === 2) key = 4
            else if (button === 4) key = 2
            else key = button

            let context = contexts.get("mouse" + key);
            recognizer.move(event, context);
          }
          button = button << 1; // 2 4 8 16
        }
      }
      let mouseup = event => {
        let context = contexts.get("mouse" + (1 << event.button));
        recognizer.end(event, context);
        contexts.delete("mouse" + (1 << event.button))
        if (event.buttons === 0) { //没有键被按下时才移除监听事件
          document.removeEventListener("mousemove", mousemove)
          document.removeEventListener("mouseup", mouseup)
          isListeningMouse = false;
        }
      }
      if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
      }
    })
    // 因为touchmove和touchend一定会触发在touchstart之后，所以可以直接监听
    // 手指可能有多点触摸，identifier标识符用于标识是哪个手指触发的touch
    el.addEventListener("touchstart", event => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null)
        contexts.set(touch.identifier, context);
        recognizer. start(touch, context);
      }
    })
    el.addEventListener("touchmove", event => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    })
    el.addEventListener("touchend", event => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier)
      }
    })
    // 被一些系统事件打断时触发（比如：setTimeout(()=>alert('!!'),3000)）
    el.addEventListener("touchcancel", event => {
      for (let touch of event.changedTouches) {
        recognizer.cancel(touch);
      }
    })
  }
}
// 识别
export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher= dispatcher;
  }
  start (point, context){
    context.startX = point.clientX, context.startY = point.clientY;

    context.points = [ // 记录当前的时间和点坐标
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }
    ]
  
    context.isTap = true; // 用于判断start后是否发生过其它的动作（移动、按压超过五秒）
    context.isPan = false;// 用于判断是否发生过移动事件
    context.isPress = false;// 用于判断是否发生过presss事件

    context.handler = setTimeout(() => {
      context.isPan = false;
      context.isTap = false;
      context.isPress = true;
      context.handler = null; // 设置为null避免多次clearTimeout
      this.dispatcher.dispatch("press", {}); // 触发自定义事件press
    }, 500)
  }
  move (point, context) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {// 手指移动超过10px（开方耗时较大，直接用两点间距离的平方来比较）
      context.isTap = false;
      context.isPress = false;
      context.isPan = true;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch("panstart", {// 触发自定义事件panstart
        startX:context.startX,
        startY:context.startY,
        clientX:point.clientX,
        clientY:point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(context.handler); // 清除press事件触发的定时器
    }
    if (context.isPan) {
      this.dispatcher.dispatch("pan", {// 触发自定义事件pan
        startX:context.startX,
        startY:context.startY,
        clientX:point.clientX,
        clientY:point.clientY,
        isVertical: context.isVertical
      });
    }
  
    context.points = context.points.filter(point => Date.now() - point.t < 500);// 只留下最近半秒内的点

    context.points.push({ // 每次move放入一个新的点
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
  }
  end (point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch("tap", {})
      clearTimeout(context.handler);// 清除press事件触发的定时器
    }
    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});// 触发自定义事件pressend
    }
  
    context.points = context.points.filter(point => Date.now() - point.t < 500);// 只留下最近半秒内的点
  
    // 计算速度
    let d, v;
    if (!context.points.length) {
      v = 0;
    } else {
      // 移动的距离(当前点与我们记录的points中的第一个点的距离)
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
      v = d / (Date.now() - context.points[0].t);// 距离除以时间求得速度
    }
  
    // 如果速度大于1.5px / ms，我们认为速度比较快
    if (v > 1.5) {
      context.isFlick = true;
      this.dispatcher.dispatch("flick", {// 触发自定义事件flick
        startX:context.startX,
        startY:context.startY,
        clientX:point.clientX,
        clientY:point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity:v //速度
      });
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch("panend", {// 触发自定义事件panend
        startX:context.startX,
        startY:context.startY,
        clientX:point.clientX,
        clientY:point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick
      });
    }
  }
  cancel (event){
    clearTimeout(context.handler);// 清除press事件触发的定时器
    this.dispatcher.dispatch("cancel", {});// 触发自定义事件pressend
  }
}


//分发
export class Dispatcher{
  constructor(el){
    this.el = el;
  }
  dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }

    this.el.dispatchEvent(event)
  }
}


export function enableGesture(el) {
  new Listener(el,new Recognizer(new Dispatcher(el)));
}
