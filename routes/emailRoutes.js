'use strict';

let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");           // **** Added
let transporter = nodemailer.createTransport ({

    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM_USER,
      pass: process.env.EMAIL_FROM_PASSWORD
    }
    });

    router.post('/send', (req, res, next) => {
      var data = req.body;
    	transporter.sendMail({
    		from: 		data.contactEmail,
    		to: 			process.env.EMAIL_TO_USER,
    		subject: 	'Message from ' + data.contactName,
    		html: 		data.contactMsg
    	});
    	res.send(data);
    });

    // console.log("Inside emailRoutes.js");
    // app.route('/contact').post(core.sendMail);
module.exports = router;
