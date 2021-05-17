const { fineStructureDependencies } = require("mathjs");

/**
 * 题目：编写一个 match 函数。它接收两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。
 * 这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。
 * （不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）以下是一个调用的例子。
 * 仅考虑 type class id选择器的匹配
 * @param {*} selector 
 * @param {*} element 
 * @returns 
 */
function match(selector, element) {
  let dealedSelectors = [];
  let token = {};
  let curEl = element;
  let correctCnt = 0;
  function findStart(c) {
    if (c === '#') {
      token = {
        type: 'id',
        name: ''
      }
      if (Array.isArray(dealedSelectors[dealedSelectors.length - 1])) {
        dealedSelectors[dealedSelectors.length - 1].push(token);
      } else {
        dealedSelectors.push(token);
      };
      return findId;
    } else if(c === '.') {
      token = {
        type:'class',
        name:''
      }
      if (Array.isArray(dealedSelectors[dealedSelectors.length-1])) {
        dealedSelectors[dealedSelectors.length - 1].push(token);
      } else {
        dealedSelectors.push(token);
      }
      return findClass;
    } else if (/[a-z]/.test(c)) {
      token = {
        type:'type',
        name:''
      }
      dealedSelectors.push(token);
      return findType(c);
    } else if (/\s+/.test(c)) { // 空格
      dealedSelectors.push([]);
      return findStart;
    }
  }

  function findId(c) {
    if (/[a-z]/.test(c)) {
      token.name += c;
      return findId;
    } else{
      token = {};
      return findStart(c);
    }
  }
  function findClass(c) {
    if (/[a-z]/.test(c)) {
      token.name += c;
      return findClass;
    } else {
      token = {};
      return findStart(c);
    }
  }
  function findType(c) {
    if(/[a-z]/.test(c)) {
      token.name += c;
      return findType;
    } else {
      token = {};
      return findStart(c);
    }
  }
  var state = findStart
  for(let i= 0;i<selector.length;i++){
    state = state(selector[i]);
  }
  dealedSelectors.reverse();
  matchSelector(dealedSelectors);

  function matchSelector(dealedSelectors,len = 1) {
    for(let s of dealedSelectors){
      if(Array.isArray(s)){
        matchSelector(s,s.length);
      }else{
        if(
          (s.type === 'type' && curEl.tagName.toLowerCase() === s.name )||
          (s.type === 'class' && curEl.className === s.name) ||
          (s.type === 'id' && curEl.id === s.name)
        ){
          correctCnt ++;
        }
        len --;
        len === 0 && (curEl = curEl.parentElement);
      }
    }
  }
  return correctCnt === dealedSelectors.flat().length; // 匹配次数等于选择器的个数
}

match("div #id.class", document.getElementById("id"));