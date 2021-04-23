// 实现Request类
const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if(this.headers["Content-Type"] === "application/json")
      this.bodyText = JSON.stringify(this.body);
    else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded")
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

    this.headers["Content-Length"] = this.bodyText.length;
  }

  send() {
    return new Promise((resolve, reject) => {
      // ......
    });
  }
}


// 从用法上开始设计, 给Request传一个configObject进去，当请求结束，会去调用一个send方法。send方法返回一个promise，promise成功之后会得到一个response对象。
void async function() {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customed"
    },
    body: {
      name: "cici"
    }
  });

  let response = await request.send();
  console.log(response);
}