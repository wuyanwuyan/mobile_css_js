var scrollSpeed = 0.6;
var $scroll = $("html, body");
function scrollBottom(callBack) {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var detalTop = $(document).height() - scrollTop;
    $scroll.animate({scrollTop: $(document).height()}, 4000);
};

var serverUrl = 'http://{$IP}:9000';
var socket = io.connect(serverUrl);


socket.on('url', function (data) {
    window.localStorage.localIndex = data.index;
    if ('total' in data) window.localStorage.total = data.total;
    window.location = data.url;
});

socket.on('end', function (data) {
    alert('该公众号爬取完毕');
});

$(window).on('load', function () {
    // scrollBottom();
});

socket.on('connect', function () {
    var key = setInterval(function () {
        var readNum = $('#readNum3').text().trim();

        if (readNum) {

            var likeNum = $('#likeNum3').text().trim();
            var postUser = $('#post-user').text().trim();
            var postDate = $('#post-date').text().trim() || $('#publish_time').text().trim();
            var activityName = $('#activity-name').text().trim();
            var js_share_source = $('#js_share_source').attr('href');

            $.ajax({
                type: 'POST',
                url: serverUrl + "/crawler",
                data: {
                    readNum: readNum,
                    likeNum: likeNum,
                    postUser: postUser,
                    postDate: postDate,
                    activityName: activityName,
                    js_share_source: js_share_source
                },
                datatype: 'json',
                success: function () {
                    var localIndex = window.localStorage.localIndex;
                    var total = window.localStorage.total;
                    clearInterval(key);
                    clearTimeout(timeoutKey);
                    $('#js_content').html("<label style='font-size: 30px;color:green'>提交成功 " + (parseInt(localIndex) + 1) + "/" + total + "</label>");
                },
                error: function () {
                    alert('提交失败');
                }
            });
        }
    }, 500);

    var timeoutKey = setTimeout(function () {
        $.ajax({
            type: 'POST',
            url: serverUrl + "/noData",
            data: {
                url: window.location.href,
                title: $('#activity-name').text().trim()
            },
            datatype: 'json',
            success: function () {
                alert('没有阅读数据？');
            },
            error: function () {
                alert('error 没有阅读数据？');
            }
        });
    }, 10000);
});
