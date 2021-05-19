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

## 正常流
正常流比 flex 更复杂

排版就是将字 和 盒 放到正确的位置


### 正常流排版
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

### 正常流的行级排布
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
  - 默认文字和盒的混排是：用盒的下边缘与文字的基线对齐（英文的）
  - 当盒中出现文字时，变成了：用盒中最后一行文字的基线与外边的文字的基线对齐
  - 所以一般不建议使用基线对齐，一般使用 `vertical-align:top` 进行行顶缘对齐 `vertical-align:bottom` 进行行底缘对齐 `vertical-align:middle` 进行行中心线对齐
  - 如果使用 `vertical-align:text-top` 进行文字顶缘对齐，会导致行底缘被撑开  `vertical-align:text-bottom` 进行文字底缘对齐，会导致行顶缘被撑开

  行模型测试： 详见 line.html

### 正常流的块级排布

**float和clear float**

- 可以视为先把元素排到页面的某个特定的位置，当它是正常流里的元素，如果有float，就向对应方向挤一下，
- 挤完之后，发现原来已经排好的文字位置已经不对了，所以会根据float元素占据的区域调整行盒的位置
- 因为其实计算位置的时候，这个时候，我们还没有去计算每一个文字的具体的位置，所以理论上讲，这个地方文字也是不需要重排的，只不过需要把行盒的尺寸，根据float产生的占据的宽度进行调整(float会影响行盒的尺寸)
- 当float元素出现后，不仅影响自己所在这一行，凡是它的高度所占据的范围内，所有的行盒都会根据这个float的元素的尺寸调整自己的大小，超出float的范围就不用考虑了
- 假如上面已存在一个float:right元素,这时又遇到一个float:right元素，这个float元素能浮动到的位置会受上一个float元素影响，不会占据上一个浮动元素的位置，会产生一个float相堆叠的效果，同样，后面的行盒会同时受到这个两个float元素的影响

**clear**

clear适用于float元素和非float元素

- 对于float元素来说clear其实是找到一块干净的空间来进行浮动，如果指定方向上有其他浮动元素，会浮动到其他浮动元素的下面一行
- 对于非float元素来说，clear会把当前元素移动到指定方向的所有浮动元素的下方

float布局： 详见 float-layout.html


**外边距折叠现象（Margin Collapse）**

这种现象出现的原因：
- 盒模型中，我们规定的盒的margin，仅仅是要求周围留有的这么多的空白，并不是说一定要和别的盒的外边距有这么大距离
- 这种外边距折叠现象只会出现在正常流的BFC中，不存在IFC，Flex，Grid中

## BFC

**Block**

- Block Container：里面有BFC的盒
- Block-level Box：外面有BFC的盒
- Block Box = Block Container + Block-level Box：里外都有BFC的盒

**Block Container**

+ block （注意1：block属于Block Container，里面有BFC）
+ inline-block
+ table-cell
+ flex item
+ grid cell
+ table-caption `<caption>表格标题</caption>`

总结：所有的里面不是必须容纳特定 display 元素的盒，默认都是正常流的，也就可以作为 Block Container

**Block-level Box**

大多数元素的display的值都是一对一对的，分别对应到Block level 和 Inline level

Block level Box只会外面有BFC

```markdown
Block level                                                  Inline-level
+ display:block（注意2：block属于Block level Box，外面有BFC）  + display:inline-block
+ display:flex                                               + display:inline-flex
+ display:table                                              + display:inline-table
+ display:grid                                               + display:inline-grid
+ ...                                                        + ...
特殊的：display:run-in 跟上个元素相同
```

**设立BFC**

+ floats 浮动元素内部
+ absolutely positioned elements 绝对定位的元素内部
+ block container that are not block boxes 不是块级盒子的block container
    比如：
    + inline-block
    + table-cells
    + table-captions
    + flex items
    + grid cell
    + ...

+ and block boxes with 'overflow' other than 'visible' 块级盒子设置了 overflow 属性不为 visible


**BFC合并**

换个角度来看：

默认能容纳正常流的盒（也就是内部不是只能放特定display的元素的盒），我们都认为它会创建BFC，但是只有一种情况例外，就是块级盒子，它里外都是BFC并且 overflow: visible 的时候，就会产生内外的 BFC 合并

**发生BFC合并的条件： block box && overflow:visible**

  - BFC合并与float：BFC合并后，block box内部的行盒会受到外部float元素的影响
  - BFC合并与边距折叠 ：BFC合并后，内部元素和外部元素的外边距会发生折叠现象

发生BFC合并，也可以理解为:没有设立新的BFC

## Flex排版
**过程**
+ 收集盒进行
+ 计算盒在主轴方向的排布
+ 计算盒在交叉轴方向的排布

**分行**
+ 根据主轴尺寸，把元素分进行
+ 若设置了no-wrap，则强行分配进第一行（下一步计算主轴的时候，再去处理溢出部分）

**计算主轴方向**
+ 找出所有Flex元素
+ 把主轴方向的剩余尺寸按比例分配给这些元素
+ 若剩余空间为负数，所有flex元素（主轴尺寸）为0，等比压缩剩余元素

**计算交叉轴方向**
+ 根据每一行中最大元素的尺寸计算行高
+ 根据行高、flex-align 和 item-align，确定元素具体位置


# CSS 动画与绘制

## 动画

### Animation

+ @keyframes定义
+ animation:使用

```html
<style>
    @keyframes myAni{
        from {background: pink}
        to{ background: green;}
    }
    div{
        animation:myAni 6s infinite;
    }
</style>
<div style="width:100px;height:100px;"></div>
```

**animation的组成**
+ animation-name 动画名称 对应@keyframe的定义
+ animation-duration 动画的时长
+ animation-timing-function 动画的时间曲线
+ animation-delay 动画开始前的延迟
+ animation-iteration-count 动画的播放次数
+ animation-direction 动画的方向


**@keyframe的定义**
+ 使用百分比
+ 使用`from` `to`，`from`大致相当于0，`to`大致相当于100%

```css
@kyframes mykf {
    0% {top:0; transition:top ease;}
    50% {top:30px; transition:top ease-in;}
    75% {top:10px; transition:top ease-out;}
    100% {top:0; transition:top linear;}
}
```
+ 每个关键帧里面，都可以定义很多属性；
+ 一个常见的技巧：在关键帧里面定义transition来让值发生改变，而不是使用animation的timing-function
    - 这样的话，每个两个关键帧之间的timing-function都可以不一样
    - 而animation的timing-function一但指定了，整个动画的timing-function就确定了，无法分段指定


### Transition

**transition的组成**  
+ transition-property 要变换的属性
+ transition-duration 变换的时长
+ transition-timing-function 时间曲线
+ transitio-delay 延迟

**三次贝塞尔曲线**
网站：https://cubic-bezier.com/#.17,.67,.83,.67

内置的三次贝塞尔曲线：

+ ease 缓动曲线，最自然的曲线状态
+ linear 直线，退化为一次曲线
+ ease-in 缓动启动，往往用于让元素消失的动画
+ ease-out 缓动停止，一般使用于让元素出现的动画
+ ease-in-out ease-in和ease-out结合的对称形态，意义不大，推荐使用ease


**了解贝塞尔曲线**
+ 一次贝塞尔曲线
  - 从点p0到点p1，沿着一条直线运动，有一个时间从0到1的过程，我们把它叫做一次贝塞尔曲线
+ 二次贝塞尔曲线
  - 在点p0和点p2之间加一个控制点p1
  - 对p0和p1，p1和p2之间分别做贝塞尔曲线，这个时候，两个曲线上每一时刻都会产生一个运动点
  - 运动点变化的每个时刻，连接两个曲线上的运动点，并使用一次贝塞尔曲线对每条运动点的连线按运动时间比例进行插值，找到对应点，这些点的连线就是二次贝塞尔曲线

+ 三次贝塞尔曲线
  - 在二次贝塞尔曲线的基础上，再加一个控制点
  - 有四个点：p0 p1 p2 p3
  - p0向p1做一次贝塞尔曲线运动，p1向p2做一次贝塞尔曲线运动，p2向p3一次贝塞尔曲线运动，
  - 每个点变动的时刻连接p0~p1上的运动点和p1~p2上的运动点，再连接p1~p2上的运动点p2~p3上的运动点，并分别在两条连接线上使用一次贝塞尔曲线根据运动时间进行插值求点，再连接两个插值点，最后在这两个插值点之间再使用一次贝塞尔曲线根据时间插值求点，每个时刻所有的最后的插值点连起来就是三次贝塞尔曲线了

**贝塞尔曲线的拟合**
+ 一定能拟合：直线、抛物线
+ 圆不可直接拟合，但是可以通过分段拟合圆弧的方式实现，分段分的越细，最后拟合的效果就越好

## 颜色

**基础知识**
+ 光的颜色其实就是光的波长，人有一个可见的波长范围（正常是 400~760nm（紫色~红色））
+ 人看到的光大部分都是混合光

**CMYK和RGB**
+ 光只是波长，那为什么三原色可以调出所有的颜色？
  - 人的眼睛里面有视锥细胞，只有三种，分别能感应红绿蓝三原色的光，不管自然界的光有多复杂，最后给眼睛的刺激只有这三种
  - 所以只要将红绿蓝三种颜色配成不同的比例，最后就能看成相应的颜色
  - 小时候说的三原色（红黄蓝）：青、品红、黄，正好是红绿蓝的补色，颜料是吸收对应的光的，所以在印刷行业都会使用CMYK颜色(CMY是青、品红、黄的缩写)，K表示黑色，因为黑色油墨便宜
- RGB 和 CMYK颜色和人对颜色的认知的直觉是不一致的，只是和人的生理结构是一致的

**HSL与HSV**
RGB 和 CMYK颜色和人对颜色的认知的直觉是不一致的，用起来并不方便，所以有了一个新的颜色谱系：HSL与HSV

+ H：Hue，表示色相，把六种基本颜色拼成一个色盘，通过Hue可以指定一个在色盘中的角度，从而指定颜色的色相
+ S：Saturation，表示纯度，颜色中杂色的数量，S越高，颜色就越鲜艳
+ L：Lightness，表示亮度
+ V：Value，可以翻译成色值，但实际表示的应该是明度（Brightness）

HSL和HSV在很多时候几乎是完全等价的，唯一不一样的是：
+ Value为100%的时候，颜色就会变成最亮的鲜艳的纯色，比如纯蓝色、纯红色等
+ Lightness是上下对称的，为0时，是纯黑色；为100%时，是纯白色。所以想要得到比如纯蓝色，我们是需要取中间值的

W3C体系中使用的是HSL，主要是由于其对称性，但是HSL和HSV是可以互转的，所以使用时也可以自己选择

使用HSL的案例，详见color.html

+ 从案例中我们可以看到，我们可以通过仅修改色相h，而不改变颜色的鲜艳程度和明暗状态，实现颜色的切换从而不影响设计，这就是HSL作为语义化的颜色存在的意义，比如我们想修改整个页面的颜色风格，我们只需要统一更换色相即可，这样在配合CSS变量和JS操作的时候，有非常好的操作空间


## 绘制
浏览器包含以下三类的绘制
+ 几何图形
  - border
  - box-shadow
  - border-radius
+ 文字
  - font 既会影响layout排版环节，也会影响绘制环节，在文字的字体文件中规定了每个文字的字形叫做glyph，和矢量图差不多，最后会被以类似矢量图的方式画到图片上
  - text-decoration
+ 位图
  - background-image

浏览器的绘制会依赖到图形库
+ 手机上依赖的图形库是skia
+ Windows上依赖的图形库是GDI
+ 在更底下是使用Shader去绘制的

比如用Shader去绘制一个Vue的logo:
+ 一个FrageMent Shader大概是由一个main函数的一个输入和一个输出来定义的
+ 输入并不想js一样写在参数列表中，输入的就是gl_FragCoord变量（包含x,y坐标）
+ 输出是一个gl_FragColor，
+ 一个main的执行过程，就是根据点坐标计算这个点的颜色gl_FragColor的过程
+ 因为我们可以用GPU加速，所以main函数会在瞬间被执行数万遍，最后把颜色计算出来

**应用技巧**
+ data uri + svg
    使用把svg变成data uri，在所有需要使用图片的地方，我们都可以使用inline的svg来描绘图片
+ svg是专业的矢量图格式，任何图形基本都能绘制（支持path）

椭圆案例;
```js
data:image/svg+xml,<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150" rx="200" ry="80" style="fill:rgb(200,100,50);stroke:rgb(0,0,100);stroke-width:2"/></svg>
```
