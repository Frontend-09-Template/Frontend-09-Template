# 持续集成
## 1. 发布前检查的相关知识

客户端持续集成其实是对于一个最终阶段集成的概念提出来的。前面各自开发，最终集成联调，这种模式是持续集成模式提出前，客户端开发的主要模式。

持续集成打破了上述模式，提出了两个重要概念：
1. daily build: 通过服务端代码在晚上的时间执行build，然后看看今天的daily build是否有成功。如果没成功就把所有的提交记录挨个拉出来打一打，看看是谁干的。
2. BVT-build verification test，就是构建的验证测试，其实是冒烟测试。对build成功之后的东西做一个验证。

前端持续集成的变化：
1. 前端build一次的过程很快，daily build可以变成更短的时间线，在提交的时候去build和验证。一周两周是比较正常的上线周期。快节奏。
2. BVT由前端来做，如果想做要给比较完整的测试，可以用phantomJS这种无头浏览器进行测试，把整颗DOM树生成起来，然后检查 DOM 树里面特定的某些格式，因为可以通过CSSOM拿到元素的位置，也可以看到背景图，也可以拿到元素的一些结构。所以客观上使用无头浏览器是可以配合一些规则校验，最后完成我们的一个BVT的任务的。

后面主要讲三个部分：
1. 通过git hooks来完成检查的时机
2. ESlint 一种非常轻量级的代码检查的方案
3. 基于 pantomJS 对代码最后生成的样子，做一些规则的校验和检查

## 2. git hooks的基本用法


**Client-Side Hooks**
+ 新建git-demo文件夹，创建README.md，并执行`git init`
+ 隐藏的.git目录里已经包含hooks的内容，.spample结尾表示并不会执行。
  - applypatch-msg.sample
  - commit-msg.sample
  - fsmonitor-watchman.sample
  - post-update.sample
  - pre-applypatch.sample
  - pre-commit.sample
  - pre-merge-commit.sample
  - prepare-commit-msg.sample
  - pre-push.sample
  - pre-rebase.sample
  - pre-receive.sample
  - push-to-checkout.sample
  - update.sample
  - 客户端用pre-commit 和 pre-push的钩子，服务端用pre-receive的钩子。对客户端来说，一般把lint的内容放到pre-commit，check的内容放到pre-push里。
+ 进入 .git\hooks 目录，新建一个pre-commit, chmod +x ./pre-commit 添加执行权限
  ```
  #!/usr/bin/env node
  let process = require("process");
  console.log("Hello hooks!")

  process.exitCode = 1;
  ```
  此时，git-demo执行git commit 会输出 Hello hooks!

## 3. ESLint的基本用法
轻量级的检查工具，也是业内基本上都在用的这样一个代码风格检查。官网：https://eslint.org/docs/user-guide/getting-started

**具体使用**
+ 新建eslint-demo目录，执行`npm init`
+ 安装eslint，`npm install eslint --save-dev`
+ 增加eslint配置，`npx eslint --init`
  - eslint-plugin-jsx-a11y@6.4.1
  - eslint@7.30.0
  - eslint-plugin-react@7.24.0
  - eslint-plugin-react-hooks@4.2.0
  - eslint-plugin-import@2.23.4
  - eslint-config-airbnb@18.2.1
+ 执行eslint `npx eslint ./index.js`
+ eslint有各种各样现成写好的规则，也有一些它的preset

## 4. ESLint API及其高级用法

**ESLint 和 git的规则结合**
