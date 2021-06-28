学习笔记
# 测试工具

测试工具是供应链里面重要的一环，使用单元测试的一般场景：
+ 公司的商业项目
+ 高度复用的组件和库

测试框架写一个成本也不是特别高。

当前流行的测试工具及配套设施：
+ Mocha: https://mochajs.org/   https://mochajs.cn/
+ Jest


## Mocha

mocha是一个功能丰富的javascript测试框架，运行在node.js和浏览器中，使异步测试变得简单有趣。Mocha测试连续运行，允许灵活和准确的报告，同时将未捕获的异常映射到正确的测试用例。

**安装**

- 新建test-demo空文件夹
- 执行npm init
- 然后执行 `npm install --global mocha` or `npm install --save-dev mocha`

**配置**

+ 写一个简单的加法函数，然后配置test/test.js去做测试。
```js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

```js
// test.js
var assert = require('assert');

var add = require('../add.js');

describe("add function testing", function(){
  it('1+2 should be 3', function() {
    assert.equal(add(1,2), 3);
  });
  
  it('-1+2 should be -3', function() {
    assert.equal(add(-5,2), -3);
  });
});

```

+ 然后执行`macha`命令测试通过。

**解决以node模式exports的问题**

一个简单的思路就是使用webpack，然后以build后dist目录里的内容进行单元测试。但是测试依赖build并不太好。同时，如果后面做code coverage相关的工作，依赖dist里面的内容的话，又增加了一些麻烦。


babel解决方案：使用babel register。只需要require一下就可以使用了。

+ 首先安装@babel/core和@babel/register两个模块。
```
npm install --save-dev @babel/core @babel/register
```

+ babel的config文件
安装 `npm install @babel/preset-env --save-dev`
```
{
  "presets": ["@babel/preset-env"]
}
```

+ 将module.exports/require方式改为export/import

+ 然后执行`mocha --require @babel/register` 或 `、./node_modules/.bin/mocha --require @babel/register` 成功

+ 将命令放入package.json scripts里面
```
  "scripts": {
    "test": "mocha --require @babel/register"
  },
```

## code coverage

code coverage 是单元测试的一个重要的指标。 表示我们的测试到底覆盖了多少原文件里的代码。mocha里天然是没有这个工具的，需要其他工具配合使用。

+ test case写的好不好
+ 有没有测全

### code coverage相关的工具——nyc

istanbuljs，它的命令行工具就叫nyc。地址：https://www.npmjs.com/package/nyc

它可以帮我们在一个复杂的文件里面，计算最终测试覆盖的比例。



+ 安装 `npm i -D nyc or yarn add -D nyc`

+ 增加 scripts:
```
  "scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc npm run test"
  },
```

+ 执行：`npm run coverage`

|File    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|--------|---------|----------|---------|---------|-------------------
|Files |     100 |      100 |     100 |     100 |  |
|add.js |     100 |      100 |     100 |     100 |  |

+ 为了更好的支持babel提高准确度，增加.nycrc配置



