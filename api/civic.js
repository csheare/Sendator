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
                return reject(err);
            } else {
                const data = JSON.parse(body)
                console.log(data);
                let officials = data.officials
                if (typeof(officials) === 'undefined')
                    return reject('Not valid address')
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
                return reject(err);
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
    let {tweet, state} = req.body;
    if (tweet === 'undefined' || state === 'undefined'){
        res.send().json({error: 500});
        return
    }
    grabRepresentatives(state)
    .then(handles => {
        if (handles.length === 0 || tweet === 'undefined') {
            res.send().json({error: 500})
            return
        }
        for (let i = 0; i < handles.length; i++) {
            let tweetMessage = `@${handles[i]} -- ${tweet} #MHSendator`;
            Twitter.post('statuses/update', {status: tweetMessage}, (err, data) => {
                if (err) {
                    throw new Error('Undable to tweet at ', handles[i]);
                } else {
                    console.log('success', data);
                }
            });
        }
    })
    .then(() => { res.redirect('/'); })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    })
})



module.exports = router;
