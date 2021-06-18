import {  Component, STATE, ATTRIBUTE } from "./framework";
import { enableGesture } from "./gesture";
import { Timeline, Animation } from "./animation";
import { ease } from "./ease";

export { STATE, ATTRIBUTE } from "./framework";

export class Carousel extends Component{
  constructor() {
    super(); // 调用父类的构造函数，构造函数中的this指向当前创建的实例(必须调用)
  }
  render() {
    this.root = document.createElement("div");  // 默认创建一个 div
    // 设置样式
    this.root.classList.add('carousel');
    for (let record of this[ATTRIBUTE].src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url('${record.img}')`;
      this.root.appendChild(child);
    }
    // 给root注册enableGesture
    enableGesture(this.root);

    // 初始化时间线
    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;

    // let position = 0;  // 记录当前处于哪一张图（0~4）
    this[STATE].position = 0;

    let t = 0;   // 保存动画的总时间
    let ax = 0;  // 动画生成的位移
    let handler = null;

    // 增加start 事件，不管是鼠标还是触屏，让时间线停下，然后重启。
    this.root.addEventListener("start", event => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 1500;   // 计算动画时间的进度
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener("tap", event => {
      this.triggerEvent("click", {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position 
      });
    });

    this.root.addEventListener("pan", event => {
      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - (x - x % 500) / 500; // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）

      for(let offset of [-1, 0, 1]){  
        let pos = current + offset;  // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
        pos = (pos % children.length + children.length) % children.length;  // 把-1转为3，-2转为2，-3转为1
        children[pos].style.transition = "none";   // 取消动画
        children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + x % 500}px)`;
      }
    });

    this.root.addEventListener("end", event => {
      timeline.reset();
      timeline.start();   // 重新启动时间线
      handler = setInterval(nextPicture, 3000);

      // 添加flick的逻辑

      let x = event.clientX - event.startX - ax;
      let current = this[STATE].position - (x - x % 500) / 500; // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）

      let direction = Math.round((x % 500) / 500);  // 值为 -1、0、1

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
        console.log(event.velocity);
      }

      for(let offset of [-1, 0, 1]){  
        let pos = current + offset;  // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
        pos = (pos % children.length + children.length) % children.length;  // 把-1转为3，-2转为2，-3转为1

        children[pos].style.transition = "none";   // 取消动画

        // 添加动画
        let a = new Animation(
          children[pos].style, 
          "transform", 
          (- pos * 500 + offset * 500 + x % 500), 
          (- pos * 500 + offset * 500 + direction % 500), 
          500, 
          0, 
          ease, 
          v => `translateX(${v}px)`
        );
        
        timeline.add(a);
        
      }
      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length; // 矫正position
      this.triggerEvent("Change", {position: this[STATE].position });   // 不等动画播完
    });

    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      // 计算动画产生的距离
      t = Date.now();  // 保存动画开始的时间
      
      // 增加手势后，在监听start之后，此处代码不再使用
      // next.style.transition = "none";
      // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;   // 矫正偏移

      // 添加动画
      let a = new Animation(current.style, "transform", (-this[STATE].position * 500), (-500 - this[STATE].position * 500), 500, 0, ease, v => `translateX(${v}px)`);
      let a_next = new Animation(next.style, "transform", (500 - nextIndex * 500), (-nextIndex * 500), 500, 0, ease, v => `translateX(${v}px)`);
      timeline.add(a);
      timeline.add(a_next);

      this[STATE].position = nextIndex;

      this.triggerEvent("change", {position: this[STATE].position });
    };

    // 加上时间处理
    handler = setInterval(nextPicture, 3000);
    return this.root;
  }
}