const sourceMap = require('source-map');
const SourceMapConsumer = sourceMap.SourceMapConsumer; 
const fs = require('fs');

function getMap(path,fn) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if(err) {
                console.log(err);
                reject();
            }
            // console.log(data);
            resolve(data);
        })
    })
}

function init(filename, lineNumber, columnNumber) {
    getMap(filename).then(async (data) => {

        const whatever = await SourceMapConsumer.with(data, null, consumer => {

            console.log(consumer.sources);
            // [ 'http://example.com/www/js/one.js',
            //   'http://example.com/www/js/two.js' ]
          
            console.log(consumer.originalPositionFor({
              line: lineNumber,
              column: columnNumber
            }));
            // { source: 'http://example.com/www/js/two.js',
            //   line: 2,
            //   column: 10,
            //   name: 'n' }

        });
        // let consumer = sourceMap.SourceMapConsumer(JSON.parse(data));
        // let originPos = consumer.originalPositionFor({
        //     line: lineNumber,
        //     column: columnNumber
        // });
        // let xhr = errorMessage.error.xhr || {};
        // let errMes = {
        //     message: errorMessage.message,
        //     filename: errorMessage.filename,
        //     scriptURI: scriptURI,
        //     lineNo: originPos.line,
        //     colNo: originPos.column,
        //     errorObj: errorObj,
        //     xhr:{
        //         ...xhr,
        //         status:xhr.status,
        //         statusText:xhr.statusText,
        //         withCredentials:xhr.withCredentials
        //     }
        // };
        // console.log(originPos);
    }).catch(err => {
        console.log(err)
    })
}


init('./export.min.js.map', 1, 2272);