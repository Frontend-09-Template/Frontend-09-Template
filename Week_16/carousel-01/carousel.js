import {  Component } from "./framework";
import { enableGesture } from "./gesture";
import { Timeline, Animation } from "./animation";
import { ease } from "./ease";

export class Carousel extends Component{
  constructor() {
    super(); // 调用父类的构造函数，构造函数中的this指向当前创建的实例(必须调用)
    this.attributes = Object.create(null); // 初始化存储属性的对象
  }
  // 重写setAttribute
  setAttribute(name, value) {
    this.attributes[name] = value; // 存储属性和值
  }
  render() {
    this.root = document.createElement("div");  // 默认创建一个 div
    // 设置样式
    this.root.classList.add('carousel');
    for (let record of this.attributes.src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(child);
    }
    // 给root注册enableGesture
    enableGesture(this.root);

    // 初始化时间线
    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;

    let position = 0;  // 记录当前处于哪一张图（0~4）

    let t = 0;   // 保存动画的总时间
    let ax = 0;  // 动画生成的位移
    let handler = null;

    // 增加start 事件，不管是鼠标还是触屏，让时间线停下，然后重启。
    this.root.addEventListener("start", event => {
      timeline.pause();
      clearInterval(handler);
      let progress = (Date.now() - t) / 1500;   // 计算动画时间的进度
      ax = ease(progress) * 500 - 500;
    });

    this.root.addEventListener("pan", event => {
      let x = event.clientX - event.startX - ax;
      let current = position - (x - x % 500) / 500; // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）

      for(let offset of [-1, 0, 1]){  
        let pos = current + offset;  // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
        pos = (pos % children.length + children.length) % children.length;  // 把-1转为3，-2转为2，-3转为1
        children[pos].style.transition = "none";   // 取消动画
        children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + x % 500}px)`;
      }
      console.log(event.clientX - event.startX);
    });

    this.root.addEventListener("panend", event => {
      timeline.reset();

      let x = event.clientX - event.startX - ax;
      let current = position - (x - x % 500) / 500; // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）

      for(let offset of [-1, 0, 1]){  
        let pos = current + offset;  // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
        pos = (pos % children.length + children.length) % children.length;  // 把-1转为3，-2转为2，-3转为1
        children[pos].style.transition = "none";   // 取消动画
        children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + x % 500}px)`;
      }
    });

    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextIndex];

      // 计算动画产生的距离
      t = Date.now();  // 保存动画开始的时间
      
      // 增加手势后，在监听start之后，此处代码不再使用
      // next.style.transition = "none";
      // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;   // 矫正偏移

      // 添加动画
      let a = new Animation(current.style, "transform", (-position * 500), (-500 - position * 500), 1500, 0, ease, v => `translateX(${v}px)`);
      let a_next = new Animation(next.style, "transform", (500 - nextIndex * 500), (-nextIndex * 500), 1500, 0, ease, v => `translateX(${v}px)`);
      timeline.add(a);
      timeline.add(a_next);
      position = nextIndex;


      // setTimeout(() => {
      //   next.style.transition = "";
      //   current.style.transform = `translateX(${-100 - position * 100}%)`;
      //   next.style.transform = `translateX(${- nextIndex * 100}%)`;

      //   position = nextIndex;
      // }, 16);
    };

    // 加上时间处理
    handler = setInterval(nextPicture, 3000);





    // 鼠标拖动播放，给root增加一个鼠标事件
    /*
    this.root.addEventListener("mousedown", (event) => {
      let children = this.root.children;
      let startX = event.clientX;
      
      let move = event => {
        let x = event.clientX - startX;  // 计算鼠标拖动的距离
        // 优化
        // 计算当前拖动距离对应到哪一个图片了
        let current = position - (x - x % 500) / 500; // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）
        for(let offset of [-1, 0, 1]){  
            let pos = current + offset;  // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
            pos = (pos + children.length) % children.length;  // 把-1转为3，-2转为2，-3转为1
            children[pos].style.transition = "none";   // 取消动画
            children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + x % 500}px)`;
        }
      }

      let up = event => {
        let x = event.clientX - startX;  // 计算鼠标拖动的距离(往左划x为负)
        position = position - Math.round(x / 500);  // 拖动的距离如果超过图片的一半宽度就移动到下一个图片，没超过一半则显示当前的图片
        for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]){  
          let pos = position + offset; // 计算当前是哪个图片，可能为负值，所以要把负值转为正值
          pos = (pos + children.length) % children.length; // 把-1转为3，-2转为2，-3转为1
          children[pos].style.transition = ""; // 加上css动画
          children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500}px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);

    });
    */


    // 自动播放：加上时间的控制，每3s执行一次
    /**
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;  //
      let current = children[currentIndex];
      let next = children[nextIndex];
      next.style.transition = "none";
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;   // 矫正偏移
      setTimeout(() => {
        next.style.transition = "";
        current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${- nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 16);
    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}