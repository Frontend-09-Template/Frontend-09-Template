function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  var elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex')
    return;
  
  var items = element.children.filter(e => e.type === 'element');

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  var style = elementStyle;


}

function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (let prop in element.computedStyle) {

  }
}