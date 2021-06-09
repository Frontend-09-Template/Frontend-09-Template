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