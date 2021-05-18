学习笔记

# CSS排版

## 盒（Box）

```markdown
源代码       语义        表现

标签         元素         盒  
Tag        Element      Box
```

练习题：
```markdown
HTML代码中可以书写开始__标签__，结束__标签__ ，和自封闭_标签_ 。

一对起止__标签__ ，表示一个__元素__ 。

DOM树中存储的是__元素__和其它类型的节点（Node）。

CSS选择器选中的是__元素__(或者伪元素) 。

CSS选择器选中的__元素__ ，在排版时可能产生多个__盒__ 。

排版和渲染的基本单位是__盒__ 。
```

### 盒模型
1. 排版的基本单位。display: inline; 伪元素都会产生盒。
1. 是一个多层的结构，最里面的是`content`（内容）,`content`与`border`之间有一圈空白叫做`padding`（内边距）,`border`的外边又有一圈空白，叫做`margin`（外边距）；
1. 为什么要有`padding`和`margin`？
  - `padding`主要影响的是盒内的排版，`padding`决定了里面可排布的`content`区域的大小
  - `margin`主要影响的是盒本身的排版，`magin`决定了盒周围至少要存在的空白区域的大小
1. 盒模型的`width`和`height`，有可能被`box-sizing`属性去设置，`box-sizing`包含两种值：
  - `content-box`
  我们设置的`width`属性，只包含`content`内容，
  这时候盒排版所占用的空间为：`content-box的尺寸 + padding + border + margin`
  - `border-box`
  我们设置的`width`和`height`，包含了`padding`和`border`，
1. 刚开始只有`content-box`一种，不太符合人类的一般认知，所以后面打了个补丁，出现了`border-box`

### 正常流
正常流比 flex 更复杂

排版就是将字 和 盒 放到正确的位置


#### 正常流排版
1. 收集盒和文字进行
1. 计算盒和文字在行中的排布
1. 计算行的排布

具体你的排布规则：
1. 当盒 (inline-level-box) 和文字在一个行里面的时候，是从左往右排的，意味着文字和盒有一个对齐规则。inline-level-box 和 文字排出来的行，我们把它叫做行盒(line-box)
1. 有一些大块的，比如插入一个统计的表格，高度比较高，放到一行比较奇怪，所以要让它单独占一行，这一类的盒我们把它叫做block-level-box(块级盒)

**从整体来看，一个正常流中，就是一个一个的line-box和bloack-level-box从上到下的排布**
1. 如果没有block-level-box，那就只有line-box
1. 也有可能没有line-box，只有block-level-box

**每个line-box内部是一个从左到右的排布方式**

我们给这两种排布方式都起一个名字：
1. 排块级盒的就叫做块级格式化上下文（BFC：Block-Level-Formatting-Context）
1. 排行内的叫做行级格式化上下文（IFC：Inline-Level-Formatting-Context）

#### 正常流的行级排布
**BaseLine：基线的概念**
1. 英文中，四线格中倒数第二条线，就是英文的基线，英文就是以这个基线进行对齐的
1. 不同语言的文字的基线是不一样的
1. 中文是方块字，一般以文字的上缘和下缘作为基准线去对齐的，我们也认为中文是基于BaseLine对齐的，只是带了一定的偏移

**Text：字型**
1. 字符就是一个码点，具体的形状是由字体来决定的
1. C++ 的底层库 freeType 字体库抽象的一个定义：
    - 任何一个文字都有一个宽和一个高
    - 还必须存在一条基线的定义，如果不存在，字体是不成立的，没有办法去进行排版
    
1. 以横排为例
    - orgin表示的就是文字的基线的位置
    - 文字宽度为 xMax - xMin，高度为 yMax - yMin
    - bearingX决定了默认的字间距（左右都有）
    - 排版时一个字占用的空间叫advance（x轴），为字体的宽度和字间距之和


**行模型**
1. line-top 行的顶缘
1. text-top 文字的顶缘
1. base-line  基线（以英文为主的对齐）
1. text-bottom 文字的底缘
1. line-bottom 行的底缘

只要字体的大小不变，text-top 和 text-bottom 是不会变的；
如果使用的多种字体混排，text-top 和 text-bottom 是由最大的一个字体决定的；
如果行高大于文字的高度的时候，还会有 line-top 和 line-bottom；
如果仅包含文字，再加上sub，super，行模型也就这些了，但是如果涉及到与盒的混排，就会产生line-top和line-bottom的偏移问题:
  - 当盒足够大，并且是从text-bottom对齐的，那么它就有可能把高度撑开，line-top就会从原本的位置移到了盒顶部的位置；
  - 盒的先后顺序，盒的尺寸都会影响line-top和line-botom的位置，但是不会影响text-top和text-bottom；

行模型测试： 详见 line.html
  
  - 默认文字和盒的混排是：用盒的下边缘与文字的基线对齐（英文的）
  - 当盒中出现文字时,变成了：用盒中最后一行文字的基线与外边的文字的基线对齐
  - 所以一般不建议使用基线对齐，一般使用 `vertical-align:top` 进行行顶缘对齐 `vertical-align:bottom` 进行行底缘对齐 `vertical-align:middle` 进行行中心线对齐
  - 如果使用 `vertical-align:text-top` 进行文字顶缘对齐，会导致行底缘被撑开  `vertical-align:text-bottom` 进行文字底缘对齐，会导致行顶缘被撑开


  #### 正常流的块级排布
  