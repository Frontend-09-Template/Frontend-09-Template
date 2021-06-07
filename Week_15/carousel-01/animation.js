const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATION = Symbol("animation");

export class Timeline {
  constructor() {
    // 做变量的触发
    
    this[ANIMATION] = new Set();   // 把 animation 放入这个 Set里面
  }
  start(){
    let startTime = Date.now();
    this[TICK] = () => {   // 调用自身的一个时间函数
      for (let animation of this[ANIMATION]) {
        animation.receive(Date.now() - startTime);
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
  add(animation) {
    this[ANIMATION].add(animation);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receive(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.startValue + range * time / this.duration;
  }
}