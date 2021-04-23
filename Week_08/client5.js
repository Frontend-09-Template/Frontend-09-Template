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
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      // 判断TCP连接是否存在，如果已存在，就可以直接在这个连接上发送请求
      if (connection) {
        connection.write(this.toString());
      } else {
        // 如果没有，则根据host和port创建连接
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }
      connection.on('data', (data) => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\r ${this.bodyText}`;
  }
}
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(string) {
    // 会对string像状态机一样逐个的处理
    for(let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    // 状态机的代码
    if(this.current === this.WAITING_STATUS_LINE) {
      // 这一行结束
      if (char === '\r') {
        this.current =  this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current ===  this.WAITING_STATUS_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        // 空行
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if(char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if(char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if(char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if(this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length  = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if(this.current === this.WAITING_LENGTH_LINE_END) {
      if(char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if(this.current === this.READING_TRUNK) {
      if (this.current === this.READING_TRUNK) {
        this.content.push(char);
        this.length --;
        if (this.length === 0) {
          this.current = this.WAITING_NEW_LINE;
        }
      }    
    } else if(this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if(this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
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