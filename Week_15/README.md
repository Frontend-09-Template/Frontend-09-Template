学习笔记

# 轮播组件-手势和动画

## 1. 初步建立动画和时间线

**用JS实现动画**

帧的概念： 最基础的动画能力，每帧去执行一个什么样的事件。

一般的动画是有一个16m的这样一个常识的。正常人人眼能够识别的动画就是每秒60帧。

JS里处理帧的方案：
+ setInterval(() => {}, 16)
+ setTimeout(() => {}, 16)
  ```js
    let tick = () => {
      setTimeout(tick, 16)
    }
  ```
+ requestAnimationFrame(tick)  又叫RAF,写动画比较常用的。含义是我申请浏览器执行下一帧的时候，我们来执行这个代码。它和浏览器的帧率是相关的。如果做一些浏览器降帧的事情，它可能就跟着降帧。
  ```js
    let tick = () => {
      requestAnimationFrame(tick)
      // let handler = requestAnimationFrame(tick)
      // cancelAnimationFrame(handler)             // 与requestAnimationFrame对应，可以避免一些资源的浪费
    }
  ```

  现代浏览器建议用`requestAnimationFrame`函数，因为`setInterval`比较不可控，浏览器到底会不会按照16ms去执行呢，不好说。另外`tick`如果写的不好的话，setTimeout容易发生积压。

**动画和时间线的初步建立：**

将tick函数进一步放封装即得到Timeline类
+ Timeline 拥有 start() 和 add()（管理动画的能力）
+ Animation 拥有 初始化和 更新动画时长的能力

详见carousel-01/animation.js


## 2. 设计时间线的更新

+ Animation 的开始时间, 关于添加delay属性的两个考虑：
  + 和CSS animation 的 duration 和 delay类似的设计， 把 Animation 的 delay 放到Timeline里面，在 add animation 的时候添加delay
  + 存在的问题，就是在 add animation时，时间线已经开始执行了，就会存在 startTime 和 t0(animation.receive(time))不一定一致的问题

  详见carousel-02/animation.js

## 3. 给动画添加暂停和重启功能
+ 把 `requestAnimationFrame(this[TICK])` 存起来。
  ```js
    this[TICK_HANDLER] = requestAnimationFrame(this[TICK]); 
  ```
+ 暂停动画使用 `cancelAnimationFrame()` 
  ```js
    // 动画彻底停下来
    pause() {
      cancelAnimationFrame(this[TICK_HANDLER]);
    }
  ```

+ 重启需要重新的执行tick

详见 carousel-03/animation-demo.js

## 4. 完善动画的其他功能

所有用到animation.duration 的地方都要加上 delay, 或者说delay 需要从时间当中扣除，以实现延迟的效果。

timingFunction 是一个关于 0 ~ 1 的 time，返回 0 ~ 1的一个函数。

**三次贝塞尔曲线(cubic-bezier)**

可参阅网站：https://cubic-bezier.com/#.17,.67,.83,.67

贝塞尔曲线通过控制曲线上的四个点（起始点、终止点以及两个相互分离的中间点）来创造、编辑图形，绘制出一条光滑曲线并以曲线的状态来反映动画过程中速度的变化。用牛顿积分的方法去求的。

几个预设速度：
+ ease 对应自定义cubic-bezier(.25,.01,.25,1)，效果为先慢后快再慢；
+ linear 对应自定义cubic-bezier(0,0,1,1)，效果为匀速直线；
+ ease-in 对应自定义cubic-bezier(.42,0,1,1)，效果为先慢后快；
+ ease-out 对应自定义cubic-bezier(0,0,.58,1)，效果为先快后慢；
+ ease-in-out 对应自定义cubic-bezier(.42,0,.58,1)，效果为先慢后快再慢。

## 5. 对时间线进行状态管理
增加代码的健壮性  `this.state`
+ inited
+ started
+ paused

4,5 小节详见 carousel-04

## 6. 手势的基本知识

+ 一般鼠标点击行为都比较稳，不会发生变动
  - 鼠标单击的过程其实是包含三个过程的：mousedown => mousemove => mouseup
+ 但是触屏不一样，我们的手指是软的，所以难免产生一些微小的偏移
  - 触屏点击的过程：touchstart=> touchmove => touchend

统一触屏和手机的体验，对鼠标和触屏操作进行区分

**手势的基本知识**

```markdown
start -- end --> tap
start -- 移动10px --> pan start -- move --> pan -- end --> pan end 表示一个缓慢的视点的推移
                                           pan -- move --> pan
                                           pan -- end 且速度>? --> flick
start -- 0.5s --> press start -- 移动 10px --> pan start
                              -- end --> press end
```

+ start 手指按下动作
+ tap start之后直接没有其他操作触发
+ pan start start之后移动了10px(retina屏)触发
  - pan 每移动10px就会触发一个pan
    + flick（或者swipe）手指离开且速度大于一个阈值时触发
    + pan end 手指离开时触发
+ press start 手指按下时间超过0.5s触发
    + pan start（包括后续的pan、flick、pan end） press start状态下移动手指时触发
    + press end 不移动手指，过一段时间后松开时触发
+ press start和press end可以决定是手指按下时触发事件还是弹起时触发


## 7. 实现鼠标操作
```js
// 代表HTML元素
let element = document.documentElement;


element.addEventListener("mousedown", event => {
  start(event);

  let mousemove = event => {
    move(event);
  };
  let mouseup = event => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };
  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});


element.addEventListener("touchstart", event => {
  for (let touch of event.changedTouches) {
    start(touch);
  }
});

element.addEventListener("touchmove", event => {
  for (let touch of event.changedTouches) {
    move(touch);
  }
});

element.addEventListener("touchend", event => {
  for (let touch of event.changedTouches) {
    end(touch);
  }
});

element.addEventListener("touchcancel", event => {
  for (let touch of event.changedTouches) {
    cancel(touch);
  }
});

let start = (point) => {
  console.log("start", point.clientX);
};

let move = (point) => {
  console.log("move", point.clientX);
};

let end = (point) => {
  console.log("end", point.clientX);
};

let cancel = (point) => {
  console.log("cancel", point.clientX);
};
```

## 8. 实现手势的逻辑
```js
// 代表HTML元素
let element = document.documentElement;

element.addEventListener("mousedown", event => {
  start(event);

  let mousemove = event => {
    move(event);
  };
  let mouseup = event => {
    end(event);
    element.removeEventListener("mousemove", mousemove);
    element.removeEventListener("mouseup", mouseup);
  };
  element.addEventListener("mousemove", mousemove);
  element.addEventListener("mouseup", mouseup);
});


element.addEventListener("touchstart", event => {
  for (let touch of event.changedTouches) {
    start(touch);
  }
});

element.addEventListener("touchmove", event => {
  for (let touch of event.changedTouches) {
    move(touch);
  }
});

element.addEventListener("touchend", event => {
  for (let touch of event.changedTouches) {
    end(touch);
  }
});

element.addEventListener("touchcancel", event => {
  for (let touch of event.changedTouches) {
    cancel(touch);
  }
});

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

let start = (point) => {
  // console.log("start", point.clientX);

  startX = point.clientX, startY = point.clientY;
  
  isTap = true;
  isPan = false;
  isPress = false;

  handler = setTimeout(() => {
    isTap = false;
    isPan = false;
    isPress = true;
    handler = null;
    console.log("pressstart");
  }, 500);
};

let move = (point) => {
  let dx = point.clientX - startX, dy = point.clientY - startY;

  if(!isPan && dx ** 2 + dy ** 2 > 100) {
    isTap = false;
    isPan = true;
    isPress = false;
    console.log("panstart");
    clearTimeout(handler);
  };

  if (isPan) {
    console.log(dx, dy);
    console.log("pan");
  }
  console.log("move", point.clientX);
};

let end = (point) => {
  if (isTap) {
    console.log("tap");
    clearTimeout(handler);
  }
  if (isPan) {
    console.log("panend");
  }
  if (isPress) {
    console.log("pressend");
  }
  console.log("end", point.clientX);
};

let cancel = (point) => {
  clearTimeout(handler);
  console.log("cancel", point.clientX);
};

```

详见 gesture-02/gesture.js

## 9. 处理鼠标事件

+ 因为事件的触发不止一种，所以我们不能用全局变量来判断事件的状态
  - touch会有多指事件，每个手指都是单独的一次事件触发
  - 鼠标会有左、中、右，甚至前进、后退按钮，五种触发方式
  - 需要单独的去管理每一种触发事件的状态
+ touch事件可以通过event.identifier作为唯一标识，存储不同手指的context
+ 鼠标事件可以使用event.button作为唯一标识，存储不同按键的context
+ event.buttons 的值是通过掩码进行求和计算的：
  - 比如我同时按下鼠标的左中右键，event.button分别为 0 1 2 则此时event.buttons = (1 << 0) + (1 << 1) + (1 << 2) = 7
  - 中键按下时，event.buttons为4，右键按下时event.buttons为2，但是我们存储的中间和右键的key分别为 1 << 1 = 2 和 1 << 2 = 4，所以在取key时需要特殊处理这两个值

详见 gesture-03/gesture.js


## 10. 派发事件
```js
let end = (point,context) => {
    if(context.isTap){
        dispatch("tap", {});//触发自定义事件tap
        clearTimeout(context.handler);//清除press事件触发的定时器
    }
    if(context.isPan){
        console.log('pan end');
    }
    if(context.isPress){
        dispatch("pressend", {});//触发自定义事件pressend
        console.log('press end');
    }
}
function dispatch(type, properties){
    let event = new Event(type);
    console.log(event);
    for(let name in properties){
        event[name] = properties[name];
    }
    el.dispatchEvent(event)
}
// 监听tap事件的触发
document.documentElement.addEventListener('tap',(event)=>{
    console.log('tap event trigger',event)
});
```
详见 gesture-04/gesture.js

## 11. 实现一个Flick事件
+ 判断速度：move的时候我们可以得到当前一次move的速度，但是如果只判断两个点之间的速度，根据浏览器的实现不同会有较大误差，所以我们需要取一段时间之内的点，求平均值.

详见 gesture-05/gesture.js

## 12. 封装
+ 监听逻辑： Listener
+ 识别逻辑：Recognizer
+ 分发逻辑：Dispatcher
+ 最终的调用顺序

详见 gesture-06/gesture.js

