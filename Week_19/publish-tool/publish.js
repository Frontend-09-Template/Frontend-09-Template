let http = require('http');
let fs = require('fs');
let archiver = require('archiver');

// fs.stat("./sample.html", (err, states) => {
  // 第一个参数是options，第二个参数是response
  let request = http.request({
    hostname: "127.0.0.1",
    port: 8882,
    method: "post",
    headers: {
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': states.size
    }
  }, response => {
    console.log(response);
  });


  // 创建文件的流 vs readFile()
  // let file = fs.createReadStream("./sample.html");


  const archive = archiver('zip', {
    zlib: { level:9 }
  });
  archive.directory('./sample/', false);

  archive.finalize();
 
  archive.pipe(request);    // 压缩到request流
  
  // file.on('end', () => request.end());
// });


