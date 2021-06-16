学习笔记

# 轮播组件

## 1. 手势动画应用

做架构的拆分，独立的管理 animation, gesture, carousel

+ css animation 改为 JS Animation
+ 增加gesture应用

**时间线和动画处理**
```js
// 初始化时间线
let timeline = new Timeline();
timeline.start();

// 添加动画
let a = new Animation(current.style, "transform", (-position * 500), (-500 - position * 500), 500, 0, ease, v => `translateX(${v}px)`);
let a_next = new Animation(next.style, "transform", (500 - nextIndex * 500), (-nextIndex * 500), 500, 0, ease, v => `translateX(${v}px)`);
timeline.add(a);
timeline.add(a_next);
position = nextIndex;
```
详见：carousel-01/carousel.js

**处理动画和手势的结合**

+ 在carousel中，不管是否拖动图片，鼠标执意要放上去，动画就要停止。
+ 增加start 事件，不管是鼠标还是触屏，让时间线停下，然后重启。
+ 处理动画的位移，animation 造成位移的概念，动画的距离算进拖拽的距离。
  

```js
let t = 0;   // 保存动画的总时间
let ax = 0;  // 动画生成的位移
let handler = null;

this.root.addEventListener("start", event => {
  timeline.pause();
  clearInterval(handler);
  let progress = (Date.now() - t) / 1500;   // 计算动画时间的进度
  ax = ease(progress) * 500 - 500;
});

this.root.addEventListener("pan", event => {
  let x = event.clientX - event.startX - ax;
  ...
});

this.root.addEventListener("panend", event => {
  let x = event.clientX - event.startX- ax;
});

let nextPicture = () => {...};

handler = setInterval(nextPicture, 3000);

```
详见：carousel-01/carousel.js

**改造guesture事件**

+ 在start事件中，dispatch事件“start”，传递clientX和clientY
```js
this.dispatcher.dispatch("start", {
  clientX: point.clientX,
  clientY: point.clientY,
}); // 触发自定义事件press
```
详见： carousel-01/guesture.js 
