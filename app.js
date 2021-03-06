const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./server/controller');
const rest = require('./server/rest');
const session = require('koa-session2');
const config = require('./web_config');
const path = require('path');
const koaStatic = require('koa-static');
const historyApiFallback = require('koa-history-api-fallback');
// 导入WebSocket模块:
const WebSocket = require('ws');
// 引用Server类:
const WebSocketServer = WebSocket.Server;
const app = new Koa();

//声明当前环境变量(全局)
// process.env.NODE_ENV = 'production';
const isProduction = process.env.NODE_ENV === 'production';

// log request URL:记录日志信息
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next(); //直接跳转至下一个中间件，后面的两行代码最后执行
    execTime = new Date().getTime() - start;
    // console.log("完成时间：" + execTime + "ms")
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(session({
    key: "SESSIONID",
    // store: new Store()
}));

//第三个解析POST请求
app.use(bodyParser());

// bind .rest() for ctx:
app.use(rest.restify());

//最后一个middleware处理URL路由：
app.use(controller());

//历史记录回滚
app.use(historyApiFallback());
//加载静态文件
app.use(koaStatic(path.resolve('dist')));
// static file support:如果是开发环境，则处理静态文件  ===头像
if (!isProduction) {
    let staticFiles = require('./server/static-files');
    app.use(staticFiles('/static/', path.resolve('static')));
}

var server = app.listen(config.port);
console.log('app started at port 3000...');

//建立消息订阅
let wss = new WebSocketServer({
    server: server
});
wss.on('connection', function(ws, req) {
    const ip = req.connection.remoteAddress;
    ws.on('message', function(message) {
        console.log(message);
        //订阅用户信息变化
        var wsUserInfo = new WebSocket(`ws://106.14.145.165:3334/record/subscribe?${config.sample_U}&token=${message}`);
        wsUserInfo.on('open', function() {
            console.log('ws成功连接服务端')
        });
        wsUserInfo.on('message', function(message) {
            //判断是否是第一条提示语句，无用
            if (JSON.parse(message).successmsg) {
                ws.send(message);
            } else {
                let _message = JSON.parse(message);
                _message.body.links = "";
                _message.ip = ip;
                if (ws.readyState == ws.OPEN) { //这个状态一定要判断
                    ws.send(JSON.stringify(_message));
                }
            }
        });
    });
});