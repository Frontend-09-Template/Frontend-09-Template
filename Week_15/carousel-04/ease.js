
// 线性
export const linear = v => v;

// 三次贝塞尔曲线
function cubicBezier() {

}

// ease 效果为先慢后快再慢
export const ease = cubicBezier(0.25, 0.1, 0.25, 1);

// ease-in
export const easeIn = cubicBezier(0.42, 0, 1, 1);

// ease-out
export const easeOut = cubicBezier(0, 0,.58,1);

// ease-in-out
export const easeInout = cubicBezier(.42,0,.58,1);