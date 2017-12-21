var scrollSpeed = 0.4;
var $scroll = $("html, body");
var stopScroll = false;

var scrollKey = setInterval(function () {
    window.scrollTo(0,document.body.scrollHeight);
},1000);

var serverUrl = 'http://{$IP}:9000';
var socket = io.connect(serverUrl,function () {
    
});

socket.on('url', function (data) {
    window.localStorage.localIndex = data.index;
    if ('total' in data) window.localStorage.total = data.total;
    window.location = data.url;
});

socket.on('stopScroll', function (data) {
    stopScroll = true;
    clearInterval(scrollKey);
    $scroll.stop(true);
});

$(window).on('load', function () {
    scrollBottom();
});