var assert = require('assert');

import { parseHTML } from '../src/parser.js';

describe("parseHTML function testing", function(){
  it('<a></a>', function() {
    let tree = parseHTML('<a></a>');
    assert.equal(tree.children[0].tagName, 'a');
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="//time.geekbang.org" >abc</a>', function() {
    let tree = parseHTML('<a href="//time.geekbang.org">abc</a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].attributes.length, 1);
    assert.equal(tree.children[0].children.length, 1);
  });

  it('<a href ></a>', function() {
    let tree = parseHTML('<a href ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href id ></a>', function() {
    let tree = parseHTML('<a href id ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="abc" id ></a>', function() {
    let tree = parseHTML('<a href="abc" id ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a id=abc ></a>', function() {
    let tree = parseHTML('<a id=abc ></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a id=abc />', function() {
    let tree = parseHTML('<a id=abc />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href=\"abc\" id></a>', function() {
    let tree = parseHTML('<a href=\"abc\" id></a>')
    assert.strictEqual(tree.children[0].tagName,'a');
    assert.strictEqual(tree.children[0].children.length,0);
  });

  it('<a id=\'abc\'/>', function() {
    let tree = parseHTML('<a id=\'abc\'/>');
    assert.equal(tree.children.length, 0);
  });

  it('<a/>', function() {
    let tree = parseHTML('<a/>');
    assert.equal(tree.children.length, 1);
  });

  it('<A /> upper case', function() {
    let tree = parseHTML('<A /> upper case');
    assert.equal(tree.children.length, 2);
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<>', function() {
    let tree = parseHTML('<>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, "text");
  });
  const styleStr = 
    `<head>
      <style>
        #myid {width: 100px;background-color: #ff5000;} 
        .title {color: white;}
        span {
          width: 100px;
          height: 30px;
        }
      </style>
    </head>
    <body>
      <div id="myid" class="title"></div>
      <span></span>
    </body>` 
    it(styleStr, function() {
      let tree = parseHTML(styleStr);
      assert.equal(tree.children.length, 3);
    });

    it('<br/><span id="id" /><a id=111/><div id=\'5\'/>', function() {
      let tree =parseHTML('<br/><span id="id" /><a id=111/><div id=\'5\'/>')
      assert.equal(tree.children.length, 3);
    });

    it('<a11 name= "111"  age="19">', function() {
      let tree = parseHTML('<a11 name= "111"  age="19">');
      assert.equal(tree.children.length, 1);
    });

    it('<br/', function() {
      let tree = parseHTML('<br/');
      assert.equal(tree.children.length, 0);
    });

    it('<a href id=1 color="white" enable>', function() {
      let tree = parseHTML('<a href id=1 color="white" enable>');
      assert.equal(tree.children[0].attributes.length, 4);
    });

    it('<Div></Div><br class=""/><span id=\'id\' data=\'data\' class=1></span>', function() {
      let tree = parseHTML('<Div></Div><br class=""/><span id=\'id\' data=\'data\' class=1></span>');
      assert.equal(tree.children.length, 2);
      assert.equal(tree.children[0].children.length, 0);
    });
});