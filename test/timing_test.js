(function() {
    window.TuiAperformance = {};
    window.TuiAperformance.openTime = performance.timing.navigationStart || (new Date().getTime());
    document.addEventListener('DOMContentLoaded',function (event) {
        window.TuiAperformance.domready = +new Date() - window.TuiAperformance.openTime;
    });
    window.onload = function () {
        window.TuiAperformance.onload = +new Date() - window.TuiAperformance.openTime;
        mapLiGetHandle();
    };
    window.addEventListener && window.addEventListener("error", errorhandler);
    function errorhandler(e) { 
        var errorObj = [];
        if(e.target != window) {
            errorObj = {
                target: e.target.localName,
                type: e.type,
                resourceUrl:e.target.currentSrc || e.target.src,
                pageUrl:location.href,
            };
        }  else {
            errorObj = {
                target: 'window',
                msg: e.message,
                url: e.filename,
                line: e.lineno,
                col: e.colno,
                error: e.stack || (e.error ? e.error.stack: void 0),
                pageUrl: location.href
            }
        }
        // (new Image()).src = '/error?' + str;  
        errorPost('./error', JSON.stringify(errorObj));
    }
})();

function calculate_load_times() {
    // 页面监控
    var performance = window.performance ||  window.msPerformance || window.webkitPerformance;
    var dns = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
    var tcp = performance.timing.connectEnd - performance.timing.connectStart;
    var whitescreen = performance.timing.domInteractive - performance.timing.navigationStart;
    console.log('---pageInfo---');
    console.log('---dns----', dns);
    console.log('---tcp----', tcp);
    // 机型设备
    window.TuiAperformance.dns = dns > 0 ? dns :0;
    window.TuiAperformance.tcp = tcp > 0 ? tcp :0;
    window.TuiAperformance.mobile = mobileType();
    window.TuiAperformance.mobileScreen = window.screen.width*window.devicePixelRatio + '*' +window.screen.height * window.devicePixelRatio;
    window.TuiAperformance.whitescreen_timing = whitescreen > 0 ? whitescreen : 0;
    function mobileType() {
        var u = navigator.userAgent, app = navigator.appVersion;
        var type =  {// 移动终端浏览器版本信息
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            trident: u.indexOf('Trident') > -1, //IE内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
        };
        var lists = Object.keys(type);
        for(var i = 0; i < lists.length; i++) {
            if(type[lists[i]]) {
                return lists[i];
            }
        }  
    }
}

function errorPost(url, data) {
    var http = new XMLHttpRequest;
    http.open("POST", url, !0),
    http.setRequestHeader("Content-Type", "text/plain"),
    http.send(data);
}

function mapLiGetHandle() {
    var items = window.TuiAperformance;
    console.log(items);
    console.log(Object.keys(items))
    var urlArr = Object.keys(items).map(function(item) {
        if(item !== 'filesInfo' && item !== 'mobile' && item !=='openTime') {
            return item+'='+items[item];
        }
    }).filter(function(item) {
        return item !== undefined;
    });
    (new Image()).src = '/performance?' + urlArr.join("&");
}
calculate_load_times();