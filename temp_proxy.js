// httpProxy = require('http-proxy');
// //
// // Create your proxy server and set the target in the options.
// //
// httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(8000); // See (†)


var http = require("http");

http.createServer(function(req,res){


    var options = {
        host: 'localhost', // 这里是代理服务器
        port: 3000, // 这里是代理服务器端口
        path: req.url,
        method: req.method,
        headers: {
            // 如果代理服务器需要认证
            'Proxy-Authentication': 'Base ' + new Buffer('user:password').toString('base64') // 替换为代理服务器用户名和密码
        }
    };

    var proxyReq = http.request(options, function(res1) {
        res1.pipe(res, {end:true}); // 这个pipe很喜欢
        // console.log(req1.url);
        // res1.on('end', () => {
        //     proxyReq.end()
        // });
    }).end();


}).listen(3001);

