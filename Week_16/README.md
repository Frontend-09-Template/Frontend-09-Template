学习笔记

# 轮播组件

## 1. 手势动画应用

做架构的拆分，独立的管理 animation, gesture, carousel

+ css animation 改为 JS Animation
+ 增加gesture应用


```js
// 初始化时间线
let timeline = new Timeline();
timeline.start();

// 添加动画
let a = new Animation(current.style, "transform", (-position * 500), (-500 - position * 500), 500, 0, ease, v => `translateX(${v}px)`);
let a_next = new Animation(next.style, "transform", (500 - nextIndex * 500), (- nextIndex * 500), 500, 0, ease, v => `translateX(${v}px)`);
timeline.add(a);
timeline.add(a_next);
position = nextIndex;
```

start 事件，不管是鼠标还是触屏，让时间线停下，然后重启。

```js
let t = 0;
let ax = 0;
let handler;

this.root.addEventListener("start", event => {
  timeline.pause();
  clearInterval(handler);
  let progress = (Date.now() - t) / 1500;
  ax = ease(progress) * 500 - 500;
})
```

animation 造成位移的概念，动画的距离算进拖拽的距离
