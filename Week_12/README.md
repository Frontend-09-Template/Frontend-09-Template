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
1. 收集盒盒文字进行
1. 计算盒盒文字在行中的排布
1. 计算行的排布

具体你的排布规则：
1. 当盒 (inline-level-box) 和文字在一个行里面的时候，是从左往右排的，意味着文字和盒有一个对齐规则。inline-level-box 和 文字排出来的行，我们把它叫做行盒(line-box)
1. 有一些大块的，比如插入一个统计的表格，高度比较高，放到一行比较奇怪，所以要让它单独占一行，这一类的盒我们把它叫做block-level-box(块级盒)

**从整体来看，一个正常流中，就是一个一个的line-box和bloack-level-box从上到下的排布**
1. 如果没有block-level-box，那就只有line-box
1. 也有可能没有line-box，只有block-level-box
