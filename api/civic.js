const request = require('request');
const express = require('express');
const Twit = require('twit');

const Twitter = new Twit({
    consumer_key: '5NV8uh9PFo6mjAWFNxpAJfqc5',
    consumer_secret: 'bqbdIlVNjtcS9pcxUuuH8x6XofqfoEJm62oO5hc49X0l9ZgfFL',
    access_token: '911806493258854401-TEt0uY1TKtPcEdxXcK6mqGPeb9dbv8Y',
    access_token_secret: 'pAkF41rgMKxVmv5jmxIL4jq5rpOpBmbeZSvRqYUiZufCP'
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
    console.log('BODY', req.body);
    if (tweet === undefined || state === undefined){
        
    }
    grabRepresentatives(state)
    .then(handles => {
        console.log('HANDLES', handles)
        if (handles.length === 0 || tweet === undefined) {
            
        }
        else {
            for (let i = 0; i < handles.length; i++) {
                let tweetMessage = `@ ${handles[i]} -- ${tweet} # MHSendator`;
                console.log('TWEET', tweetMessage);
                Twitter.post('statuses/update', {status: tweetMessage}, (err, data, res) => {
                    if (err) {
                        //console.log('Undable to tweet', JSON.stringify(err));
                    } else {
                        console.log('success', data);
                    }
                });
            }
        }
    })
    .then(() => { res.redirect('/'); })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    })
})



module.exports = router;
