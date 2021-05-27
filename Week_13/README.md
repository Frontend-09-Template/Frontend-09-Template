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

```js
  document.styleSheets[0].cssRules[0].style.color = 'lightgreen';

  getComputedStyle(document.querySelector('a'))

  getComputedStyle(document.querySelector('a'), "::before").color
```

## 8. CSSOM View