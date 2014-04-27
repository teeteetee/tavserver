var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
//var users = require('./routes/user');
//var searchresults = require('./routes/searchresults');

var mongo = require('mongodb');
var db = require('monk')('localhost/tav');
var places = db.get('places');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));
app.use(app.router);


app.get('/', function (req,res) {
    res.sendfile('public/bootstrap/indexRETHINK.html')
    console.log('request registered')
});
//app.get('/places/:placename', function (req,res) {
 //   console.log(req.params.placename);
 //   res.sendfile('public/bootstrap/ppXTRBIG.html')
//});


app.post('/search', function(req,res) {
    var searchquery = req.body.search;
    console.log(searchquery);
    var docs;
    places.find({},function(err,docs){
        console.log(docs);
        res.render('searchresults',{"searchresults":docs});
       });
    });
     
     



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log('server running');

module.exports = app;

app.listen(80,'188.226.132.200');
//app.listen(3000);