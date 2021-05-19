function layout(element) {
  /* 第一步 预处理 */
  if (!element.computedStyle) {
    return;
  }
  // 获取预处理后的style对象
  var elementStyle = getStyle(element);

  // 在toy-browser中我们仅处理flex布局
  if (elementStyle.display !== 'flex') {
    return;
  }

  // 过滤出元素标签
  var items = element.children.filter(e => e.type === 'element');

  // 支持order属性排序
  items.sort(function(a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  // width和height设置为auto或者空字符，将其默认修改为null
  ['width', 'height'].forEach(size => {
    if (elementStyle[size] === 'auto' || elementStyle[size] === '') {
      elementStyle[size] = null;
    }
  })

  // flex-direction 默认设置为row
  if (!elementStyle.flexDirection || elementStyle.flexDirection === 'auto') {
    elementStyle.flexDirection = 'row';
  }

  // align-items默认设置为stretch
  if (!elementStyle.alignItems || elementStyle.alignItems === 'auto') {
    elementStyle.alignItems = 'stretch';
  }

  // justify-content默认设置为flex-start
  if(!elementStyle.justifyContent || elementStyle.justifyContent === 'auto'){
    elementStyle.justifyContent = 'flex-start';
  }

  // flex-wrap默认设置为nowrap
  if(!elementStyle.flexWrap || elementStyle.flexWrap === 'auto'){
    elementStyle.flexWrap = 'nowrap';
  }

  // align-content默认设置为stretch
  if(!elementStyle.alignContent || elementStyle.alignContent === 'auto'){
    elementStyle.alignContent = 'stretch';
  }

  var mainSize, mainStart, mainEnd, mainSign, mainBase, // 主轴的参数
      crossSize, crossStart, crossEnd, crossSign, crossBase; // 交叉轴的参数

  if (elementStyle.flexDirection === 'row') {  // 横向排列
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if(elementStyle.flexDirection === 'row-reverse'){ // 横向反向排列
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = elementStyle.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if(elementStyle.flexDirection === 'column'){ // 纵向排列
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize  = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if(elementStyle.flexDirection === 'column-reverse'){// 纵向反向排列
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = elementStyle.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if(elementStyle.flexWrap === 'wrap-reverse'){// 换行并在交叉轴方向倒置
    // 交换 crossStart 和 crossEnd;
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  /*第二步 收集元素进行 */
  var isAutoMainSize = false; // 主轴由子元素撑开的模式
  // 如果父元素的主轴方向没有设置尺寸（width、height）

  if (!elementStyle[mainSize]) {
    elementStyle[mainSize] = 0; // 父元素主轴尺寸初始化为 0 
    for (var i = 0; i < items.length; i++) {
      var itemStyle = getStyle(items[i]);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        // 如果子元素的主轴方向设置了尺寸，父元素的主轴尺寸为子元素尺寸累加之和
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  var flexLine = []; // 存放第一行元素
  var flexLines = [flexLine];

  var mainSpace = elementStyle[mainSize]; // 主轴的空间（初始值为父元素的主轴尺寸
  var crossSpace = 0; // 主轴的空间（初始值为父元素的主轴尺寸）
  for(var i = 0; i < items.length; i++) {
    var item = items[i];
    itemStyle = getStyle(item);

    if(itemStyle[mainSize] === void 0) {
      // 如果这个子元素主轴方向没有设置尺寸，默认设置0
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      // 如果子元素有flex属性，表示该元素可伸缩，则这个元素一定可以放进第一行，不管剩余多少空间
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap') {
      // 如果设置了不换行，所有子元素放入第一行
      mainSpace -= itemStyle[mainSize];  // 主轴剩余的空间减去当前放入第一行的元素主轴尺寸
      if (itemStyle[crossSize] !== void 0) {
        // 如果这个子元素交叉轴有设置尺寸
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 交叉轴的空间取子元素交叉轴方向的尺寸最大的
      }
      flexLine.push(item); // 当前元素放入第一行
    } else {
      // 这里是换行的逻辑
      if(itemStyle[mainSize] > style[mainSize]){ // 如果子元素的主轴尺寸大于父元素，
        itemStyle[mainSize] = style[mainSize];  // 将其主轴尺寸设置为和父元素一样大
      }

      if (mainSpace < itemStyle[mainSize]) {
        // 如果主轴剩余空间尺寸小于当前子元素尺寸，说明这一行放不下这个子元素了
        flexLine.mainSpace = mainSpace;//记录这一行的主轴剩余空间
        flexLine.crossSpace = crossSpace;//记录这一行的交叉轴空间
        flexLine = [item];//再创建新的一行
        flexLines.push(flexLine);//放入新的一行
        mainSpace = elementStyle[mainSize];//重置存储主轴剩余空间的变量值
        crossSpace = 0;//重置存储交叉轴剩余空间的变量值
      } else {
        // 能放下该元素
        flexLine.push(item); // 向当前行放入子元素
      }

      if (itemStyle[crossSize] !== (void 0)) {
        // 如果子元素有设置交叉轴尺寸
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 交叉轴的空间取当前行子元素中最大的（两两比较取最大）
      }
      mainSpace -= itemStyle[mainSize]; // 更新主轴剩余空间
    }
  }

  /*第三步 计算主轴 */
  flexLine.mainSpace = mainSpace; // 保存最后一行的主轴剩余空间（单行和多行都会经过这一步）
  if (elementStyle.flexWrap === 'nowrap') {
    // 如果设置了不换行
    // 第一行（总共只有一行）的交叉轴尺寸，优先取用户设置的容器的交叉轴尺寸，没有再取当前行最大子元素的交叉轴尺寸
    flexLine.crossSpace = elementStyle[crossSize] !== undefined ? elementStyle[crossSize] : crossSpace
  } else {
    // 换行的情况
    flexLine.crossSpace = crossSpace; // 保存最后一行的交叉轴尺寸（这时的flexLine对应多行中最后一行的容器）
  }

  if (mainSpace < 0) {
    // 如果计算出的主轴剩余空间是负的(只有一行的情况下会出现)
    // 压缩每一项
    var scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace);//计算压缩比例(主轴尺寸  / 主轴方向期望的尺寸)

    var currentMain = mainBase; // 记录循环过程中，每个元素在主轴方向排列的结束位置，作为下一个元素的起始位置

    for(var i = 0; i < items.length; i++){// 遍历每一项

      var item = items[i];
      var itemStyle = getStyle(item); // 获取当前子元素样式

      if(itemStyle.flex) { // 如果设置了flex属性，这个子元素不参加等比压缩
        itemStyle[mainSize] = 0; // 将其主轴尺寸设置为0
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;// 如果子元素设置了主轴尺寸，将其尺寸乘上压缩比例

      itemStyle[mainStart] = currentMain; // 获取当前子元素的起始位置
    
      // 加上或者减去对应当前是正向还是反向排列
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];  // 当前子元素的结束位置：开始位置  +/- 当前元素的尺寸

      currentMain = itemStyle[mainEnd];  // currenMain记录当前元素的结束位置，作为下一个元素的起始位置
    }
  } else {
    // 单行有剩余主轴空间或者多行的情况
    // 遍历每一行
    flexLines.forEach(function(items){
      var mainSpace = items.mainSpace; // 当前行的剩余空间
      var flexTotal = 0; // 统计当前行所有元素flex属性值之和
      for(var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);
        if (itemStyle && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        // 有设置了flex的元素，当前行一定会占满，用不到justify-content属性了
        var currentMain = mainBase; // 元素的起始位置
        for(var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);

          if (itemStyle.flex) {
            // 按照flex在flexTotal中的占比，将剩余空间分配给flex元素的主轴尺寸
            itemStyle[mainSize] = mainSpace * itemStyle.flex / flexTotal;
          }
          itemStyle[mainSize] = currentMain; // 保存当前元素的起始位置
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]; // 保存当前元素的结束位置
          currentMain = itemStyle[mainEnd]; // 更新下一个元素的起始位置
        }
      } else {
        // 否则没有flex元素，根据justify-conotent属性来分配剩余空间
        /* 以row为例 */
        // currentMain ：排列的起始位置 step ：两个子元素之间的间隔
        if(elementStyle.justifyContent === 'flex-start'){ // 从左往右排
          var currentMain = mainBase; //起始位置0
          var step = 0;
        }

        if (elementStyle.justifyContent === 'flex-end') {
          // 从右往左排（mainSign为-1，mainBase为容器宽度）
          var currentMain = mainSpace * mainSign + mainBase; // 容器width - 剩余空间
          var step = 0;
        }

        if(elementStyle.justifyContent === 'center'){
          // 居中对齐（mainSign为1，mainBase为0）
          var currentMain = mainSpace / 2 * mainSign + mainBase; // 起始位置(0) + 剩余空间的1/2
          var step = 0;
        }

        if(elementStyle.justifyContent === 'space-between'){
          // 两端对齐
          var step = mainSpace / (items.length - 1) * mainSign;
          // 总共有元素数量减1个间隔，平分即可
          var currentMain = mainBase; // 起始位置0
        }

        if(elementStyle.justifyContent === 'space-around'){
          // 两端对齐，前后各留间隔的一半
          var step = mainSpace / items.length * mainSign; // 计算间隔时，要把前后的间隔一起算上，总共有元素数量个间隔，平分
          var currentMain = mainSign * step / 2 + mainBase; // 起始的位置要想结束方向偏移1/2间隔（最后剩余的也正好是1/2间隔）
        }

        for(var i = 0;i <items.length; i++){
          var item = items[i];
          itemStyle[mainStart] = currentMain;//修改当前元素的起始位置
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];//修改当前元素的结束位置（起始坐标 加上/减去 主轴尺寸）
          currentMain = itemStyle[mainEnd] + mainSign * step; //计算下一个元素的起始位置，要考虑到间隔和方向
        }
      }
    })
  }
  
  /*第四步 交叉轴的计算 */
  var crossSpace;
  if(!elementStyle[crossSize]){ 
    // 如果没有设置交叉轴尺寸
    crossSpace = 0;
    elementStyle[crossSize] = 0; // 初始为0
    for(var i = 0; i < flexLines.length; i++){
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace; // 累加上每一行的最大的元素的尺寸，最后得到总的交叉轴尺寸
    }
  }else{
    // 设置了交叉轴尺寸
    crossSpace = elementStyle[crossSize]; // 交叉轴的剩余空间（初始为设置的交叉轴尺寸）

    for(var i = 0; i < flexLines.length;i++){
        crossSpace -= flexLines[i].crossSpace; / /交叉轴的剩余空间减去每一行占用的空间
    }
  }

  if(elementStyle.flexWrap === 'wrap-reverse'){
    // 换行反转的时候,交叉轴的起始位置为交叉轴末尾
    crossBase = elementStyle[crossSize];
  } else {
    crossBase = 0;
  }

  var step;
  // 行与行之间的间隔
  // 以row为例
  if(elementStyle.alignContent === 'flex-start'){ // 上对齐
    crossBase += 0;
    step = 0;
  }
  if(elementStyle.alignContent === 'flex-end'){ // 下对齐
    crossBase += crossSign * crossSpace; // 起始位置设置为：初始位置 加上/减去 剩余空间
    step = 0;
  }
  if(elementStyle.alignContent === 'center'){// 垂直居中
    crossBase += crossSign * crossSpace / 2; // 起始位置设置为：初始位置 加上/减去 剩余空间的一半
    step = 0;
  }
  if(elementStyle.alignContent === 'space-between'){//上下两端对齐
    crossSpace += 0;
    step = crossSpace / (flexLines.length - 1);// 行与行之间的间隔等于： 剩余空间 除以 元素个数减1
  }
  if(elementStyle.alignContent === 'space-around'){// 上下两端对齐，并且两端有1/2行间隔
    step = crossSpace / flexLines.length;// 行与行之间的间隔等于： 剩余空间 除以 元素个数
    crossBase += crossSign * step / 2;  // 起始位置要 加上/减去 行间隔的一半
  }

  if(elementStyle.alignContent === 'stretch'){// 拉伸元素的交叉轴尺寸，填充满纵向，从头开始，没有间隔
    crossBase += 0;
    step =0;
  }

  flexLines.forEach((items) => {
    var lineCrossSize = elementStyle.alignContent === 'stretch' ? // align-content设置为strech，需要拉伸每一行
    items.crossSpace + crossSpace / flexLines.length : // 每一行的交叉轴空间平分多出来的空间（在原来的基础上加上）
    items.crossSpace;

    // 遍当前行的每个子元素
    for(var i = 0; i < items.length; i++){
      var item = items[i];
      var itemStyle = getStyle(item);

      //对齐方式由子元素自身的align-self属性或者容器的align-items属性决定，align-self优先级高
      var align = itemStyle.alignSelf || elementStyle.alignItems;
      
      //以flex-direction:row为例

      if(align === 'flex-start'){//如果是上对齐
          itemStyle[crossStart] = crossBase;//记录子元素起始位置
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];//计算记录子元素的结束位置（当前行位置 +/- 当前行的占用交叉轴空间）
      }

      if(align === 'flex-end'){//下对齐
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;//子元素结束位置为：当前行位置 +/- 当前行交叉轴空间
          itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];//子元素的开始位置为：结束位置 -/+ 子元素的交叉轴尺寸
      }

      if(align === 'center'){//上下居中
          itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;//子元素的开始位置为：当前行位置 +/- 当前行剩余空间的一半
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]//子元素的结束位置为：开始位置 +/- 子元素尺寸
      }

      if(align === 'stretch'){//拉伸
          itemStyle[crossStart] = crossBase;//子元素的开始位置
          if(itemStyle[crossSize] === void 0){//stretch模式下子元素没有设置交叉轴尺寸，直接设置为当前行的高度
              itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
              itemStyle[crossSize] = lineCrossSize;
          }else{
              itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];//有设置高度就不进行拉升了
          }
      }

    }
    crossBase += crossSign * (lineCrossSize + step);//更新为crossBase为下一行的起始位置
  });

}


// 对style样式的预处理
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (let prop in element.computedStyle) {
    let propVal = element.style[prop] = element.computedStyle[prop].value;

    // 将px结尾的字符串转为number
    if(propVal.toString().match(/px$/)) {
      element.style[prop] = parseInt(propVal);
    }

    if(propVal.toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(propVal);
    }
  }

  return element.style;
}

module.exports = layout;