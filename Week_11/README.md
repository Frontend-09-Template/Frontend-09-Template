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

知识结构图：
- at-rules
  - @charset
  - @import
  - @media
  - @page

- rule
