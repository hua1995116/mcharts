const fs = require('fs');
fs.readFile('./data.json', 'utf8', (err, data) => {
    data = JSON.parse(data);
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
})