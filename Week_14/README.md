学习笔记
# 组件化

## 组件基本知识

### 1. 基本概念 和 基本组成部分
组件：既是对象又是模块，可以通过树形来组织，有一定的模板化的配置能力

**对象**
+ Properties  属性
+ Methods     方法
+ Inherit     继承关系



**组件**
+ Properties  属性
+ Methods     方法
+ Inherit     继承关系
+ Attribute   特性
+ Config & State  配置 & 状态：随着人的操作或方法的调用，组件的state会发生变化
+ Event       事件机制：组件往外传递的东西
+ Lifecycle   生命周期
+ Children    是树形结构的一个必要条件

对象和组件的区别：组件在对象的基础上加了许多语义相关的概念，使得组件变成一种非常适合描述UI的一个概念

**Component的概念**

操作者（非程序员用户）对界面去做一些操作，会影响组件的state，有时会影响到组件的子组件（Children）。
程序员会通过attribute去更改组件的一些特征或者是特性。attribute往往是用markup language(声明型的语言)，attribute与properties是否相同取决于组件的设计者。一些 比较激进的方案会把state、config、attribute、properties四者统一。JS里的property是有get和set方法的。Method和property是使用组件的程序员向开发组件的程序员传递消息。Event是开发组件的程序员向使用组件的程序员传递消息。
```markdown
                      Component                       
End User Input  --->    State    <---   attribute       Component User's Markup Code
                          |
                       Children  <---   Method
                                 <---   Property        Component User's JS Code
                                 --->   Event
```

**Attribute vs Property**
+ Attribute 强调描述性
+ Property 强调从属关系

```
Attribute:

<my-Component attribute="v" />
myComponent.getAttribute("a")
myComponent.setAttribute("a", "value")

Property:

myComponent.a = "value"
```

早期JS不允许关键字作为属性名，现在已经没有这个问题了，但是html还是不支持 class 这个名字
```html
<div class="cls1 cls2" style="color: blue">
  <a href="//m.taobao.com">link</a>
</div>

<div>
  <input value="cute" />
</div>
<script>
var div = document.getElementsByTagName("div")[0];
console.log(div.className)   // cls1 cls2
console.log(div.style)       // 对象，字符串语义化之后的对象  CSSStyleDeclaration {0: "color", alignContent: "", alignItems: "", alignSelf: "", alignmentBaseline: "", all: "", …}

var a = document.getElementsByTagName("a")[0];
console.log(a.href)      // http://m.taobao.com/
console.log(a.getAttribute("href"))      // //m.taobao.com

var input = document.getElementsByTagName("input")[0];   // 若 property 没有设置则结果是 attribute
console.log(input.value)          // cute
console.log(input.getAttribute("value"))   // cute
input.value = 'hello'   // 若value属性已设置则 attribute 不变，property 变化，元素实际上的效果是 property 优先
console.log(input.value)  // hello
console.log(input.getAttribute("value"))   // cute
</script>
```

详见 test-attribute.html

**如何设计组件状态**
```markdown
Markup set(标签)            JS set           JS change          User Input change(用户输入)


```

**生命周期LifeCycle**
+ create
+ mount 组件挂载到DOM树上
+ JS change/set 和 End userInput Change 接受JS或终端用户的输入
+ render/update  重新渲染或更新组件状态
+ unmount 组件从DOM树上解除挂载
+ destoryed

**Children**

Content型
Template型


## 从无到有搭建一个组件系统

markup建立的风格
+ react JSX
+ vue 标记语言的parser

JSX是依赖于babel的一个插件来实现的，JSX的行为类似于语法糖，把html转化为createElement的JS函数，JSX的主要作用就是将JS中的HTMl转译为JS，并其封装DOM操作(createElement)。

### 2. 为组件添加JSX语法
+ 新建一个jsx文件夹
+ 进入jsx, 执行 `npm init`
+ 安装webpack、webpack-cli `npm install -g npm webpack webpack-cli`  帮助我们把一个普通的JS文件，变成把不同的import、require打包到一起去。
+ 安装bable-loader `npm install --save-dev webpack babel-loader`     babel可以把一个新版本的 JS 编译成老版本的 JS，这样就可以在更多的老版本的浏览器里取跑了
+ 创建webpack.config.js
   ```js
   module.exports = {
    entry: './main.js'
   };
   ```

+ 创建main.js
  ```js
  const arr = [1, 2, 3];
  for (let i of arr) {
    console.log(i);
  }
  ```

+ 执行webpack，生产一个dist目录
  ```js
  // 打包压缩后的main.js
  (()=>{const o=[1,2,3];for(let l of o)console.log(l)})();
  ```

+ 安装bable `npm install --save-dev @babel/core @babel/preset-env` 
+ 配置babel-loader
  ```js
  // webpack.config.js
  module.exports = {
    entry: './main.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
  ```
+ 重新编译，mian.js被编译成了普通的for循环
  ```js
  (()=>{for(var o=0,l=[1,2,3];o<l.length;o++){var r=l[o];console.log(r)}})();
  ```
+ 设置webpack 的 mode 为 "development"，为开发调试提供便利，此时代码会被放进eval()
+ 安装 @babel/plugin-transform-react-jsx `npm install --save-dev @babel/plugin-transform-react-jsx` 这个插件默认会把 JSX 语法转为 React.createElement处理，如果我们不想用这个默认的语法，可以自己通过配置进行定义
+ 在webpack.config.js中增加配置
  ```js
  module.exports = {
    entry: "./main.js",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-react-jsx"],
            }
          }
        }
      ]
    },
    mode: "development"
  };
  ```
+ 执行webpack 会发现 `let a = <div></div>`会翻译成了`React.createElement(\"div\", null);`
+ 在默认的打包输出目录 dist 目录新建一个 main.html，script引入打包后的main.js

### 3. JSX的基本使用方法

**@bable/plugin-transform-react-jsx 在 React Classic Runtime中可配置的参数**
+ pragma      string, defaults to `React.createElement`
+ pragmaFrag  string, defaults to `React.Fragment`

可参考：https://babel.dev/docs/en/babel-plugin-transform-react-jsx#react-classic-runtime-1

在webpack.config.js中增加配置, 指定@bable/plugin-transform-react-jsx的参数prama为'createElement'，main.js的编译结果为`var a = createElement(\"div\", null);`
```js
module.exports = {
  entry: "./main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-react-jsx", {"pragma": "createElement"}]],
          }
        }
      }
    ]
  },
  mode: "development"
};
```

#### 第一步，编写一个createElement方法

可以让webpack正确编译
```js
let a = <div id="a">
  <span>e</span>
  <span>f</span>
  <span>g</span>
</div>;
```

```js
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
document.body.appendChild(a);
```

#### 第二步，让webpack正确的编译`<Div>`
详见：jsx/main.js

### 4. 轮播组件
最终代码详见： jsx-carousel-04