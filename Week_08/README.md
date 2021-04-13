# 不使用状态机处理字符串

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

# 使用状态机处理字符串
在一个字符串中找到'abcdef'
```js
function match(){
}
```

