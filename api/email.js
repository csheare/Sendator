const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router()

const sendEmail = (name, state, comment) => {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mhackssendator@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
    
        const mailOption = {
            from: '<mhackssendator@gmail.com>',
            to: 'toledomiguel5@gmail.com',
            subject: 'hello',
            text: comment
        };
    
        transport.sendMail(mailOption, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve({status: 200})
            }
        })
    })
}

router.post('/', (req, res)=> {
    const {name, comment} = req.body;
    sendEmail(name, comment)
    .then(() => { res.redirect('/')})
    .catch(err => { 
        console.log(err)
        res.sendStatus(500)
    });
});

module.exports = router;