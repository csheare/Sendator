const express = require('express');
const grabRepresentatives = require('./civic');

const router = express.Router()

router.post('/', (req, res)=> {
    const {state} = req.body;
    grabRepresentatives(state)
    .then(res => { console.log(res); })
    .catch(err => { console.log(err); });
});

module.exports = router;