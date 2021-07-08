let http = require('http');
let fs = require('fs');

// 第一个参数是options，第二个参数是response
let request = http.request({
  hostname: "127.0.0.1",
  port: 8882,
  method: "post",
  headers: {
    'Content-Type': 'application/octet-stream',
  }
}, response => {
  console.log(response);
});

// 这个时候请求才真正的出去
// request.end();


// 创建文件的流 vs readFile()
let file = fs.createReadStream("./sample.html");

// 监听on('data')事件
file.on('data', chunk => {
  console.log(chunk.toString());
  request.write(chunk);
});

file.on('end', (chunk) => {
  console.log("read finished");
  request.end(chunk);
});
