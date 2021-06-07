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

  将tick函数进一步放封装即得到Timeline类，详见animation.js