const request = require('request');
const express = require('express');
const Twit = require('twit');

const Twitter = new Twit({
    consumer_key: 'lT5LFthcDz8GC5nJEDRZTajn2',
    consumer_secret: 'MZQfJ8TYgXkusdJnqac1CKaQhVRlE2WSA9E7YdUNT5eH7bpmSx',
    access_token: '911695261986062338-YirhCNBkAnUCa6Vvxn3djcurSdoY4q7',
    access_token_secret: 'NWWfKwTXzo6c8IJAGrjQFAO5pM1M47nThrOjfaJJkObuo'
})

const API_KEY = process.env.API_KEY;
const URL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${API_KEY}`;

const router = express.Router();

const grabRepresentatives = (address) => {
    return new Promise((resolve, reject) => {
        request.get(`${URL}&address=${address}&roles=legislatorUpperBody`, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                const data = JSON.parse(body)
                console.log('data', data);
                let officials = data.officials
                let twitterHandles = []
                officials.map(senator => {
                    channels = senator.channels;
                    for (let i = 0; i < channels.length; i++) {
                        if (channels[i].type === 'Twitter')
                            twitterHandles.push(channels[i].id);
                    }
                })
                resolve(twitterHandles);
            }
        });
    });
}

const tweet = (status) => {
    return new Promise((resolve, reject) => {
        Twitter.post('statuses/update', {status}, (err, data, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

router.get('/:state', (req, res) => {
    const { state } = req.params;
    grabRepresentatives(state)
    .then(data => {res.send({handles: data})})
});

router.post('/', (req, res) => {
    const {comment, state} = req.body;
    grabRepresentatives(state)
    .then(handles => {
        handles.map( (handle) => {
            let tweet = `@${handle} -- ${comment}`;
            Twitter.post('statuses/update', {status: tweet}, (err, data, res) => {
                if (err) {
                    throw new Error('Unable to tweet at ', handle);
                } else {
                    console.log('success', data);
                }
            })
        })
    })
    .then(() => { res.redirect('/'); })
    .catch((err) => { console.log(err) })
})



module.exports = router;