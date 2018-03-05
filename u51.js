!
function(e) {
    function o(n) {
        if (i[n]) return i[n].exports;
        var r = i[n] = {
            exports: {},
            id: n,
            loaded: !1
        };
        return e[n].call(r.exports, r, r.exports, o),
        r.loaded = !0,
        r.exports
    }
    var i = {};
    return o.m = e,
    o.c = i,
    o.p = "",
    o(0)
} ([function(e, o, i) {
    "use strict"; !
    function() {
        var e = "https://h5.u51.com/web.u51.com/storage/performance-timing/timing.js";
        window._kmd_log_storage_ = [],
        window._kmd_error_storage_ = [],
        window.__timing = window.KMD = {
            show: function() {
                if (!window._kmd_timing_show_) {
                    window._kmd_timing_show_ = (new Date).getTime();
                    try {
                        window.u51PageShow = window._kmd_timing_show_,
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
                }
            },
            onError: function() {
                window._kmd_error_storage_ && window._kmd_error_storage_.push([].slice.call(arguments))
            },
            log: function() {
                window._kmd_log_storage_.push([].slice.call(arguments))
            }
        },
        window.addEventListener && window.addEventListener("error", window.KMD.onError);
        var o = 3,
        i = function i() {
            var n = document.createElement("script");
            n.async = !0,
            n.src = e,
            n.crossOrigin = "anonymous",
            n.onerror = function() {
                o--,
                o > 0 && setTimeout(i, 1500)
            },
            document.head && document.head.appendChild(n)
        };
        setTimeout(i, 1500)
    } ()
}]);