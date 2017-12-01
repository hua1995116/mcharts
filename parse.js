const fs = require('fs');


fs.readFile('./data.txt', 'utf8', (err, data) => {
    const jsondata = parse(data)
    parseTime(jsondata);
    fs.writeFile('data.json', JSON.stringify(jsondata), (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log('data write right');
        }
    })
})

function parse(data) {
    data = data.split('\n');
    const arr = [];
    data.sort((a, b) => {
        return a.nowTime - b.nowTime;
    })
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

function parseTime(data) {
    const arr = [];
    arr.push('时间,白屏时间,用户可操作时间,总下载时间')
    data.sort((a, b) => {
        return a.nowTime - b.nowTime;
    })
    data.forEach((item, index) => {
        const li = `${item['nowTime']},${item['whiteScreenTime']},${item['readyTime']},${item['allloadTime']}`.replace(/ms/g, '');
        arr.push(li);
    })
    console.log(arr);
    fs.writeFile('./charts/data.csv',arr.join('\n'), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('success');
        }
    })
}