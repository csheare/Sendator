const express = require('express');
const bodyParser = require('body-parser');

const civic = require('./api/civic');

//const url = 'localhost';
const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/styles'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/api/twitter', civic);

app.listen(port, ()=> {
    console.log('Server started on port', port)
});
