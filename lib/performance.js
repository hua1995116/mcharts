const parse = require('url').parse;
const querystring = require('querystring');
const fs = require('fs');
const redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
/**
 * 
 * 
 * @param {Object} config 
 * @returns 
 */
module.exports = function(config) {
	const configer = {
		time: config.time ? parseInt(config.time) : 10, // 秒为单位
		dataDir: config.dataDir ? config.dataDir : './originalData', // 数据的目录
		errDir: config.errDir ? config.errDir : './errorData' // 报错的目录
    }
    setInterval(saveData(configer), 1000 * configer.time);
	return function(req, res ,next) {
		const url = parse(req.url);
		// 劫持对应的路由
	    if (url.pathname == '/action') {
	    	// 监听用户行为数据
	        let user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	        user_ip = user_ip.replace('::ffff:', '');
	        const info = req.url.split('?')[1];
	        const parseInfo = querystring.parse(info);
	        const urlData = `user_ip=${user_ip}&whiteScreenTime=${parseInfo['whiteScreenTime']}&readyTime=${parseInfo['readyTime']}&allloadTime=${parseInfo['allloadTime']}&nowTime=${new Date().getTime()}&mobile=${parseInfo['mobile']}`;
	        client.hset(["hash key", urlData, "some value"], redis.print);
	    }
	    if(url.pathname == '/error') {
	    	// 监听错误的情况
	        const info = req.url.split('?')[1];
	        const parseInfo = querystring.parse(info);
	        const urlData = `msg=${parseInfo['msg']}&url=${parseInfo['url']}&line=${parseInfo['line']}&col=${parseInfo['col']}&nowTime=${new Date().getTime()}`;
	        client.hset(["error key", urlData, "some value"], redis.print);
        }
	    next();
	}
}
/**
 * 
 * 
 * @param {Object} config 
 */
function saveData(config) {
	return function() {
        // redis 数据库存储
        const nowDate = new Date().toLocaleDateString();
        const arr = [];
        const errarr = [];
        client.hkeys("hash key", function (err, replies) {
            // console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
                arr.push(reply);
            });
            if (arr.length > 0) {
                arr.push('\n');
                const data = arr.join('\n');
                fs.appendFile(`${config.dataDir}/${nowDate}data.txt`, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('info success');
                        client.del('hash key');
                    }
                })
            }
        });
        client.hkeys("error key", function (err, replies) {
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
                errarr.push(reply);
            });
            // const dir = './errorData';
            if (errarr.length > 0) {
                errarr.push('\n');
                const data = errarr.join('\n');
                fs.appendFile(`${config.errDir}/${nowDate}error.txt`, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('error success');
                        client.del('error key');
                    }
                })
            } else {
                const data = `msg=null&nowTime=${new Date().getTime()}\n`;
                fs.appendFile(`${config.errDir}/${nowDate}error.txt`, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('error success');
                        client.del('error key');
                    }
                })
            }
        });
    }
}
