"use strict";
let express = require('express');
let helmet = require("helmet");
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
let mongoose = require('mongoose');
let passport = require('passport');
require('./models/user');
require('./models/candidate');
require('./models/tweet');
require('./models/comment');
mongoose.connect('mongoose://localhost/campaignProject');

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.use(express.static('./public'));
app.use(express.static('./bower_components'));
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

let userRoutes = require('./routes/userRoutes');
let candidateRoutes = require('./routes/candidateRoutes');
let tweetRoutes = require('./routes/tweetRoutes');
let commentRoutes = require('./routes/commentRoutes');

app.get('/*', function(req, res) {
	res.render('index');
});

app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/candidates/', candidateRoutes);
app.use('/api/v1/tweets/', tweetRoutes);
app.use('/api/v1/comments/', commentRoutes);

module.exports = app.listen(port, () => {
	console.log('Example app listening at http://localhost:' + port);
});
