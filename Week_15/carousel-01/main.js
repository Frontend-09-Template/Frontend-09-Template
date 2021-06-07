import { Component, createElement } from './framework.js';
import { Carousel } from './carousel.js';
import { Timeline } from './animation.js';

let d = [
  'https://pics5.baidu.com/feed/63d0f703918fa0eccf953e747b90c5e63d6ddb0d.jpeg?token=7d2d3d9497b0b8bea9319988a84d5375',
  'https://pics5.baidu.com/feed/a044ad345982b2b767accc3b6daa57e776099b2a.jpeg?token=d7296f48c6b65020fc3a246a7a9f3715',
  'https://pics5.baidu.com/feed/38dbb6fd5266d016f413188605774f0f34fa35ff.jpeg?token=48e1d7d0851b89495f8d8b5f296ac5bc',
];


let a = <Carousel src={d} />;

a.mountTo(document.body);

let tl = new Timeline();
tl.start();