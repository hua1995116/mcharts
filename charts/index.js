const http = require('http');
const fs = require('fs');

const app = http.createServer((req, res) => {
    fs.readFile('./index.html', 'utf8', (err, data) => {
        res.end(data);
    })
});

app.listen(8888);