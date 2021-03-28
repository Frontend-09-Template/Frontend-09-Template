# proxy 与双向绑定 学习笔记

1. proxy可以拦截对象的原生方法（对对象进行监听或改变其行为），可以用于写一些底层的库，但是这种元编程的特性可能带来一些不可预测性(可预测性降低)，不建议用在日常开发中。
```js
// Proxy 可以代理整个对象 不限层级，所以Vue3 中取消了$set $delete api
// 第一个参数是object，第二个参数是config 可以改变对象的行为
let object = {};
new Proxy(object, {
  set (obj, prop, val) {},
  get (obj, prop) {},
  deleteProperty(obj, prop) {},
})
```

2. vue3.0 拆出了一个 reactive 的包，使用 Proxy 来实现，实现了一个包装函数，对 Proxy 进行包装，返回一个 new Proxy()。包装多个对象，可以复用 reactive 的代码。
```js
let object = {
  a: 1,
  b: 2,
};

let po = reactive(object);

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val;
    },
    get(obj, prop) {
      return obj[prop];
    },
  });
}
```

3. 双向绑定的重难点在于JS对象的数据到DOM的数据监听，因为DOM到JS方向的数据监听可以通过DOM的事件(addEventListener)来实现。vue reactive api 中，利用 effect 来调用一次回调函数，来监听对象属性的改变，并记录所有响应了这次事件的元素及其属性(通过proxy的get方法)，保存到全局的callbacks（Map）中，保存对象、属性，以及它响应的回调函数列表；当之后再改变这些对象的属性时，就会触发相关的回调函数(通过proxy的set方法遍历callbacks)，可以借助这点实现数据变更时触发DOM更新的效果。
```js
  let callbacks = new Map();
  let usedReactivties = [];   // 用来保存用到的变量

  function effect(callback) {
    // callbacks.push(callback);
    useReactives = [];
    callback();
    console.log(usedReactivties);

    for (let reactivity of usedReactivties) {
      if (!callbacks.has(reactivity[0]))
        callbacks.set(reactivity[0], new Map());
      if (!callbacks.get(reactivity[0]).has(reactivity[1]))
        callbacks.get(reactivity[0]).set(reactivity[1], []);
      callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }
  }

  function reactive(object) {
    return new Proxy(object, {
      set(obj, prop, val) {
        obj[prop] = val;
        if (callbacks.get(obj)) {
          if (callbacks.get(obj).get(prop)) {
            for (let callback of callbacks.get(obj).get(prop)) {
              callback();
            }
          }
        }
        return obj[prop];
      },
    });
  }
```

4. mousemove这类事件更适合绑定到全局的 document 对象上，而不是绑定到某个局部的 dom 对象上，避免出现鼠标移速过快时出现“拖断”现象。可以通过在 mousedown 事件中添加 document 的 mousemove 监听，并在事件结束时移除 document 的 mousemove 监听来实现，mousedown之内调用mousemove 和 mouseup是一个好用的小技巧。


5. 拖动块在流中， 利用CSSOM API getBoundingClientRect()获取当前位置，完成编写拖动滑块
```js
// 返回元素的大小及其相对于视口的位置
element.getBoundingClientRect()

// 创建一个range对象
document.createRange()
```