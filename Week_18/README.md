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



coverage相关的工具