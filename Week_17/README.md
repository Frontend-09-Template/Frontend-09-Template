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


### 1.2 设计generator的流程

+ 支持同步的method和async method
+ this.log 支持输出
+ this.prompt 支持用户输入，进行信息收集： https://yeoman.io/authoring/user-interactions.html
```js
module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  // 通过命令行与用户交互实现
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }
};
```
+ 文件模板系统：https://yeoman.io/authoring/file-system.html 要初始化一个项目，通常需要和文件系统做交互
  - 创建generators/app/templates目录，增加模板页t.html
  - 使用 `copyTpl`方法，复制模板文件
  ```js
  var Generator = require('yeoman-generator');

  module.exports = class extends Generator {
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);
    }

    initPackage() {
      const pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      };

      // Extend or create package.json file in destination path
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      this.npmInstall();
    }

    async step1() {
      this.fs.copyTpl(
        this.templatePath('t.html'),
        this.destinationPath('public/index.html'),
        { title: 'Templating with Yeoman' }
      );
    }
  };
  ```
  - 新建一个空文件 demo, 然后执行`yo toolchain`，生成 public/index.html文件
+ yeoman依赖：https://yeoman.io/authoring/dependencies.html 对npm系统进行了一个包装，让它更易用
  ```js
  var Generator = require('yeoman-generator');

  module.exports = class extends Generator {
    constructor(args, opts) {
      // Calling the super constructor is important so our generator is correctly set up
      super(args, opts);
    }

    initPackage() {
      const pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      };

      // Extend or create package.json file in destination path
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      this.npmInstall();
    }

    async step1() {
      this.fs.copyTpl(
        this.templatePath('t.html'),
        this.destinationPath('public/index.html'),
        { title: 'Templating with Yeoman' }
      );
    }
  };
  ```

  详见 toolchain和demo

### 1.3 生成vue-generator

不使用vue-cli，而使用webapck和vue的loader等。完整的实现一个generator，可以初始化项目。

主要步骤：
+ 初始化包，package.json，并安装依赖: vue,vue-loader,webpack。使用`npm link`和切换到新建vue-demo项目，使用`yo vue`命令验证实现情况。
+ 配置模板，vue 单文件组件：https://cn.vuejs.org/v2/guide/single-file-components.html
+ 配置webpack.config.js， copy-webpack-plugin: https://webpack.js.org/plugins/copy-webpack-plugin/#root

详见 generator-vue和vue-demo

## 2. build工具

对于一个工具链来说，初始化之后毫无一问就是要build它了。build同时为开发和发布服务的基础设施，可以说是必须要掌握的一种能力。

**webpack**

最初是为node设计的，可以把node的代码打包成一个浏览器可用的代码。最初的设计上就是完全针对JS的系统。基于JS打包。所以它的核心思路是打包出来JS，然后在html中引用这个JS。后面也出现后起之秀，基于html打包，配置上要求就没有那么高。

webapck能做什么？多文件合并，在合并过程中，通过各种loader和plugin，去控制合并的规则和对文本进行转换。


webpack的config: webpack.config.js
+ 是一个JS 的形式，通过config去改变webpack命令的一些行为。
+ 使用webpack一般需要安装两个包：`webpack`和`webpack-cli`提供webpack的命令。
  - 全局安装webpack-cli: `npm install -g webpack webpack-cli` 可以全局使用webpack命令。
  - 项目里安装： `npx webpack`, `npm install webpack-cli --save-dev`


webpack的常用概念：
+ entry
+ output
+ loader
  - webpack的灵魂，如`bable-loader`,`css-loader`,`view-loader`
  - 一个loader的作用就是把source变成一个目标的代码，可以认为是纯粹的文本转换器。webpack会根据我们所有转换出来的，import出来的语句，或者require函数，把对应的文件给加载出来。
  - 通过test规则来决定什么样的后缀名的文件，使用什么样的loader。也可以使用多个loader,去处理同一个文件。
+ plugin


**babel基本知识**

babel是完全独立于webpack的一个独立的系统。它的作用是把一个新版本的JS编译成一个老版本的JS的版本。


安装babel:
+ 全局安装：`npm install -g @babel/core @babel/cli`
+ 本地安装：`npm install -save-dev @babel/core @babel/cli`

babel全局命令：babel，需要一个输入和输出 `babel .src/sample.js > 1.txt`

配置: .babelrc JSON的形式
```
{
  "presets": ["@bable/preset-env", "@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-react-jsx"],
}
```










