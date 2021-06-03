function createElement(type, attribute, ...children) {
  let element = document.createElement(type);
  for (let name in attribute) {
    element.setAttribute(name, attribute[name]);
  }
  if (children.length > 0) {
    for (let child of children) {
      element.appendChild(child);
    }
  }
  return element;
}

const arr = [1, 2, 3];
for (let i of arr) {
  console.log(i);
}
let a = <div id="a">
  <span></span>
  <span></span>
  <span></span>
</div>;


// var a = createElement("div", {
//   id: "a",
// }, 
// createElement("span", null, "a"),    // 子元素递归的调用createElement，其实形成了一个树形的结构，后面的子元素作为参数传递进来
// createElement("span", null, "b"),
// createElement("span", null, "c"));

document.body.appendChild(a);