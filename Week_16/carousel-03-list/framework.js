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

  let processChildren = (children) => {
    for (let child of children) {
      if (typeof child === "object" && (child instanceof Array)) {
        processChildren(child);
        continue;
      }
      if (typeof child === "string") {
        //child = document.createTextNode(child);
        child = new TextWrapper(child);
      }
      element.appendChild(child);
    }
  };

  processChildren(children);
  return element;
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component {
  constructor() {
    // this.root = this.render();
    this[ATTRIBUTE] = Object.create(null); // 初始化存储属性的对象
    this[STATE] = Object.create(null);
  }
  
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render();
    }
    parent.appendChild(this.root)
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s=> s.toUpperCase())](new CustomEvent(type, { detail: args }));
  }

  render() {
    return this.root;
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    super();
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    // this[ATTRIBUTE][name] = value;
    this.root.setAttribute(name, value);
  }
  
}

class TextWrapper extends Component{
  constructor(content) {
    super();
    this.root = document.createTextNode(content);
  }
  
}