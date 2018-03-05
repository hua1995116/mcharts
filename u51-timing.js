!
function(e) {
    function n(t) {
        if (o[t]) return o[t].exports;
        var r = o[t] = {
            exports: {},
            id: t,
            loaded: !1
        };
        return e[t].call(r.exports, r, r.exports, n),
        r.loaded = !0,
        r.exports
    }
    var o = {};
    return n.m = e,
    n.c = o,
    n.p = "",
    n(0)
} ([function(e, n, o) {
    "use strict";
    function t(e) {
        return 
        e && e.__esModule ? e: {default:e}
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var r = o(4),
    i = t(r);
    window.KMD = window.__timing = i.default,
    n.default = i.default,
    e.exports = n.default
},
function(e, n, o) {
    "use strict";
    function t(e) {
        return e && e.__esModule ? e: {
        default:
            e
        }
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var r = o(2),
    i = t(r),
    a = function(e, n) {
        e = e.indexOf("?") >= 0 ? e + "&user_id=" + (0, i.default)():
        e + "?user_id=" + (0, i.default)();
        var o = new XMLHttpRequest;
        o.open("POST", e, !0),
        o.setRequestHeader("Content-Type", "text/plain"),
        o.send(n)
    };
    n.default = {
        post: a
    },
    e.exports = n.default
},
function(e, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    }),
    n.default = function() {
        var e = document.cookie,
        n = o.exec(e);
        return n && n.length > 1 ? n[2] : ""
    };
    var o = /(pg-uid|user-id|userid)=(\d+)/;
    e.exports = n.default
},
function(e, n, o) {
    "use strict";
    function t(e) {
        return e && e.__esModule ? e: {default:e}
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var r = o(1),
    i = t(r),
    a = "https://api.u51.com/nodejs-performance-log-server/error",
    d = "0.2.20",
    s = {},
    u = function(e) {
        try {
            var n = a + "?_u=" + encodeURIComponent(window.location.href) + "&_v=" + encodeURIComponent(d);
            if ("string" == typeof e) i.
        default.post(n, JSON.stringify({
                message: e
            }));
            else {
                var o = e.message + "-" + e.filename + "-" + e.lineno + "-" + e.colno,
                t = s[o],
                r = t && new Date - t < 2e3;
                if (s[o] = new Date, r) return;
                i.
            default.post(n, JSON.stringify({
                    message: e.message,
                    stack: e.stack || (e.error ? e.error.stack: void 0),
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno
                }))
            }
        } catch(e) {}
    },
    c = function() {
        window.addEventListener ? window.addEventListener("error", u) : window.onerror = function(e, n, o, t, r) {
            u({
                filename: n,
                message: e,
                lineno: o,
                colno: t,
                stack: r && r.stack ? r.stack: ""
            })
        },
        setInterval(function() {
            var e = [];
            for (var n in s) new Date - s[n] > 5e3 && e.push(n);
            for (var o = 0; o < e.length; o++) delete s[e[o]]
        },
        2e4)
    };
    try {
        c()
    } catch(e) {
        u(e)
    } !
    function() {
        if (window._kmd_error_storage_ && window._kmd_error_storage_.length > 0) 
            for (var e = window._kmd_error_storage_,n = 0; n < e.length; n++) 
                u.apply(window, e[n]);
        window._kmd_error_storage_ = null
    } (),
    n.default = u,
    e.exports = n.default
},
function(e, n, o) {
    "use strict";
    function t(e) {
        return e && e.__esModule ? e: {
        default:
            e
        }
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
    function(e) {
        return typeof e
    }: function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol": typeof e
    };
    o(7);
    var i = o(5),
    a = t(i),
    d = o(3),
    s = t(d),
    u = o(1),
    c = (t(u), o(6), "firstShowPage"),
    w = "https://api.u51.com/nodejs-performance-log-server/d.png",
    f = "https://api.u51.com/nodejs-performance-log-server/t.png",
    p = "0.2.20",
    l = {},
    m = !1,
    v = {
        dns: ["domainLookupEnd", "fetchStart"],
        ntw: ["responseEnd", "fetchStart"],
        dlt: ["domInteractive", "fetchStart"],
        dct: ["domComplete", "fetchStart"],
        tlt: ["loadEventEnd", "fetchStart"],
        spt: [c, "fetchStart"],
        wvi: ["webviewLoadUrl", "webviewStart"],
        wvl: ["fetchStart", "webviewLoadUrl"],
        wvs: [c, "webviewStart"]
    },
    g = function() {
        var e = [];
        for (var n in v) e.push(n);
        if (0 !== e.length) {
            var o = {};
            try {
                window.performance && (0, a.
            default)(l, performance.timing);
                for (var t = 0; t < e.length; t++) {
                    var r = e[t],
                    i = l[v[r][0]],
                    d = l[v[r][1]],
                    u = i - d; ! isNaN(u) && u >= 0 && d && d > 1e3 && (o[r] = u, delete v[r])
                }
                var c = [];
                c.push("_u=" + encodeURIComponent(window.location.href)),
                c.push("_o=" + encodeURIComponent(window.offlineVersion || "")),
                c.push("_v=" + encodeURIComponent(p));
                for (var w in o) c.push(w + "=" + o[w]);
                c.push("kmdNetwork=" + (window.u51WebViewPerformance.network || "")),
                c.push("kmdOs=" + (window.u51WebViewPerformance.os || "")),
                c.push("kmdHasBg=" + (window.u51HasBackground || !1)),
                (new Image).src = f + "?" + c.join("&")
            } catch(e) { (0, s.
            default)(e)
            }
        }
    },
    h = function() {
        var e = window._kmd_timing_show_ || (new Date).getTime();
        if (l[c] = e, !window.u51PageShow) try {
            window.u51PageShow = e,
            /android/i.test(navigator.userAgent) ? window.SuperSpeedBridge && window.SuperSpeedBridge.u51PageShowNotify() : window.webkit && window.webkit.messageHandlers ? window.webkit.messageHandlers.nativeServer.postMessage(JSON.stringify({
                Method: "u51PageShowNotify",
                CallbackId: "",
                Args: {}
            })) : window.ENBridge_sendMessageToNative && window.ENBridge_sendMessageToNative(JSON.stringify({
                Method: "u51PageShowNotify",
                CallbackId: "",
                Args: {}
            }))
        } catch(e) {}
        if (window.performance && window.performance.timing && window.performance.timing.fetchStart > 0) {
            var n = e - window.performance.timing.fetchStart;
            if (m) {
                var o = [];
                o.push("_u=" + encodeURIComponent(window.location.href)),
                o.push("_o=" + encodeURIComponent(window.offlineVersion || "")),
                o.push("_v=" + encodeURIComponent(p)),
                o.push("spt=" + (n || 0)),
                o.push("kmdNetwork=" + (window.u51WebViewPerformance.network || "")),
                o.push("kmdOs=" + (window.u51WebViewPerformance.os || "")),
                o.push("kmdHasBg=" + (window.u51HasBackgroud || !1)),
                (new Image).src = f + "?" + o.join("&")
            } else l.spt = n
        }
        y.show = function() {}
    },
    _ = function(e, n, o, t) {
        var i = [];
        "object" === ("undefined" == typeof e ? "undefined": r(e)) ? (i.push("s=" + encodeURIComponent(e.service || "")), i.push("e=" + encodeURIComponent(e.event || "")), i.push("p=" + encodeURIComponent(e.page || "")), i.push("v=" + encodeURIComponent(e.value || "")), i.push("pe=" + encodeURIComponent(e.pEvent || "")), i.push("pp=" + encodeURIComponent(e.pPage || "")), i.push("m=" + encodeURIComponent(e.msg || "")), i.push("rqd=" + encodeURIComponent(e.rqd || "")), i.push("rsd=" + encodeURIComponent(e.rsd || ""))) : (i.push("s=" + encodeURIComponent(e || "")), i.push("e=" + encodeURIComponent(n || "")), i.push("p=" + encodeURIComponent(o || "")), i.push("m=" + encodeURIComponent(t || ""))),
        (new Image).src = w + "?" + i.join("&")
    },
    y = {
        show: h,
        onError: s.
    default,
        log: _
    }; !
    function() {
        if (window.u51WebViewPerformance = window.u51WebViewPerformance || {},
        window.u51WebViewPerformance.timing = window.u51WebViewPerformance.timing || {},
        l.webviewStart = window.u51WebViewPerformance.timing.webviewStart || NaN, l.webviewLoadUrl = window.u51WebViewPerformance.timing.webviewLoadUrl || NaN, window._kmd_timing_show_ && h(), window.performance && window.performance.timing && window.performance.timing.loadEventEnd > 0 ? (m = !0, g()) : window.addEventListener("load",
        function() {
            m = !0,
            setTimeout(g, 0)
        }), window._kmd_log_storage_ && window._kmd_log_storage_.length > 0) {
            for (var e = window._kmd_log_storage_,
            n = 0; n < e.length; n++) _.apply(window, e[n]);
            window._kmd_log_storage_ = []
        }
    } (),
    n.
default = y,
    e.exports = n.
default
},
function(e, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
        value: !0
    });
    var o = function(e) {
        for (var n = arguments.length,
        o = Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++) o[t - 1] = arguments[t];
        for (var r = 0,
        i = o.length; r < i; r++) {
            var a = o[r];
            for (var d in a) e[d] = a[d]
        }
        return e
    };
    n.
default = o,
    e.exports = n.
default
},
function(e, n) {
    "use strict";
    function o(e) {
        return e ? e.replace(/#.*/, "").replace(/\?.*/, "") : ""
    }
    Object.defineProperty(n, "__esModule", {
        value: !0
    }),
    n.replaceQuery = o;
    n.qs = {
        stringify: function(e) {
            var n = [];
            for (var o in e) e.hasOwnProperty(o) && n.push(o + "=" + encodeURIComponent(e[o]));
            return n.join("&")
        },
        parse: function(e) {
            for (var n = e.replace(/^\?/, ""), o = n.split("&"), t = o.length, r = {},
            i = 0; i < t; i++) {
                var a = o[i];
                if (a) {
                    var d = a.split("=");
                    d[0] && d[1] && (r[d[0]] = d[1])
                }
            }
            return r
        }
    }
},
function(e, n, o) {
    "use strict";
    function t(e) {
        return e && e.__esModule ? e: {
        default:
            e
        }
    }
    var r = o(2),
    i = t(r),
    a = void 0,
    d = void 0,
    s = "https://api.u51.com/nodejs-performance-log-server/h.png",
    u = "0.2.20",
    c = function(e, n, o) {
        var t = [],
        r = location.hash.replace(/\?.*/g, "") || "#/";
        1 !== o && r === d || (a && t.push("_p=" + encodeURIComponent(a)), t.push("user_id=" + encodeURIComponent((0, i.
    default)())), t.push("_v=" + encodeURIComponent(u)), t.push("_f=" + o), t.push("_u=" + encodeURIComponent(window.location.href)), t.push("_o=" + encodeURIComponent(window.offlineVersion || "")), (new Image).src = s + ("?" + t.join("&")), a = "" + location.href.replace(/\?.*/g, "").replace(/#.*/g, "") + r, d = r)
    },
    w = function() {
        for (var e = document.getElementsByTagName("script"), n = void 0, o = void 0, t = 0; t < e.length; t++) {
            var r = e[t];
            if (/timing\.js/.test(r.src)) {
                var i = r.src,
                d = /service=([\w\-]*)/.exec(i);
                d && (n = d[1]);
                var s = /service=([\w\-]*)/.exec(i);
                s && (o = s[1])
            }
        }
        if (/\/renpin-loan-new\//.test(window.location.href)) {
            var u = !1;
            window.addEventListener("hashchange",
            function() {
                u && (a = null),
                c(n, o, 2)
            },
            !1),
            window.addEventListener("beforeunload",
            function() {
                u = !0,
                c(n, o, -1),
                setTimeout(function() {
                    u = !1
                },
                100)
            },
            !1)
        }
        c(n, o, 1)
    };
    w()
}]);