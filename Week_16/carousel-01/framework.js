export function createElement(type, attribute, ...children) {
  let element;
  if (typeof type === "string") {
    // element = document.createElement(type);
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }
  
  for (let name in attribute) {
    element.setAttribute(name, attribute[name]);
  }
  if (children.length > 0) {
    for (let child of children) {
      if (typeof child === "string") {
        //child = document.createTextNode(child);
        child = new TextWrapper(child);
      }
      element.appendChild(child);
    }
  }
  return element;
}

export class Component {
  constructor() {
    // this.root = this.render();
  }
  
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    this.root = document.createElement(type);
  }
  
}

class TextWrapper extends Component{
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  
}