var scrollSpeed = 0.6;
var $scroll = $("html, body");
function scrollBottom(callBack) {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var detalTop = $(document).height() - scrollTop;
    $scroll.animate({scrollTop: $(document).height()}, detalTop / scrollSpeed);
};

// $.post()

var serverUrl = "http://10.0.1.180:9000";
var socket = io.connect(serverUrl);
socket.on('news', function (data) {
    console.log(data);
    setInterval(function () {
        socket.emit('my other event', {my: Math.random()});
    }, 2000)
});

socket.on('url', function (data) {
    window.location = data.url;
});

$(window).on('load', function () {
    scrollBottom();
});

setTimeout(function () {
    $.ajax({
        type: 'POST',
        url: serverUrl + "/crawler",
        data: JSON.stringify({a: 1}),
        datatype: 'json',
        success: function () {
            alert('提交成功');
        },
        error: function () {
            alert('提交失败');
        }
    });
}, 6000);