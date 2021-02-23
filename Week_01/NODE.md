JavaScript的异步机制：
1. callback
1. Promise promise是一个链式表达式的形式，相对callback更友好一些。
1. async/await 是Promise机制的语法上的支持和封装，运行时实际上也是通过Promise去管理异步的。 以描述同步代码的方式写异步代码。

generator与异步
1. generator模拟 async/await
1. async generator （对应 for await of 语法）
```js
function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}
async function* counter() {
  let i = 0;
  while(true) {
    await sleep(1000);
    yield i++;
  }
}
(async function(){
  for await(let v of counter()){
    console.log(v);
  }
})();
// Promise {pending} 每隔一秒i + 1; 从0开始输出 0 1 2 3 ...
```