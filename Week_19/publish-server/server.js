let http = require('http');
// let fs = require('fs');
let unzipper = require('unzipper');

http.createServer(function(req, res) {

  // let outFile = fs.createWriteStream("../server/public/tmp.zip");
  // req.pipe(outFile);
  // 覆盖式发布
  req.pipe(unzipper.Extract({ path: '../server/public/' }));
  
}).listen(8082);