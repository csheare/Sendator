const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@address.com',
        pass: 'yourpassword'
    }
});

app.post('/api/email', (req, res)=> {
    res.sendStatus(200);
});
