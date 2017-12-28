const fs = require('fs');
function readFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) {
                // console.log(err);
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

function writeFile(url, data) {
    return new Promise((resolve, reject) => {
        return fs.writeFile(url, data, err => {
            if(err) {
                // console.log(err);
                reject(err);
            } else {
                resolve(200);
            }
        })
    })
}

module.exports = {
    readFile,
    writeFile
}