const sourceMap = require('source-map');
const rawSourceMap = {
    version: 3,
    file: 'min.js',
    names: ['bar', 'baz', 'n'],
    sources: ['one.js', 'two.js'],
    sourceRoot: 'http://example.com/www/js/',
    mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
};

async function testAsync() {
    const whatever = await sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
  
        console.log(consumer.sources);
        // [ 'http://example.com/www/js/one.js',
        //   'http://example.com/www/js/two.js' ]
      
        console.log(consumer.originalPositionFor({
          line: 2,
          column: 28
        }));
        // { source: 'http://example.com/www/js/two.js',
        //   line: 2,
        //   column: 10,
        //   name: 'n' }
      
        console.log(consumer.generatedPositionFor({
          source: 'http://example.com/www/js/two.js',
          line: 2,
          column: 10
        }));
        // { line: 2, column: 28 }
      
        consumer.eachMapping(function (m) {
          // ...
        });
      
        return computeWhatever();
      });
}

testAsync();

// async function testAsync() {
//     return "hello async";
// }

// const result = testAsync();
// console.log(result);