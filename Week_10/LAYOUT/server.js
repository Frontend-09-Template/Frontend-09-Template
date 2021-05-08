const http = require('http');

http.createServer((request,response)=>{
    let body = []
    request.on('error',(err)=>{
        console.error(err);
    }).on('data',(chunk) => {
        // console.log('data:',chunk);
        body.push(chunk);  //  获得到Buffer数据时，放入数组中（Buffer数组）
    }).on('end',() => {
        body = Buffer.concat(body).toString();   // 请求结束时将Buffer数组转为字符串
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(`<html>
        <head>
          <style>
            #container{
                display:flex;
                width:500px;
                height:300px;
                background-color:rgb(255,255,255);
            }
            #container #myid{
              width:200px;
              height:100px;
              background-color:rgb(255,0,0);
            }
           #container .c1{
               flex:1;
               background-color:rgb(0,255,0);
           }
          </style>
        </head>
        <body>
            <div id="container">
                <span id="myid"></span>
                <div class="c1"></div>
            </div>
        </body>
        </html>`)
    })

}).listen(8088);
console.log('server started');