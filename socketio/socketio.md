### socket.io

1- chrome需要导入`<script src="socket.io.js"></script>`
2- nodejs需要导入`cont iorequire('socket.io')`




### 服务器

#### 建立连接
```javascript
http = require('http');
httpServer = http.createServer();
options = {
	path:'/socket.io',
	serverClient:true,// 是否提供客户端文件
	adapter: 
}
io = require('socket.io');

server = io();
server = new io();
server = new io(httpServer, options);

```
