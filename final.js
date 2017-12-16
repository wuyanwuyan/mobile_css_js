var n321 = (function () {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        n = {
            rotl: function (e, t) {
                return e << t | e >>> 32 - t
            },
            rotr: function (e, t) {
                return e << 32 - t | e >>> t
            },
            endian: function (e) {
                if (e.constructor == Number)
                    return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
                for (var t = 0; t < e.length; t++)
                    e[t] = n.endian(e[t]);
                return e
            },
            randomBytes: function (e) {
                for (var t = []; e > 0; e--)
                    t.push(Math.floor(256 * Math.random()));
                return t
            },
            bytesToWords: function (e) {
                for (var t = [], n = 0, r = 0; n < e.length; n++,
                    r += 8)
                    t[r >>> 5] |= e[n] << 24 - r % 32;
                return t
            },
            wordsToBytes: function (e) {
                for (var t = [], n = 0; n < 32 * e.length; n += 8)
                    t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                return t
            },
            bytesToHex: function (e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push((e[n] >>> 4).toString(16)),
                        t.push((15 & e[n]).toString(16));
                return t.join("")
            },
            hexToBytes: function (e) {
                for (var t = [], n = 0; n < e.length; n += 2)
                    t.push(parseInt(e.substr(n, 2), 16));
                return t
            },
            bytesToBase64: function (e) {
                for (var n = [], r = 0; r < e.length; r += 3)
                    for (var o = e[r] << 16 | e[r + 1] << 8 | e[r + 2], i = 0; i < 4; i++)
                        8 * r + 6 * i <= 8 * e.length ? n.push(t.charAt(o >>> 6 * (3 - i) & 63)) : n.push("=");
                return n.join("")
            },
            base64ToBytes: function (e) {
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var n = [], r = 0, o = 0; r < e.length; o = ++r % 4)
                    0 != o && n.push((t.indexOf(e.charAt(r - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | t.indexOf(e.charAt(r)) >>> 6 - 2 * o);
                return n
            }
        };
    return n;
})();


var n157 = {
    utf8: {
        stringToBytes: function (e) {
            return n157.bin.stringToBytes(unescape(encodeURIComponent(e)))
        },
        bytesToString: function (e) {
            return decodeURIComponent(escape(n157.bin.bytesToString(e)))
        }
    },
    bin: {
        stringToBytes: function (e) {
            for (var t = [], n = 0; n < e.length; n++)
                t.push(255 & e.charCodeAt(n));
            return t
        },
        bytesToString: function (e) {
            for (var t = [], n = 0; n < e.length; n++)
                t.push(String.fromCharCode(e[n]));
            return t.join("")
        }
    }
}


var n158 = (function (e, t) {
    function n(e) {
        return !!e.constructor && "function" === typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
    }

    function r(e) {
        return "function" === typeof e.readFloatLE && "function" === typeof e.slice && n(e.slice(0, 0))
    }

    return function (e) {
        return null != e && (n(e) || r(e) || !!e._isBuffer)
    }
})();


var t = n321,
    r = n157.utf8,
    o = n158,
    i = n157.bin;

var a = function (e, n) {
    e.constructor == String ? e = n && "binary" === n.encoding ? i.stringToBytes(e) : r.stringToBytes(e) : o(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
    for (var u = t.bytesToWords(e), s = 8 * e.length, l = 1732584193, c = -271733879, f = -1732584194, p = 271733878, d = 0; d < u.length; d++)
        u[d] = 16711935 & (u[d] << 8 | u[d] >>> 24) | 4278255360 & (u[d] << 24 | u[d] >>> 8);
    u[s >>> 5] |= 128 << s % 32,
        u[14 + (s + 64 >>> 9 << 4)] = s;
    for (var h = a._ff, y = a._gg, m = a._hh, v = a._ii, d = 0; d < u.length; d += 16) {
        var b = l,
            g = c,
            w = f,
            x = p;
        l = h(l, c, f, p, u[d + 0], 7, -680876936),
            p = h(p, l, c, f, u[d + 1], 12, -389564586),
            f = h(f, p, l, c, u[d + 2], 17, 606105819),
            c = h(c, f, p, l, u[d + 3], 22, -1044525330),
            l = h(l, c, f, p, u[d + 4], 7, -176418897),
            p = h(p, l, c, f, u[d + 5], 12, 1200080426),
            f = h(f, p, l, c, u[d + 6], 17, -1473231341),
            c = h(c, f, p, l, u[d + 7], 22, -45705983),
            l = h(l, c, f, p, u[d + 8], 7, 1770035416),
            p = h(p, l, c, f, u[d + 9], 12, -1958414417),
            f = h(f, p, l, c, u[d + 10], 17, -42063),
            c = h(c, f, p, l, u[d + 11], 22, -1990404162),
            l = h(l, c, f, p, u[d + 12], 7, 1804603682),
            p = h(p, l, c, f, u[d + 13], 12, -40341101),
            f = h(f, p, l, c, u[d + 14], 17, -1502002290),
            c = h(c, f, p, l, u[d + 15], 22, 1236535329),
            l = y(l, c, f, p, u[d + 1], 5, -165796510),
            p = y(p, l, c, f, u[d + 6], 9, -1069501632),
            f = y(f, p, l, c, u[d + 11], 14, 643717713),
            c = y(c, f, p, l, u[d + 0], 20, -373897302),
            l = y(l, c, f, p, u[d + 5], 5, -701558691),
            p = y(p, l, c, f, u[d + 10], 9, 38016083),
            f = y(f, p, l, c, u[d + 15], 14, -660478335),
            c = y(c, f, p, l, u[d + 4], 20, -405537848),
            l = y(l, c, f, p, u[d + 9], 5, 568446438),
            p = y(p, l, c, f, u[d + 14], 9, -1019803690),
            f = y(f, p, l, c, u[d + 3], 14, -187363961),
            c = y(c, f, p, l, u[d + 8], 20, 1163531501),
            l = y(l, c, f, p, u[d + 13], 5, -1444681467),
            p = y(p, l, c, f, u[d + 2], 9, -51403784),
            f = y(f, p, l, c, u[d + 7], 14, 1735328473),
            c = y(c, f, p, l, u[d + 12], 20, -1926607734),
            l = m(l, c, f, p, u[d + 5], 4, -378558),
            p = m(p, l, c, f, u[d + 8], 11, -2022574463),
            f = m(f, p, l, c, u[d + 11], 16, 1839030562),
            c = m(c, f, p, l, u[d + 14], 23, -35309556),
            l = m(l, c, f, p, u[d + 1], 4, -1530992060),
            p = m(p, l, c, f, u[d + 4], 11, 1272893353),
            f = m(f, p, l, c, u[d + 7], 16, -155497632),
            c = m(c, f, p, l, u[d + 10], 23, -1094730640),
            l = m(l, c, f, p, u[d + 13], 4, 681279174),
            p = m(p, l, c, f, u[d + 0], 11, -358537222),
            f = m(f, p, l, c, u[d + 3], 16, -722521979),
            c = m(c, f, p, l, u[d + 6], 23, 76029189),
            l = m(l, c, f, p, u[d + 9], 4, -640364487),
            p = m(p, l, c, f, u[d + 12], 11, -421815835),
            f = m(f, p, l, c, u[d + 15], 16, 530742520),
            c = m(c, f, p, l, u[d + 2], 23, -995338651),
            l = v(l, c, f, p, u[d + 0], 6, -198630844),
            p = v(p, l, c, f, u[d + 7], 10, 1126891415),
            f = v(f, p, l, c, u[d + 14], 15, -1416354905),
            c = v(c, f, p, l, u[d + 5], 21, -57434055),
            l = v(l, c, f, p, u[d + 12], 6, 1700485571),
            p = v(p, l, c, f, u[d + 3], 10, -1894986606),
            f = v(f, p, l, c, u[d + 10], 15, -1051523),
            c = v(c, f, p, l, u[d + 1], 21, -2054922799),
            l = v(l, c, f, p, u[d + 8], 6, 1873313359),
            p = v(p, l, c, f, u[d + 15], 10, -30611744),
            f = v(f, p, l, c, u[d + 6], 15, -1560198380),
            c = v(c, f, p, l, u[d + 13], 21, 1309151649),
            l = v(l, c, f, p, u[d + 4], 6, -145523070),
            p = v(p, l, c, f, u[d + 11], 10, -1120210379),
            f = v(f, p, l, c, u[d + 2], 15, 718787259),
            c = v(c, f, p, l, u[d + 9], 21, -343485551),
            l = l + b >>> 0,
            c = c + g >>> 0,
            f = f + w >>> 0,
            p = p + x >>> 0
    }
    return t.endian([l, c, f, p])
};
a._ff = function (e, t, n, r, o, i, a) {
    var u = e + (t & n | ~t & r) + (o >>> 0) + a;
    return (u << i | u >>> 32 - i) + t
},
    a._gg = function (e, t, n, r, o, i, a) {
        var u = e + (t & r | n & ~r) + (o >>> 0) + a;
        return (u << i | u >>> 32 - i) + t
    },
    a._hh = function (e, t, n, r, o, i, a) {
        var u = e + (t ^ n ^ r) + (o >>> 0) + a;
        return (u << i | u >>> 32 - i) + t
    },
    a._ii = function (e, t, n, r, o, i, a) {
        var u = e + (n ^ (t | ~r)) + (o >>> 0) + a;
        return (u << i | u >>> 32 - i) + t
    },
    a._blocksize = 16,
    a._digestsize = 16,
    function getCode(e, n) {
        if (void 0 === e || null === e)
            throw new Error("Illegal argument " + e);
        var r = t.wordsToBytes(a(e, n));
        return n && n.asBytes ? r : n && n.asString ? i.bytesToString(r) : t.bytesToHex(r)
    }


var date = Date.now().toString(),
    result = getCode(date + "9527" + date.substr(0, 6));

console.log(result);