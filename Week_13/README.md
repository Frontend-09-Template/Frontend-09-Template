学习笔记
# 重学HTML
 ## 1. XML与SGML
**DTD与XML namesapce**
+ http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
+ http://www.w3.org/1999/xhtml

**从DTD了解HTML**
+ DTD是SGML规定的定义它的子集的文档的格式
+ HTML最早设计出来是SGML的一个子集，所以它有这个DTD

重点：
lat
+ &nbsp  空格，不会把单词分开（如果想要多个空格，推荐使用white-space属性）
symbol
+ &Omega、&alpha、&lambda 等特殊符号
special
+ quot  "
+ amp  &
+ lt  <
+ gt   >

namespace
+ HTML
+ XHTML
+ MathML
+ SVG

## 2. 标签语义

`<header>` `<aside>` `<article>` `<section>` `<figure>` 

## 3. HTML语法

合法元素
+ Element:`<tagName>...</tagName>`
+ Text:text
+ Comment:`<!--comments-->`
+ DocumentType:`<!Doctype html>`
+ ProcessingInstruction:`<?a 1?>` 预处理
+ CDATA:`<![CDATA[]]>` 一种语法，产生的也是文本节点，不需要考虑转义问题

字符引用
+ `&#161;` 
+ `&amp;`
+ `&lt;`
+ `&quot;`


# 浏览器API

## 4. DOM API

Node
+ Element：元素型节点，跟标签对应
    - HTMLElement
        - HTMLAnchorElement
        - HTMLAppletElement
        - HTMLAreaElement
        - HTMLAudioElement
        - HTMLBaseElement
        - HTMLBodyElement
        ...
    - SVGElement
        - SVGAElement
        - SVGAltGlyphElement
        ...
+ Document:文档根节点
+ CharacterData字符数据
    - Text:文本节点 
        - CDATASection:CDATA节点
    - Comment：注释
    - ProcessingInstruction:处理信息
+  DocumentFragment:文档片段
+ DocumentType:文档类型

导航类操作
+ Node
    - parentNode
    - childNodes
    - firstChild
    - lastChild
    - nextSibling
    - previousSibling
+ element
    - parentElement
    - children
    - firstElementChild
    - lastElementChild
    - nextElementSibling
    - previousElementSibling

修改操作(都是对子元素的操作)
+ appendChild 添加一个节点到所有子元素的后面
+ insertBefore 插入一个节点到某个子元素的前面
+ removeChild 删除一个子元素
+ replaceChild 替换一个子元素

高级操作
+ compareDocumentPosition 是一个用于比较两个节点中关系的函数
+ contains 检查一个节点是否包含另一个节点的函数
+ isEqualNode 检查两个节点是否完全相同
+ isSameNode 检查两个节点是否是同一个节点，实际在JavaScript中可以使用“===”
+ cloneNode 复制一个节点，如果传入参数true，会连同子元素做深拷贝

## 5. 事件 API
**addEventListener(type, listener, options)**

+ type 定义要监听的事件类型
+ listener 必须是一个JS函数或者是实现了EventListener接口的对象
+ options
  - capture boolean类型，表示是否在捕获阶段触发listener
  - once boolean类型，设置为true，listener会被触发调用一次之后移除
  - passive boolean类型，设置为true时，在listener内部不可调用preventDefault（可以用于移动端滑动事件优化）

**Event:冒泡与捕获**

+ 冒泡和捕获是浏览器处理事件的一种机制，在任何一个事件的触发过程中都会发生，而和我们是否添加监听没有关系
+ 任何一个事件都是先捕获后冒泡
  - 捕获阶段：我们手中的鼠标并不能提供我们到底点在哪个元素上的信息，需要通过浏览器的计算才能得到，也就是从外到内，一层一层的去计算，到底这个事件发生在哪个元素上，这就是捕获的过程（从外到内）
  - 冒泡阶段：我们已经算出来，触发事件的是哪个元素，层层的向外去触发，让外层元素响应这个事件的过程，更符合人类的直觉（从内向外）。
+ 默认添加的是冒泡阶段执行的listener，里层的元素的listener会先执行，然后才会一层一层执行外层的listener
+ 如果外层元素添加了捕获阶段执行的listener，会先从外层向内依次执行捕获阶段执行的listener（不包括触发事件的元素）
+ 触发事件的元素的listener触发的顺序和添加顺序一致（不区分捕获还是冒泡，都是按添加顺序来执行的）备注：最新版Chrome规则修改了，触发事件的元素也会先触发捕获模式的listener，再触发冒泡模式的listener

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

## 9. 其他API
标准化组织：
+ khronos
  - WebGL
+ ECMA
  - ECMAScript
+ WHATWG
  - HTML
+ W3C
  - webaudio
  - CG/WG

作业：所有API的分类与整理
详见 apis.html