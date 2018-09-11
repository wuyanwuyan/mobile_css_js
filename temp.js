const Koa = require('koa');
const http = require("http");
// x-response-time


const app = new Koa();

const port = 3000;

var readFileThunk = function(src) {
    return new Promise(function (resolve, reject) {
        fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

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
// app.use(KoaStatic('assets'));


app.use(async (ctx, next) => {
    var options = {
        host: 'localhost', // 这里是代理服务器
        port: 3001, // 这里是代理服务器端口
        path: ctx.req.url,
        method: ctx.req.method,
        headers: ctx.headers
    };

    let {res1,body} = await reqPromise(options);

    ctx.status = res1.statusCode;
    for(var key in res1.headers) {
        ctx.headers[key] = res1.headers[key];
    }

    ctx.body = body;


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
            // res1.setEncoding('utf8');
            var body = [];
            res1.on('data', (chunk) => {
                body.push(chunk);
                console.log('chunk ' ,chunk);
            });
            res1.on('end', () => {
                resolve({
                    res1,
                    body: Buffer.concat(body)
                });
            });
        }).end();
    })
}