const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATION = Symbol("animation");
const START_TIME = Symbol("start-time");   // 添加的时间

export class Timeline {
  constructor() {
    // 做变量的触发
    
    this[ANIMATION] = new Set();   // 把 animation 放入这个 Set里面
    this[START_TIME] = new Map();
  }
  start(){
    let startTime = Date.now();
    this[TICK] = () => {           // 调用自身的一个时间函数
      let now = Date.now();
      for (let animation of this[ANIMATION]) {
        console.log('animation.duration==', animation.duration);
        // 在动画开始之后
        
        let t0;
        if (this[START_TIME].get(animation) < startTime) {
          // 在动画添加之后开始时间线
          t0 = now;
        }

        if (animation.duration < t) {
          this[ANIMATION].delete(animation);
          t0 = animation.duration
        }
        animation.receive(t0);   // 解决超出范围的问题
      }
      requestAnimationFrame(this[TICK]);   
    }
    this[TICK]();
  }
  // 播放速率，控制动画快进慢放
  // set rate() {
 
  // }
  // get rate() {

  // }
  // 暂停
  pause() {

  }
  // 恢复
  resume() {

  }

  // 重启时间线，清除状态
  reset() {

  }

  // 管理动画
  add(animation, startTime) {
    if (arguments.length < 2) {
      addTime = Date.now();
    }
    this[ANIMATION].add(animation);
    this[START_TIME].set(animation, startTime);         // 设置动画添加的时间
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;                      // 增加delay属性
  }
  receive(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.startValue + range * time / this.duration;
  }
}