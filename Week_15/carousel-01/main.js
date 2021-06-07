import { Component, createElement } from './framework.js';
import { Carousel } from './carousel.js';
import { Timeline, Animation } from './animation.js';

let d = [
  'https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/9c8e4afbe8174349ad8bf3a0d4cac457.jpg!sswm',
  'https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/28a123ce2b1f472192e6f5b020d528f1.jpg!sswm',
  'https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/e52b83a736524e6191ddcb84835c688c.jpg!sswm',
  'https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/fde5b608f8fa4611947c6b224080aeeb.jpg!sswm'
];


let a = <Carousel src={d} />;

a.mountTo(document.body);

let tl = new Timeline();
let am = new Animation({}, "a", 0, 100, 1000, null);
tl.add(am);
tl.start();