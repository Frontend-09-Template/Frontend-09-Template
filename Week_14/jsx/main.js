function createElement(type, attribute, ...children) {
  let element;
  if (typeof type === "string") {
    element = document.createElement(type);
  } else {
    element = new type;
  }
  
  for (let name in attribute) {
    element.setAttribute(name, attribute[name]);
  }
  if (children.length > 0) {
    for (let child of children) {
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    }
  }
  return element;
}


class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.root.appendChild(child);
  }
  
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}


class Div {
  constructor() {
    this.root = document.createElement("div");
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.root.appendChild(child);
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }
}












const arr = [1, 2, 3];
for (let i of arr) {
  console.log(i);
}
let a = <Div id="a">
  <span>e</span>
  <span>f</span>
  <span>g</span>
</Div>;


// var a = createElement("div", {
//   id: "a",
// }, 
// createElement("span", null, "a"),    // 子元素递归的调用createElement，其实形成了一个树形的结构，后面的子元素作为参数传递进来
// createElement("span", null, "b"),
// createElement("span", null, "c"));

// document.body.appendChild(a);

a.mountTo(document.body);