在 worker 中，可以再创建 worker。

```
let w = new Worker('1.js');
```
关闭
w 可以 w.terminate()
1.js 可以 this.close()


```
w.onerror = function (err) {};
```
1.js 可以 throw new Error('xxx') 或 故意报错
w 截获错误后,重启 w