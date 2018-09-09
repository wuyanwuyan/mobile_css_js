const Koa = require('koa');
const app = new Koa();
const http = require("http");
// x-response-time

const port = 3000;

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async (ctx, next) => {
    var options = {
        host: 'localhost', // 这里是代理服务器
        port: 3001, // 这里是代理服务器端口
        path: ctx.req.url,
        method: ctx.req.method,
        headers: ctx.headers
    };

    let res = await reqPromise(options);

    ctx.body = res;


})


app.use(async ctx => {
    ctx.body = JSON.stringify(ctx ,null, 2) + '\n port : 3000';
});


app.listen(port, () => {
    console.log(`start server, listening http://localhost:${port}`);
});


var reqPromise = (options) => {
    return new Promise((resolve ,reject) => {
        var proxyReq = http.request(options, function(res1) {
            resolve(res1)
        }).end();
    })
}