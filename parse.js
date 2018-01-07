const axios = require('axios');
const filetools = require('./utils/filetools.js');
const {readFile, writeFile} = filetools; 
const separate = require('./utils/separate.js');
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
    const PARSE_MAP_URL = `./charts/${config.csvDir}/${time}map.json`;


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
            value = value.replace('\r', '');
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
    /**
     * 
     * 
     * @param {lines} data 
     */
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
     * data: { user_ip: String,whiteScreenTime: String,readyTime: String,allloadTime: String,mobile: String, nowTime: String  },
     * 
     * 
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

        mapData(obj, UV, `PV:${PV},UV:${UV}`);
    }
    /**
     * 
     * 
     * @param {String} data 
     */
    function writePVUV(data) {
        // 写入文件
        writeFile(PARSE_PVUV_URL, data).then(res => {
            if(res === 200) {
                console.log('PVUV success');
            }
        }).catch(err=> {
            console.log(`PVUV ${err}`);
        })
    }
    /**
     * 
     * 
     * @param {Object} newData {'ip': String}
     * @param {Number} newDataLength 
     * @param {String} PVUV 
     */
    function mapData(newData, newDataLength, PVUV) {
        console.log(`newData ${JSON.stringify(newData)}`);
        readFile(PARSE_PVUV_URL).then((PVData) => {
            // 判断逻辑
            const oldDataLength = PVData.split(',')[1].split(':')[1];
            console.log(oldDataLength)
            parseMap(oldDataLength, newDataLength, newData, PVUV)
        }, err => {
            fetchAddress(newData).then(Place => {
                // const Place = [ '北京市', '广东省深圳市'];  
                const newParse = parsePlace(Place);
                console.log(newParse);
                const mergeData = mergeHandle([], newParse);
                const writeData = parsetoJson(mergeData);
                console.log(writeData);
                return writeFile(PARSE_MAP_URL,JSON.stringify(writeData))
            }).then((res) => {
                console.log('map1 success')
                writePVUV(PVUV);
            })
        }).catch((err) => {
            console.log(err);
        })
    } 
    /**
     * 
     * 
     * @param {Number} oldDataLength 
     * @param {Number} newDataLength 
     * @param {Object} newData 
     * @param {String} PVUV 
     */
    function parseMap(oldDataLength, newDataLength, newData, PVUV) {
        console.log(oldDataLength, newDataLength, newData)
        if(newDataLength > oldDataLength) {
            const diff = diffDataMap(newData, oldDataLength);
            console.log(diff);
            readFile(PARSE_MAP_URL).then((json) => {
                console.log('json'+json)
                fetchAddress(diff).then(diffPlace => {
                    console.log('diff'+diffPlace);
                    const newParse = parsePlace(diffPlace);
                    console.log('newparse'+JSON.stringify(newParse));
                    const mergeData = mergeHandle(JSON.parse(json), newParse);
                    console.log('merge'+ JSON.stringify(mergeData));
                    const writeData = parsetoJson(mergeData);
                    return writeFile(PARSE_MAP_URL,JSON.stringify(writeData))
                }).then((res) => {
                    console.log('map2 success');
                    writePVUV(PVUV);
                }).catch(err=> {
                    console.log('fetch err' + err);
                })
            })
        }
    }
    /**
     * 
     * 
     * @param {Object} oldData 
     * @param {Object} newData newData {"city":{"place":Number}}
     * @returns Object {"place":Number}
     */
    function mergeHandle(oldData, newData) {
        // console.log(JSON.parse(oldData));
        const Place = {};
        for(var i in oldData) {
          Place[oldData[i].name] = Place[oldData[i].name] ? Place[oldData[i].name] + 1 : oldData[i].value;
        } 
        console.log('city'+ JSON.stringify(newData.city));
        for(var i in newData.city) {
          Place[i] = Place[i] ? parseInt(Place[i]) + parseInt(newData.city[i]) : parseInt(newData.city[i]);
        }
        console.log('place'+ JSON.stringify(Place));
        return Place;
    }

    function diffDataMap(newData, oldDataLength) {
        let j = 1;
        let obj = {};
        for(var i in newData) {
            if(j > oldDataLength) {
                obj[i] = newData[i]
            }
            j++;
        }
        return obj;
    }

    function fetchAddress(obj) {
        return new Promise((resolve, reject) => {
            const fetchArr = Object.keys(obj);
            const arr = [];
            const place = {};
            for(let i = 0; i < fetchArr.length; i++) {
                // console.log(fetchArr[i]);
                arr.push(function() {
                    return new Promise((resolve, reject) => {
                        // http://apis.juhe.cn/ip/ip2addr?ip=${fetchArr[i]}&key=cfa7dff97a88306ff5b49d6941d51a3e 
                        axios.get(`http://ip.soshoulu.com/ajax/shoulu.ashx?_type=ipsearch&ip=${fetchArr[i]}&px=1`).then((res) => {
                            // const area = res.data.result.area;
                            const area = res.data.replace(/\$.+/,'').trim()
                            // console.log(JSON.stringify(area));
                            place[area] = place[area] ? place[area]+1 : 1;
                            resolve(area);
                        }).catch((err) => {
                            reject(err);
                        })
                    }) 
                });
            }
            Promise.all(arr.map(item => item())).then((res) => {
                console.log(res);
                resolve(res);
            }).catch(err=>{
                console.log('all error' + err)
            })
        })
    }
    /**
     * 
     * 
     * @param {Object} obj 
     * @returns 
     * {
     *  city: {Name: Number}
     * }
     */
    function parsePlace(obj) {
        const parseObj = {
            city: {},
        };
        obj = separate(obj);
        for(var i in obj) {
            // const province = obj[i].split('省')[0];
            let city = obj[i];
            // if(obj[i].split('省').length > 1) {
            //     city = obj[i].split('省')[1].replace('市', '');
            // } else {
            //     city = obj[i].replace('市', '');
            // }
            parseObj['city'][city] = parseObj['city'][city] ? parseObj['city'][city]+1 : 1;
        }
        return parseObj;

    }
    function parsetoJson(obj) {
        return Object.keys(obj).map((item) => {
            return {
                name: item,
                value: obj[item]
            }
        })
    }
};
