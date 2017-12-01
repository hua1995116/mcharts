const redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const http = require('http');
const parse = require('url').parse;
const querystring = require('querystring');
const fs = require('fs');

const server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            const url = parse(req.url);
            if (url.pathname == '/action') {
                let user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                user_ip = user_ip.replace('::ffff:', '');
                const info = req.url.split('?')[1];
                const parseInfo = querystring.parse(info);
                const urlData = `user_ip=${user_ip}&whiteScreenTime=${parseInfo['whiteScreenTime']}&readyTime=${parseInfo['readyTime']}&allloadTime=${parseInfo['allloadTime']}&nowTime=${new Date().getTime()}`;
                client.hset(["hash key", urlData, "some value"], redis.print);
            }
            const body = data;
            res.end(body);
        }
    })
});

let arr;

setInterval(function () {
    arr = [];
    client.hkeys("hash key", function (err, replies) {
        // console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
            arr.push(reply);
        });
        if (arr.length > 0) {
            arr.push('\n');
            const data = arr.join('\n');
            fs.appendFile('data.txt', data, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('success');
                    client.del('hash key');
                }
            })
        }
    });


}, 1000 * 10);


server.listen(3000);