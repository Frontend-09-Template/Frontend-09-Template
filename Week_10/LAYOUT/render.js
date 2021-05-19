const images = require('images'); // 插件用于绘制图片

function render(viewport, element) {
  // 元素有样式才处理
  if (element.style) {
    var img = images(element.style.width, element.style.height); // 根据元素的宽高，创建一个img对象

    // toy-browser仅处理background-color
    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0, 0, 0)';
      color.match(/rgb\((\d+),(\d+),(\d+)\)/g);  // 匹配rgb中的三个数字

      img.fill(+RegExp.$1, +RegExp.$2, +RegExp.$3); // 填充颜色

      viewport.draw(img, element.style.left || 0, element.style.top)  // 绘制到视口上 (根据left 和 top)
    }
  }

  if (element.children) {
    for (var child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;