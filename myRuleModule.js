const Koa = require('Koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const app = new Koa();
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);

const router = new Router();

app.use(require('koa-cors')());
app.use(koaBody({multipart: true}));

router.post('/crawler', async (ctx, next) => {
    console.log('------------------    ------------   i am ok',ctx);
    ctx.body = ' i am ok';
});

app.use(router.routes());

server.listen(9000);
let globalSocket = null;
io.on('connection', function (socket) {
    globalSocket = socket;

    console.log('done ---++++++++  connection ',socket);

    // setInterval(()=>{
    socket.emit('news', {hello: Math.random()});
    // },2000)
    socket.on('my other event', function (data) {
        console.log('server my other event', data);
    });
});

function injectJquery(body) {
    return body.replace(/<\/head>/g, '<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script><script src="https://cdn.bootcss.com/socket.io/2.0.4/socket.io.js"></script></head>')
}

var articles = [];
var injectJsFile = require('fs').readFileSync('./injectJs.js', 'utf-8');
var articleInjectJsFile = require('fs').readFileSync('./articleInjectJs.js', 'utf-8');
var injectJs = `<script>${injectJsFile}</script>`
var articleInjectJs = `<script>${articleInjectJsFile}</script>`
var stopGetArticleList = false;
module.exports = {
    summary: 'wechat articles',
    *beforeSendRequest(requestDetail) {
        if (requestDetail.url.indexOf('qq.com') !== -1) {
            // console.log(requestDetail);
        }
    },
    *beforeSendResponse(requestDetail, responseDetail) {
        // 历史文章列表
        if (requestDetail.url.indexOf('mp.weixin.qq.com/mp/profile_ext?') !== -1 && requestDetail.requestOptions.method === 'GET') {
            if (stopGetArticleList) return;
            const newResponse = responseDetail.response;
            let body = responseDetail.response.body.toString();
            let newAdd = []
            if (responseDetail.response.header['Content-Type'].indexOf('application/json') === -1) {

                let msgReg = /var msgList = \'(.*?)\';/;

                let execBody = msgReg.exec(body)[1];
                let msgList = JSON.parse(execBody.replace(/&quot;/g, '"'));//JSON.parse(msgReg.exec(body)[1]);

                msgList.list.forEach((v, i) => {
                    newAdd.push(
                        Object.assign({}, v.app_msg_ext_info, v.comm_msg_info)
                    )
                    let subList = v.app_msg_ext_info.multi_app_msg_item_list || [];
                    subList.forEach(v1 => {

                        newAdd.push(
                            Object.assign({}, v1, v.comm_msg_info)
                        )
                    })
                })


                newAdd.forEach(v => {
                    v.content_url = v.content_url.replace(/amp;amp;/g, '').replace(/\\\//g, '/').replace('#wechat_redirect', '');
                })

                injectJs ='';
                newResponse.body = injectJquery(body).replace(/<\/body>/g, injectJs + '</body>');


                return {response: newResponse};

            } else {
                let regList = /general_msg_list":"(.*)","next_offset/;

                let list = regList.exec(body)[1];

                let reg = /\\"/g;

                let general_msg_list = JSON.parse(list.replace(reg, '"'));

                general_msg_list.list.forEach((v, i) => {
                    newAdd.push(
                        Object.assign({}, v.app_msg_ext_info, v.comm_msg_info)
                    )
                    let subList = v.app_msg_ext_info.multi_app_msg_item_list || [];
                    subList.forEach(v1 => {
                        newAdd.push(
                            Object.assign({}, v1, v.comm_msg_info)
                        )
                    })
                });

                newAdd.forEach(v => {
                    v.content_url = v.content_url.replace(/amp;amp;/g, '').replace(/\\\//g, '/').replace('#wechat_redirect', '');
                })


            }
            articles = articles.concat(newAdd);

            if (articles.length >= 50) {
                globalSocket.emit('stopScroll', {});
                globalSocket.emit('url', {url: articles[0]});
                stopGetArticleList = true;
            }

        } else if (requestDetail.url.indexOf('mp.weixin.qq.com/mp/getappmsgext?') !== -1 && requestDetail.requestOptions.method == 'POST') {   // 获取评论数，点赞数

        } else if (requestDetail.url.indexOf('mp.weixin.qq.com/s?') !== -1 && requestDetail.requestOptions.method == 'GET') {  // 文章内容
            const newResponse = responseDetail.response;
            let body = responseDetail.response.body.toString();
            newResponse.body = body.replace(/\s<\/body>\s/g, articleInjectJs + '</body>');

            console.log(' newResponse.body ', newResponse.body);
            return {response: newResponse};
        }

    },
    *beforeDealHttpsRequest(requestDetail) {
        return true;
    },
};