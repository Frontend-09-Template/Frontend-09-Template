import {  Component, createElement } from "./framework";

class Carousel extends Component{
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

    let position = 0;  // 记录当前处于哪一张图（0~4）

    // 鼠标拖动播放，给root增加一个鼠标事件
    this.root.addEventListener("mousedown", (event) => {
      let children = this.root.children;
      let startX = event.clientX;
      
      let move = event => {
        let x = event.clientX - startX;  // 计算鼠标拖动的距离
        for (let child of children) {
          child.style.transition = "none";
          child.style.transform = `translateX(${- position * 500 + x}px)`;
        }
      }

      let up = event => {
        let x = event.clientX - startX;  // 计算鼠标拖动的距离(往左划x为负)
        position = position - Math.round(x / 500);  // 拖动的距离如果超过图片的一半宽度就移动到下一个图片，没超过一半则显示当前的图片
        for (let child of children) {
          child.style.transition = "";
          child.style.transform = `translateX(${- position * 500}px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);

    });


    // 自动播放：加上时间的控制，每3s执行一次
    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;  //
    //   let current = children[currentIndex];
    //   let next = children[nextIndex];
    //   next.style.transition = "none";
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;   // 矫正偏移
    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`;

    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 3000);
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}


let d = [
  'https://pics5.baidu.com/feed/63d0f703918fa0eccf953e747b90c5e63d6ddb0d.jpeg?token=7d2d3d9497b0b8bea9319988a84d5375',
  'https://pics5.baidu.com/feed/a044ad345982b2b767accc3b6daa57e776099b2a.jpeg?token=d7296f48c6b65020fc3a246a7a9f3715',
  'https://pics5.baidu.com/feed/38dbb6fd5266d016f413188605774f0f34fa35ff.jpeg?token=48e1d7d0851b89495f8d8b5f296ac5bc',
];


let a = <Carousel src={d} />;

a.mountTo(document.body);