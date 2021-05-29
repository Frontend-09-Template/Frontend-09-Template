学习笔记



# 浏览器API

## 5. 事件 API

## 6. Range API

RangeAPI首先是如何去创建一个Range。range 可以理解为 HTML DOM 文档流里面有 起始点 和 终止点 的一段范围。range 是不能跳的。可以有多个 range，但是每一个 range 它一定是连续的范围。range 的选择范围非常的灵活。

```js
// 创建和获取range
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);

var range1 = document.getSelection().getRangeAt(0);
```

**Range API**
+ range.setStart
+ range.setEnd
+ range.setStartBefore
+ range.setEndBefore
+ range.setStartAfter
+ range.setEndAfter
+ range.selectNode
+ range.selectNodeContents  选中一个元素的所有内容
+ range.extractContents()  把 range 里面选的内容完全从 DOM 树里面摘出来
+ range.insertNode(document.createTextNode("aaa"))  插入Node节点

range API的相关练习，详见： range.html

**问题：把一个元素所有的子元素逆序**

```markdown
1         5
2         4
3         3
4         2
5         1
```

1. 普通方法  详见： reverse1.html
```js
  let element = document.getElementById('a');

  function reverseChildren(element) {
    let children = Array.prototype.slice.call(element.childNodes);

    for (let child of children) {
      element.removeChild(child)
    }

    children.reverse();

    for (let child of children) {
      element.appendChild(child)
    }
  }

  reverseChildren(element);
```

DOM 的 collection 是一个 living collection. 取出来的值会动态的变化。可以通过 `Array.prototype.slice.call()`方法把element放入Array，因为Array不是living collection，不随着DOM的变化而变化。


2. 使用Range API 进行高效的代码操作。 详见： reverse2.html

```js
let element = document.getElementById('a');

  function reverseChildren(element) {
    let range = new Range();
    range.selectNodeContents(element);

    let fragment = range.extractContents();

    var l = fragment.childNodes.length;
    while(l-- > 0) {
      fragment.appendChild(fragment.childNodes[l]);
    }
    element.appendChild(fragment);
  }

  reverseChildren(element);
```
## 7. CSSOM 基础API

+ document.styleSheets  CSS的一切API都要通过这个属性访问
  - Rules
    + document.styleSheets[0].cssRules
    + document.styleSheets[0].insertRule("p { color: pink; }", 0)
    + document.styleSheets[0].removeRule(0)
  - Rule
    + CSSStyleRule
      - selectorText String
      - style K-V 结构
    + CSSCharsetRule
    + CSSImportRule
    + CSSMediaRule
    + CSSFontFaceRule
    + CSSPageRule
    + CSSNamespaceRule
    + CSSKeyframesRule
    + CSSKeyframeRule
    + CSSSupportsRule
    + ......
+ 案例

```html
<style title="Hello">
  a::before {
    color: red;
    content: "Hello"
  }
</style>
<link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">
<a>word</a>
```

练习 详见 stylesheet.html

**getComputedStyle**
获取页面元素最终渲染的样式
+ window.getComputedStyle(elt, pseudoElt);
  - elt 想要获取的元素
  - pseudoElt 可选，伪元素

+ 使用场景
  - 比如元素需要做拖拽，获取元素的transform
  - CSS动画的中间态，想要暂停动画，没有办法DOM API，style和cssRule判断播到哪了，需要使用getComputedStyle去获取实时的状态

```js
  document.styleSheets[0].cssRules[0].style.color = 'lightgreen';

  getComputedStyle(document.querySelector('a'))

  getComputedStyle(document.querySelector('a'), "::before").color
```

## 8. CSSOM View

+ 获取layout和render后的一些信息
+ CSSOM View 主要和浏览器最后画上去的视图相关

**window**
+ window.innerWidth，window.innerHeight 浏览器实际渲染html内容的区域的宽高
+ window.outerrWidth，window.outerHeight 浏览器窗口总共占的宽高，包括工具栏
+ window.devicePixelRatio
  - 屏幕上的物理像素和代码里面的逻辑像素px之间的比值
  - 正常的设备，比值是1:1，retina屏上是1:2，在有些安卓机上还有可能是1:3
+ window.screen 屏幕的信息
+ window.screen.width 屏幕宽
+ window.screen.height 屏幕高
+ window.screen.availWidth 屏幕可用宽
+ window.screen.availHeight 屏幕可用高（去除物理按键占用的部分，取决于硬件配置）

**Window API**
+ window.open("about:blank", "_blank", "width=100,height=100,left=100,right=100")
  - 原始的标准里面的定义只有两个参数，但是CSSOM的Window API给它加了第三个参数
  - 我们可以指定，我们打开的窗口的宽高和在屏幕上所处的位置
+ moveTo(x,y); 移动我们自己创建的窗口的位置，直接修改为目标值
+ moveBy(x, y); 移动我们自己创建的窗口的位置，在原来的基础上增加值
+ resizeTo(x, y); 修改我们自己创建的窗口的位尺寸，直接修改为目标值
+ resizeBy(x, y); 修改我们自己创建的窗口的位尺寸，在原来的基础上增加值

**scroll API**

scroll元素

+ scrollTop 当前元素当前滚动到的位置（垂直方向）
+ scrollLeft 当前元素滚动到的位置（水平方向）
+ scrollwidth 可滚动类型的最大宽度
+ scrollHeight 可滚动类型的最大高度
+ scroll(x, y) 滚动到一个坐标位置
+ scrollBy(x, y) 在当前基础上滚动一段距离
+ scrollIntoView() 滚动到元素的可见区域

window元素

+ scrollX 窗口水平方向滚动到的位置，对应元素的scrollLeft
+ scrollY 窗口垂直方向滚动到的位置，对应元素的scrollTop
+ scroll(x,y) 和元素scroll的一致
+ scrollBy(x,y) 和元素scrollBy的一致

layout API 获取浏览器layout之后，元素的位置大小信息

+ el.getClientRects() 获取元素内部生成的所有盒的位置大小信息
+ el.getBoundingClientRect() 获取元素本身占用的位置和大小信息

```html
<style>
    .x::before{
        content:"额外 额外 额外 额外 额外";
        background-color:pink;
    }
</style>

<div style="width:100px;height:400px;overflow:auto;">
    文字<span class="x" style="background-color:lightblue;">文字 文字 文字 文字 文字 文字 文字</span>
</div>
<script>
    var x = document.getElementsByClassName('x')[0];
    //获取x元素layout时内部生成的所有盒的信息（会有多个盒产生，是一个数组），并且x的伪元素也会参与到生成盒的过程中
    console.log(x.getClientRects());
    //获取x元素layout时包含所有内部生成盒的容器的信息，这个容器的大小等同于元素的实际占用的空间大小
    console.log(x.getBoundingClientRect());
</script>
```

详见 rect.html