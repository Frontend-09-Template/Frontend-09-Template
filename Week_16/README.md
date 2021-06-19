学习笔记

# 轮播组件

## 1. 手势动画应用

做架构的拆分，独立的管理 animation, gesture, carousel

+ 组件的主要机制
  - 合理规划事件的监听与派发
  - 统一的数据入口
  - 子组件渲染：模板渲染、函数渲染

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

+ 在carousel中，不管是否拖动图片，鼠标只要放上去，动画就要停止。
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

## 2. 为组件添加更多属性(一)

carousel render 函数中有许多函数级作用域变量：
+ timeline 用来播放动画
+ handler 用来播放定时，三秒钟一帧的技术
+ children 保存图片
+ position 代表当前滚动的位置，代表了一种状态，用户可能通过代码强行更改 position
+ t和ax  不同的事件之间去通讯所使用的的局部的状态

所以提取STATE和ATTRIBUTE，以及加入事件机制

+ 组件的状态和属性都可以作为私有变量，前者主要给业务开发者使用，后者给组件开发者使用
+ 组件中可以通过在属性中指定 onXxx 属性接受用户传入的回调函数，组件的设计者负责在组件运行的适当时机调用该函数

详见 carousel-02

## 3. 为组件添加更多属性（二）

内容型的children和模版型children的区别：
+ 内容型的children，放几个children就会实现几个children，普通的children直接在模版里写。
+ JSX模版型的children是通过在children里放函数的形式去实现的。组件内部去根据模板函数生成元素并添加到组件内部使用。

```js
// 内容型children
let a = <Button>
  content
</Button>;
a.mountTo(document.body);


import {  Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";

export { STATE, ATTRIBUTE } from "./framework";

export class Button extends Component{
  constructor() {
    super(); 
  }
  render() {
    this.childContainer = <span />;
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}
```
详见 carousel-03-button

```js
// JSX模版型的children
let a = <List data={d}>
  { (record) => 
    <div>
      <img src={record.img} />
      <a href={record.url}>{record.title}</a>
    </div>
  }
</List>;
a.mountTo(document.body);

import {  Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "./gesture";

export { STATE, ATTRIBUTE } from "./framework";

export class List extends Component{
  constructor() {
    super(); 
  }
  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = (child);
    this.render();
  }
}
```
详见 carousel-03-list
