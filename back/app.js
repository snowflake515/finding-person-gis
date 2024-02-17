var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors  = require('cors')

const profiles = require('./routes/profiles');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/profiles', profiles.getProfiles);
app.post('/profiles/getId', profiles.getProfileById);
app.post('/profiles/create', profiles.createProfile);
app.post('/profiles/update', profiles.updateProfile);
app.post('/profiles/delete', profiles.deleteProfile);
app.post('/profiles/search', profiles.searchProfile);
app.post('/profiles/test', profiles.test);

app.use(function(req, res, next) {
  	next(createError(404));
});


app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;