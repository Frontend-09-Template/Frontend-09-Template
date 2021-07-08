let http = require('http');
let fs = require('fs');

http.createServer(function(req, res) {
  console.log(req.headers);

  let outFile = fs.createWriteStream("../server/public/index.html");

  req.on('data', chunk => {
    outFile.write(chunk);
  })
  req.on('end', () => {
    outFile.end();
    res.end("success");
  })
  
}).listen(8082);