const filetools = require('./utils/filetools.js');
const {readFile, writeFile} = filetools; 
const mailer = require('./utils/mailto.js');
const debounce = require('./utils/index.js').debounce;

module.exports = function parse(time) {
    const config = {
        originalDir: './originalData',
        errorDir: './errorData',
        jsonDir: './jsonData',
        csvDir: 'csvData',
        Timetitle: '时间,白屏时间,用户可操作时间,总下载时间',
        Errortitle: '时间,错误量',
    }
    let ERROR_DATA = 0;
    const ORIGINAL_DATA_URL = `${config.originalDir}/${time}data.txt`;
    const ERROR_DATA_URL = `${config.errorDir}/${time}error.txt`;
    const PARSE_ERROR_URL = `./charts/${config.csvDir}/${time}error.csv`;
    const PARSE_PVUV_URL = `./charts/${config.csvDir}/${time}PVUV.csv`;
    const PARSE_TIME_URL = `./charts/${config.csvDir}/${time}time.csv`;
    const PARSE_MOBILE_URL = `./charts/${config.csvDir}/${time}mobile.csv`;


    readFile(ORIGINAL_DATA_URL).then((data) => {
        const jsondata = parseData(data)
        parseTime(data);
        parseMobile(jsondata);
        parsePVUV(jsondata);
        // fs.writeFile(`${config.jsonDir}/${config.date}data.json`, JSON.stringify(jsondata), (err) => {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         console.log('data write right');
        //     }
        // });
    }).catch(err => {
        console.log(`readdata ${err}`);
    })
    
    readFile(ERROR_DATA_URL).then((data) => {
        parseError(data);
    })
    

    /**
     * 
     * 
     * @param {list} data 
     * @returns {Array} json数据
     */
    function parseData(data) {
        data = data.split('\n');
        const arr = [];
        // data.sort((a, b) => {
        //     return a.nowTime - b.nowTime;
        // })
        data.forEach((value, index, array) => {
            if(!!value) {
                const obj = {};
                value = value.split('&');
                value.forEach((item, i) => {
                    const name = item.split('=')[0];
                    const val = item.split('=')[1];
                    obj[name] = val;
                })
                arr.push(obj);
            } 
        })
        return arr;
    }

    function parseError(data) {
        data = data.split('\n');
        const arr = [];
        arr.push(config.Errortitle);
        let k = 0;
        let time = 0;
        data.forEach((value, index, array) => {
            if(!!value) {
                value = value.split('&');
                if(value[0].split('=')[1] == 'null') {
                    time = value[value.length -1].split('=')[1];
                    arr.push(`${time},0`);
                    time = 0;
                } else {
                    if(!time) {
                        value = value[value.length -1].split('=')[1];
                        time = value;
                    }
                    k++; 
                }
                 
            } else {
                if(time&&k) {
                    arr.push(`${time.replace('\r','')},${k}`);
                    time = 0;
                    k = 0;
                }
            }
        })
        writeFile(PARSE_ERROR_URL, arr.join('\n')).then(res => {
            if(res === 200) {
                console.log('error success');
            }
        })
        .catch(err=> {
            console.log(`error ${err}`);
            done();
        })
    }
    
    
    
    /**
     * 
     * 
     * @param {Object} data 原始数据
     * 以空行为界限，每个空行一次算平均数
     */
    function parseTime(data) {
        data = data.split('\n');
        const arr = [];  
        let time = 0;
        let whiteScreenTime = 0;
        let readyTime = 0;
        let allloadTime = 0;
        let k = 0;
        
        for(let i = 0; i < data.length; i++) {
            let value = data[i];
            if(!!value) {
                const obj = {};
                value = value.split('&');
                if(value.length <= 1) {
                    ERROR_DATA++;
                    continue;
                }
                value.forEach((item, i) => {
                    const name = item.split('=')[0];
                    const val = item.split('=')[1];
                    obj[name] = val;
                });
                if(obj['whiteScreenTime'] > 20000 || obj['readyTime'] > 20000 || obj['allloadTime'] > 20000) {
                    ERROR_DATA++;
                    continue;
                }
                if(!time) {
                    time = obj['nowTime'];
                }
                whiteScreenTime += parseInt(obj['whiteScreenTime']);
                readyTime += parseInt(obj['readyTime']);
                allloadTime += parseInt(obj['allloadTime']);
                k++;
            } else {
                if(time === 0 || !whiteScreenTime || !readyTime || !allloadTime) {
                    ERROR_DATA++;
                    continue;
                }
                arr.push({
                    time: time,
                    whiteScreenTime: parseInt(whiteScreenTime/k),
                    readyTime:parseInt(readyTime/k),
                    allloadTime:parseInt(allloadTime/k),
                });
                time = 0;
                whiteScreenTime = 0;
                readyTime = 0;
                allloadTime = 0;
                k = 0;
            } 
        }
    
        arr.sort(function(a, b) {
            return a.time - b.time;
        });
        const newarr = arr.map((item, index) => {
            return `${item.time},${item.whiteScreenTime},${item.readyTime},${item.allloadTime}`
        })
        newarr.unshift(config.Timetitle);
        
        if(ERROR_DATA > 100) {
            setTimeout(function() {
                mailer(`异常数据已经超过${ERROR_DATA}`);
            }, 1000 * 60 * 2)
        }
        // 写入文件
        writeFile(PARSE_TIME_URL, newarr.join('\n')).then(res => {
            if(res === 200) {
                console.log('time success');
            }
        })
        .catch(err => {
            console.log(`time ${err}`);
            done();
        })
    }
    /**
     * 
     * 
     * @param {Array} data parse好的数据 
     */
    function parseMobile(data) {
        const obj = {};
        const length = data.length;
        // 利用map进行统计
        data.forEach((item, index) => {
            obj[item['mobile']] = obj[item['mobile']] ? obj[item['mobile']]+ 1 : 1;
        });
        const arr = [];
        for(var i in obj) {
            const persent = `${(obj[i]/length*100).toFixed(1)}`
            arr.push(`${i},${persent}`);
        }
        // 写入文件
        writeFile(PARSE_MOBILE_URL,arr.join('\n')).then(res => {
            if(res === 200) {
                console.log('mobile success');
            }
        }).catch(err=> {
            console.log(`mobile ${err}`);
            done();
        })
    }
    /**
     * 
     * 
     * @param {Object} data parse好的数据 
     */
    function parsePVUV(data) {
        const obj = {};
        // 数据的长度
        const PV = data.length;
        data.forEach((item, index) => {
            obj[item['user_ip']] = obj[item['user_ip']] ? obj[item['user_ip']]+ 1 : 1;
        });
        // 合并对象后的长度
        const UV = Object.keys(obj).length;
        // 写入文件
        writeFile(PARSE_PVUV_URL, `PV:${PV},UV:${UV}`).then(res => {
            if(res === 200) {
                console.log('PVUV success');
            }
        }).catch(err=> {
            console.log(`PVUV ${err}`);
        })
    }
};
