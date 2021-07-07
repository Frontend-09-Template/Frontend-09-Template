let http = require('http');

// 第一个参数是options，第二个参数是response
let request = http.request({
  hostname: "127.0.0.1",
  port: 8082
}, response => {
  console.log(response);
});

// 这个时候请求才真正的出去
request.end();