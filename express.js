const express = require('express');
var qs = require('querystring');
const parse = require('url').parse;
require('./utils/date.js');
// require('./mysql');

const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'hyf510',
    database: 'log_info'
});
// const performance = require('./lib/performance.js');
const app = express();
const router = express.Router();
const parseData = require('./parse.js');
router.get('/', function (req, res, next) {
  req.url = './index.html';
  next();
});
app.use(router);
// app.use(performance({
// 	time: 1000, // 秒为单位
// 	originalDir: './originalData', // 数据的目录
// 	errorDir: './errorData' // 报错的目录
// }))
// setInterval(function() {
// 	parseData(new Date().toLocaleDateString());
// }, 1000 * 15);
app.get('/performance', (req, res, next) => {
	const url = parse(req.url).href;
	// console.log(url);
	const urlList = url.split('?')[1];
	const sql_obj = qs.parse(urlList);
	console.log();
	pool.getConnection(function(err, connection) {
		if(err) {
			console.log(err);
			return;
		}
		// connected! (unless `err` is set)
		const userAddSql = 'INSERT INTO PERFORMANCE SET ?';
		const date = new Date().format();

		const useAdd_Params = {
			time_now: date,
			dns_time: sql_obj.dns,
			tcp_time: sql_obj.tcp,
			request_time: sql_obj.request,
			dom_time: sql_obj.dom,
			whitescreen_time: sql_obj.whitescreen,
			domready_time: sql_obj.domready,
			onload_time: sql_obj.onload,
			code_time: sql_obj.codetiming,
		};
		// console.log(useAdd_Params);
		// return;
		connection.query(userAddSql, useAdd_Params, (err, result) => {
			if(err) {
				console.log(err);
				return;
			}
			console.log('-------INSERT----------');
			console.log('INSERT', result);
			console.log('#######################');
		})
	});
	res.json({
		errno: 1
	})
})

app.use(express.static('./'));
const server = app.listen(3000)