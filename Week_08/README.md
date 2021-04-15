# 状态机
## 不使用状态机处理字符串

home work: 在一个字符串中，找到字符'a'
```js
var str = 'bac';
var target = 'a';

// 1：
str.indexOf(target) > -1

// 2：
str.includes(target);

// 3：
str.split('').find(item => item === 'a')

// 4:
str.split('').findIndex(item => item === 'a') > -1

// 5:
function match(str) {
  for (let c of str) {
    if (c === 'a') {
      return true;
    }
  }
  return false;
}
```

home work: 在一个字符串中，找到字符'ab'
```js
// 1:
function findAB(str) {
  return str.includes('ab');
}

// 2:
/(ab)/i.test(str);

// 3:
function match(str) {
  let findA = false;
  for (let c of str) {
    if (c === 'a') {
      findA = true;
    } else if (findA && c === 'b') {
      return true;
    } else {
      findA = false;
    }
  }
  return false;
}

```

home work: 在一个字符串中找到'abcdef'
```js
function match(str) {
  let match = 'abcdef';
  let find = [];
  for (let o of str) {
    if (find.length < match.length) {
      find.push(o);
    } 
    if (find.length === match.length) {
      if (find.join('') == match) {
        return true;
      } else {
        find.shift();
      }
    } 
  }
  return false;
}
```

## 使用状态机处理字符串
在一个字符串中找到'abcdef'
```js
function match(){
}
```

home work: 如何使用状态机处理诸如 “abcabx” 这样的字符串
```js
function match(str){
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return findA;
  } else {
    return start;
  }
}

function end(c) {
  return end;
}

function findA(c) {
  if (c === 'b') {
    return findB;
  } else {
    return start(c);
  }
}

function findB(c) {
  if (c === 'c') {
    return findC;
  } else {
    return start(c);
  }
}

function findC(c) {
  if (c === 'a') {
    return findA2;
  } else {
    return start(c);
  }
}

function findA2(c) {
  if (c === 'b') {
    return findB2;
  } else {
    return start(c);
  }
}

function findB2(c) {
  if (c === 'x') {
    return end;
  } else {
    return findB(c);
  }
}

console.log(match('abcabcabx'));
```

home work 使用状态机完成 'abababx' 的处理

```js

```

home work 如何用状态机处理完全未知的 pattern ? 参考 字符串 KMP 算法

# HTTP请求

## 1. HTTP的协议解析
### ISO-OSI七层网络模型
1. 应用层
2. 表示层
3. 会话层
4. 传输层
5. 网络层
6. 数据链路层
7. 物理层

其中前3层对应HTTP协议，传输层对应TCP/UDP协议，网络层 Internet, 最后两层是 4G/5G/Wi-Fi，点对点的传输。

### TCP与IP的一些基础知识
TCP层，传输数据的概念是流，是一种没有明显分割单位的东西，只保证前后顺序的正确。
- 流
- 端口 计算机网卡是根据端口把接到的数据包分给各个应用的
- require('net') 对应到node,依赖的库就是require('net')包

- 包
- IP地址 IP是根据地址找包应该从哪里到哪里
- libnet/libpcap  大型的路由节点，调用到C++的两个库，前者负责构造IP包并发送，后者负责从网卡抓取所有的流经你的网卡的IP包

HTTP
- request
- response

TCP全双工通道，你可以给我发，我也可以给你发，不存在优先关系。HTTP必须得先由客户端发起一个request，然后服务端返回来一个response。


