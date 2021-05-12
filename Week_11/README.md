学习笔记
# CSS 总论
想要建立知识体系骨架，需要找到一个比较权威比较具有完备性的一个线索。CSS标准的状态非常复杂，知识并不是有人总结好了，会分布于各种不同的文档当中。学习CSS首先要找到这样的一个线索。老师个人喜欢用语法作为了解语言的入口。CSS作为语言，也不例外，也有自己的语法。但是因为CSS标准是分散开的，一个比较完整的版本是CSS2.1的语法。

# CSS 语法
产生式：
- 方括号：组
- 问号(?)：可以存在，可以不存在
- 单竖线(|): 或
- 星号(*): 0个或多个

总结结构：
- @charset stylesheet 允许一个charset的结构
- @import 允许若干个import
- 长列表：
  - ruleset(普通的CSS规则) 
  - @media media(CSS3 media query)
  - @page page(主要用于打印的一些信息)


# CSS @规则
知识结构图：

- At-rules
  - @charset: https://www.w3.org/TR/css-syntax-3/
  - @import: https://www.w3.org/TR/css-cascade-4/
  - @media: https://www.w3.org/TR/css3-conditional/
  - @page: https://www.w3.org/TR/css-page-3/
  - @counter-style: https://www.w3.org/TR/css-counter-styles-3  定义样式规则
  - @keyframes: https://www.w3.org/TR/css-animations-1/   定义动画
  - @fontface: https://www.w3.org/TR/css-fonts-3/
  - @supports: https://www.w3.org/TR/css3-conditional/   检查CSS的功能是否存在，不建议使用，建议用工程工具
  - @namespace: https://www.w3.org/TR/css-namespaces-3/  在极端的情况下，作为补充去用

- rule
  - 选择器 Selector
    - https://www.w3.org/TR/selectors-3/  实现的比较好的
    - https://www.w3.org/TR/selectors-4/  在标准制定的途中
    - seletor-group
    - selector： >、<sp> 、+、 -
    - simple_selector： type、*、.、#、[]、:、::、:not()
  - 声明
    - key
      - properties
      - variables: https://www.w3.org/TR/css-variables/  双减号开头（--）可以声明变量
    - value: https://www.w3.org/TR/css-values-4/ 整形、百分比、浮点型，长度单位，弧度，频率，函数（min,max,clamp,calc,attr)

``` css
  div {
    background-color: blue;
  }
  :root { --not-a-color: 20px}
```



