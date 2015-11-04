var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var bcrypt = require('bcrypt');

var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , hostels = db.get('hostels'),orders = db.get('orders'),users=db.get('users'),posts = db.get('posts'),objects = db.get('objects');
// POSTS and OBJECTS BELONGS TO MALESHIN PROJECT DELETE WHEN PUSHING TOPANDVIEWS TO PRODUCTION
var fs = require('fs-extra');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(require('connect').bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  
//SUBDOMAIN MAGIC 


//app.get('*', function(req,res,next) { 
//  var d = new Date();
//  if(req.headers.host === 'm.topandviews.com')  //if it's a sub-domain
//   {console.log(d+' got a mobile version request on .com from '+req.ip);
//    req.url = '/m' + req.url; 
//    console.log(req.url); //append some text yourself
//  next();} 
 

 // if(req.headers.host === 'm.topandviews.co.uk')  //if it's a sub-domain
 //   {console.log(d+' got a mobile version request on co.uk from '+req.ip);
 //   req.url = '/m' + req.url;  //append some text yourself
 //   console.log(req.url);
 //   next();} 
     
  
 // if(req.headers.host === 'm.topandviews.ru')  //if it's a sub-domain
 //   {console.log(d+' got a mobile version request on .ru from  '+req.ip);
 //   req.url = '/m' + req.url ;  //append some text yourself
 //   console.log(req.url);
 //   next();}
 //   
 //   else {next();}

//}); 



app.get('/',function(req,res) {
  
  console.log('entered "/" route');
  console.log('User-Agent: ' + req.headers['user-agent']);
  var userAgent=req.headers['user-agent'];
  var uacheck = userAgent.indexOf("iPhone") != -1 ;
  console.log(uacheck);
  var d = new Date();
  if(req.headers.host === 'vntrlst.com') {
    res.render('cesi');
  }
    else{
  res.render('index');
  }
  //if(uacheck === true) {
  //  res.render('mindex');
  //}
  ////MIGH ADD AN ELSE
  //else
  //{if(req.headers.host === 'topandviews.ru') 
  //    {console.log(d+' request on .ru from '+req.ip);
  //     if (req.session.admin === 1) {
  //      res.render('adminindex',{'prfname':req.session.lgn});
  //     }
  //     else if(req.session.hostel === 1) {
  //      res.render('hostelindex',{'pfrname':req.session.lgn,'hostelid':req.session.hostelid});
  //     }
  //     else if (req.session.mail != undefined && req.session.lgn != undefined)
  //      {res.render('indexreg',{'prfname':"Привет, "+req.session.lgn+"!"});
  //  console.log('!!! REGISTERED USER CAME BACK !!!');}
  //     else {
  //     res.render('index');}
  //   }
  //  if(req.headers.host === 'topandviews.com') 
  //    {res.redirect('http://topandviews.ru')}
  //   
  //  if(req.headers.host === 'topandviews.co.uk') 
  //    {res.redirect('http://topandviews.ru')}}
   
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
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
app.listen(80,'188.166.12.122');