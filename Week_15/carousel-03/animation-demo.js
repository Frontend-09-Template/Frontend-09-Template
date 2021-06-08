import { Timeline, Animation } from './animation.js';

let tl = new Timeline();
tl.start();

let am = new Animation(document.querySelector("#el").style, "transform", 0, 500, 2000, 0, null, v => `translateX(${v}px)`);
tl.add(am);