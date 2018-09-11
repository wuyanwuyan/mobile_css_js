const Koa = require('koa');
const fs = require('fs');

const app = new Koa();
const KoaStatic = require('koa-static');

// x-response-time
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

app.use(KoaStatic('assets'));
// response

app.use(async ctx => {
    // ctx.type = 'text';
    // ctx.body = JSON.stringify(ctx ,null, 2) + '\n port : 3001';
    ctx.body = await  readFileThunk(__dirname + '/result.html');
});



app.listen(3001);