const express = require('express');
const bodyParser = require('body-parser');

const url = 'localhost';
const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('hello world');
});


app.listen(port, url, ()=> {
    console.log('Server started on localhost', port)
});