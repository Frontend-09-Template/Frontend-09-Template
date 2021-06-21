学习笔记

构建JS生产环境工具链，覆盖前端开发的各个环节。

# 初始化与构建
## 1. 初始化工具Yeoman

工具链的开端是**脚手架（generator）**，**Yeoman**是社区比较流行的脚手架生成器。通过Yeoman可以轻易的生产一个通用的脚手架去初始化项目以及创建模版。

### 1.1 Yeoman的基本使用

+ 新建空文件夹 toolchain
+ 执行 `npm init`
+ 安装yeoman `npm install yeoman-generator`, 打开`open .`放到编辑器里，检查package.json以及node_modules确认依赖的安装情况。
+ 按照yeoman的文档（https://yeoman.io/authoring/），创建目录结构。
```mark-down
  - generators
    - app
      - index.js
    - router 主要是为了创建比较复杂的generator
```
+ 编写 app/index.js
  yeoman主要通过method创建一个简单的命令行交互的形式，顺次的执行
  ```js
  var Generator = require('yeoman-generator');

  module.exports = class extends Generator {
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);
    }

    method1() {
      this.log('method 1 just ran');
    }

    method2() {
      this.log('method 2 just ran');
    }
  };
  ```
+ 在项目根目录 执行 `npm link` 把我们本地的模块link 到一个我们的npm 的标准的模块里面去。
```
C:\Program Files\nodejs\node_modules\generator-toolchain -> E:\cicicode\Frontend-09-Template\Week_17\toolchain
```
+ 全局安装`npm install -g yo`,然后执行yeoman `yo toolchain`，可以正确的执行。







