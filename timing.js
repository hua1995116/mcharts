function calculate_load_times() {
    // if (performance === undefined) {
    //   console.log("暂不支持performance");
    //   return;
    // }
  
    // var resources = performance.getEntriesByType("resource");
    // if (resources === undefined || resources.length <= 0) {
    //   console.log("暂不支持performance");
    //   return;
    // }
  
    // console.log("= Calculate Load Times");
    // window.TuiAperformance.filesInfo = [];
    // for (var i= 0; i < resources.length; i++) {
    //     var fileinfo = {};
        
    //     console.log("== Resource[" + i + "] - " + resources[i].name);
    //     // Redirect time
    //     var t = resources[i].redirectEnd - resources[i].redirectStart;
    //     console.log("... Redirect time = " + t);

    //     // DNS time
    //     t = resources[i].domainLookupEnd - resources[i].domainLookupStart;
    //     console.log("... DNS lookup time = " + t);

    //     // TCP handshake time
    //     t = resources[i].connectEnd - resources[i].connectStart;
    //     console.log("... TCP time = " + t);

    //     // Secure connection time
    //     t = (resources[i].secureConnectionStart > 0) ? (resources[i].connectEnd - resources[i].secureConnectionStart) : "0";
    //     console.log("... Secure connection time = " + t);

    //     // Response time
    //     t = resources[i].responseEnd - resources[i].responseStart;
    //     console.log("... Response time = " + t);

    //     // Fetch until response end
    //     t = (resources[i].fetchStart > 0) ? (resources[i].responseEnd - resources[i].fetchStart) : "0";
    //     console.log("... Fetch until response end time = " + t);

    //     // Request start until reponse end
    //     t = (resources[i].requestStart > 0) ? (resources[i].responseEnd - resources[i].requestStart) : "0";
    //     console.log("... Request start until response end time = " + t);

    //     // Start until reponse end
    //     t = (resources[i].startTime > 0) ? (resources[i].responseEnd - resources[i].startTime) : "0";
    //     console.log("... Start until response end time = " + t);
    //     fileinfo.name = resources[i].name;
    //     fileinfo.redirect = resources[i].redirectEnd - resources[i].redirectStart;
    //     fileinfo.dns = resources[i].domainLookupEnd - resources[i].domainLookupStart;
    //     fileinfo.tcp = resources[i].connectEnd - resources[i].connectStart;
    //     fileinfo.connection = (resources[i].secureConnectionStart > 0) ? (resources[i].connectEnd - resources[i].secureConnectionStart) : "0";
    //     fileinfo.response = resources[i].responseEnd - resources[i].responseStart;
    //     window.TuiAperformance.filesInfo.push(fileinfo);
    // }
    // 页面监控
    var performance = window.performance ||  window.msPerformance || window.webkitPerformance;
    var dns = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
    var tcp = performance.timing.connectEnd - performance.timing.connectStart;
    console.log('---pageInfo---');
    console.log('---dns----', dns);
    console.log('---tcp----', tcp);
    // 机型设备
    window.TuiAperformance.dns = dns > 0 ? dns :0;
    window.TuiAperformance.tcp = tcp > 0 ? tcp :0;
    window.TuiAperformance.mobile = mobileType();
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

    var defaults = {
        msg:'',  // 错误的具体信息
        url:'',  // 错误所在的url
        line:'', // 错误所在的行
        col:'',  // 错误所在的列
        nowTime: '',// 时间
    };
    // 错误监控
    if(window._error_storage_.length > 0) {
        var storage = window._error_storage_;
        var len = storage.length;
        for(var i = 0; i < len; i++) {
            errorhandler(storage[i]);
        }
    }
    
    window.addEventListener && window.addEventListener("error", errorhandler);
    function errorhandler(errorObj) {
        errorObj = errorObj[0];        
        var msg = errorObj.message;
        var url = errorObj.filename;
        var line = errorObj.lineno;
        var col = errorObj.colno;
        var error = errorObj.error;
        // console.log(msg,url,line,col,error);
        // col = col || (window.event && window.event.errorCharacter) || 0;
        // console.log(url);
        defaults.url = url;
        defaults.line = line;
        defaults.col = col;
        defaults.nowTime = new Date().getTime();

        if (error && error.stack){
            // 如果浏览器有堆栈信息，直接使用
            defaults.msg = error.stack.toString();

        }else if (arguments.callee){
            // 尝试通过callee拿堆栈信息
            var ext = [];
            var fn = arguments.callee.caller;
            var floor = 3;  
            while (fn && (--floor>0)) {
                ext.push(fn.toString());
                if (fn  === fn.caller) {
                    break;
                }
                fn = fn.caller;
            }
            ext = ext.join(",");
            defaults.msg = error.stack.toString();
        }
        var str = ''
        for(var i in defaults) {
            if(defaults[i] === null || defaults[i] === undefined) {
                defaults[i] = 'null'; 
            }
            str += '&'+ i + '=' + defaults[i].toString();
        }
        str = str.replace('&', '').replace('\n','').replace(/\s/g, '');
        (new Image()).src = '/error?' + str;
        console.log(str);
    }
    
    // throw new Error("出错了！");
    mapLiGetHandle();
}
calculate_load_times();


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
