const fs = require('fs');


fs.readFile('./data.txt', 'utf8', (err, data) => {
    fs.writeFile('data.json', JSON.stringify(parse(data)), (err) => {
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