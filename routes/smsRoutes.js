'use strict';
let express = require('express');
let router = express.Router();

let twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// POST /api/v1/sms/receive/
router.post('/receive', (req, res, next) => {
    if(!req.body || !req.body.firstName || !req.body.country || !req.body.phoneNumber)
        return next('Please include your first name, country and phone number.');

    twilio.sendMessage({
        to: phoneScrub(req.body.phoneNumber),
        from: process.env.TWILIO_PHONE_NUMBER,
        body: 'Hi, ' + req.body.firstName + '! Thanks for trying out my app!'
    }, function(err, sms) {
        if(err) return next(err);
        if(!sms) return next('Unable to send the text. Please try again.')
        res.send(sms);
    });
});

// POST /api/v1/sms/send/
router.post('/send', (req, res, next) => {

    if(!req.body || !req.body.firstName || !req.body.phoneNumber || !req.body.message)
        return next('Please include your first name, phone number and message.');
    twilio.sendMessage({
        to: process.env.ALEX_PHONE_NUMBER,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: 'Message from ' + req.body.firstName + ' at ' + req.body.phoneNumber + ': ' + req.body.message
    }, (err, sentSMS) => {
        if(err) return next(err);
        if(!sentSMS) return next('Unable to send the text. Please try again.');

        twilio.sendMessage({
            to: phoneScrub(req.body.phoneNumber),
            from: process.env.TWILIO_PHONE_NUMBER,
            body: 'Hi, ' + req.body.firstName + '! Your message to candiVison was successfully sent!'
        }, (err, confirmSMS) => {
            if(err) return next(err);
            if(!confirmSMS) return next('Unable to confirm delivery of your text.')
            res.send(confirmSMS);
        });
    });
});

function phoneScrub(str) {
    str = str.replace(/[^\d]/g, '');
    str = '+1' + str;
    return str;
}

module.exports = router;
