var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(9000);
console.log('start server!');

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    setInterval(()=>{
        socket.emit('news', { hello: Math.random() });
    },2000)
    socket.on('my other event', function (data) {
        console.log(data);
    });
});