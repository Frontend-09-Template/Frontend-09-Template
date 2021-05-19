学习笔记
# CSS 总论
想要建立知识体系骨架，需要找到一个比较权威比较具有完备性的一个线索。CSS标准的状态非常复杂，知识并不是有人总结好了，会分布于各种不同的文档当中。学习CSS首先要找到这样的一个线索。老师个人喜欢用语法作为了解语言的入口。CSS作为语言，也不例外，也有自己的语法。但是因为CSS标准是分散开的，一个比较完整的版本是CSS2.1的语法。

# CSS 语法

CSS2.1的语法:
- https://www.w3.org/TR/CSS21/grammar.html#q25.0
- https://www.w3.org/TR/css-syntax-3/

产生式：
- 方括号：组
- 问号(?)：可以存在，可以不存在
- 单竖线(|): 或
- 星号(*): 0个或多个

总体结构：
- @charset stylesheet 允许一个charset的结构, css的字符集一般不需要自己去设置，和HTML一致
- @import 允许若干个import
- 长列表：
  - ruleset(普通的CSS规则，我们常编写的CSS) 
  - @media media(CSS3 media query)
  - @page page(主要用于打印的一些信息)


# CSS @规则
CSS 2.1 知识结构图：

- At-rules
  - @charset: https://www.w3.org/TR/css-syntax-3/ 字符集
  - @import: https://www.w3.org/TR/css-cascade-4/ 导入
  - @media: https://www.w3.org/TR/css3-conditional/ 媒体（important)
  - @page: https://www.w3.org/TR/css-page-3/  通常用于打印
  - @counter-style: https://www.w3.org/TR/css-counter-styles-3  定义样式规则
  - @keyframes: https://www.w3.org/TR/css-animations-1/   定义动画
  - @fontface: https://www.w3.org/TR/css-fonts-3/ 字体（重点）
  - @supports: https://www.w3.org/TR/css3-conditional/   检查CSS的功能是否存在，不建议使用，建议用工程工具
  - @namespace: https://www.w3.org/TR/css-namespaces-3/  命名空间，在极端的情况下，作为补充去用

  有一些@规则未列出：document、color-profile(SVG1.0，已废弃)、font-feature

- rule
  - 选择器 Selector
    - https://www.w3.org/TR/selectors-3/  实现的比较好的
    - https://www.w3.org/TR/selectors-4/  在标准制定的途中
    - seletor-group
    - selector： >、<sp> 、+、 -
    - simple_selector： type、*、.、#、[]、:、::、:not()
  - 声明
    - key
      - properties 普通的属性定义
      - variables: https://www.w3.org/TR/css-variables/  双减号开头（--）可以声明变量
    - value: https://www.w3.org/TR/css-values-4/ 整形、百分比、浮点型，长度单位，弧度，频率，函数（min,max,clamp,calc,attr)

``` css
  div {
    background-color: blue;
  }
  :root { --not-a-color: 20px}
```
# 收集标准

- 打开 W3C 官网：https://www.w3.org/TR/?tag=css
- 打开控制台，输入

```js
JSON.stringify([...container.children].filter(e=>e.getAttribute('data-tag').
  match(/css/)).map(e=>({name:e.children[1].innerText,url:e.children[1].children[0].href})))
```
- 复制控制台打印的内容到一个文件中备用
- 编写爬虫代码，见 css-crawler.js 主要思路是： 将W3C的页面替换为我们创建的 iframe，然后监听 iframe 的 load 事件，再根据之前收集的 url 列表，每次 load 完成之后（通过Promise 来控制）修改iframe 的 src 为下一个url
- CSS 标准使用一个带 propdef 类名的 table 来描述属性，所以我们在 iframe 加载完 url 后，获取 带类名 propdef 的元素即可

```
console.log(iframe.contentDocument.querySelectorAll('.propdef'));
```

# CSS 选择器

1. 选择器语法
- 简单选择器
  -  ```*``` 通配符
  -  ```type选择器``` 如： div svg|a  HTML 是有命名空间的，主要有三个： HTML、SVG、MathML 如果想选择SVG 或者 MathML 中的元素，需要用到 ```|```，如 ```svg|a``` 在HTML里面命名空间是冒号，需要使用 @namespace去声明
  - class 类选择器
  - id 选择器
  - 属性选择器 ```[attr=value] 支持匹配模式
  - 伪类选择器 ```hover``` 元素的特殊状态
  - 伪元素选择器 ```::before``` 提倡双冒号写法

- 复合选择器
  - <简单选择器><简单选择器><简单选择器> 多个简单选择器组合
  - * 或者 type选择器 必须写在最前面

- 复杂选择器
  - <复和选择器><sp><复合选择器> 子孙选择器（空格连接）
  - <复合选择器>">"<复合选择器> 父子选择器
  - <复合选择器>"~"<复合选择器> 相邻选择器（首个）
  - <复合选择器>"+"<复合选择器> 相邻选择器（所有）
  - <复合选择器>"||"<复合选择器> 做表格时，选中某一列（Selector level4）

2. 选择器的优先级
- 简单选择器
```js
#id div.a#id{
    //...
}
specificity:[0,     2,      1,      1]  
                    id    class     type
```
S = 0 * N ** 3 + 2 * N ** 2 + 1 * N ** 1 + 1

取 N = 1000000
S = 2000001000001

请写出下面选择器的优先级： 
- div#a.b .c[id=x] 0 1 3 1 
- #a:not(#b) 0 2 0 0 
- *.a 0 0 1 0 
- div.a 0 0 1 1

```
function calculate(arr) {
  let N = 256 ** 2;
  return arr[0] * N ** 3 + arr[1] * N ** 2 + arr[2] * N + arr[3];
}

calculate([0,1,3,1]);  // 4295163905
calculate([0,2,0,0]);  // 8589934592
calculate([0,0,1,0]);  // 65536
calculate([0,0,1,1]);  // 65537

```

# 选择器 | 伪类

- 链接/行为
  - :any-link 任一超链接
  - :link :visited  超链接  已经访问过的超链接  一旦使用了这两个就没办法去更改文字颜色之外的属性了，主要是从安全方面考虑的
  - :hover 鼠标悬停状态
  - :active 激活状态，点击的一瞬间触发
  - :focus 聚焦状态
  - :target  作为锚点的 a 标签使用的

- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child :last-child :only-child

- 逻辑型
  - :not 伪类
  - :where :has

  # 伪元素
  ::before 元素内容的前面
  ::after 元素内容的后面
  ::first-line 选中第一行
  ::first-letter 选中第一个字母


  ::before和::after的declaration中可以设置content属性，只要写了content属性，就可以像一个真正的DOM元素一样，可以去生成盒，来参与后续的排版和渲染，也可以指定border、background等属性。可以理解为，就是通过选择器向界面上添加了一个不存在的元素

  带有::before的选择器，就是给选中的元素的内容的前面增加了一个元素，可以通过content属性，为这个元素添加文本内容，我们可以任意指定这个元素的display ::after与::before仅选中的位置不同


  ```html
  <div>
  <::defore/>
  content content content content
  content content content content
  content content content content
  content content content content
  <::after/>
  </div>
  ```

::fisrt-line和::fisrt-letter的机制是：通过一个不存在的元素把一部分文本括起来，让我们可以对它做一些处理 ::fisrt-letter：相当于我们用一个元素把内容里面的第一个字母括起来，可以添加任意属性，但是无法修改content ::fisrt-line：选择的是排版之后的第一行，假如浏览器提供的渲染宽度不同，有可能控制的字符数量不同，需要根据需求决定是否使用。

```html
<div>
<::fitst-letter>c</::first-letter>
content content content content
content content content content
content content content content
content content content content
content content content content
</div>

```


可用属性统计：
::fisrt-line

- font系列
- color系列
- background系列
- word-spacing
- letter-spacing
- text-decoration
- text-transform
- line-height

::first-letter
- font系列
- color系列
- background系列
- word-spacing
- letter-spacing
- text-decoration
- text-transform
- line-height
- float
- vertical-align
- 盒模型系列：margin，padding，border

