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

//app.use(favicon('/images/tavlogobw.png'));
app.use(logger('dev'));
app.use(require('connect').bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
  cookieName: 'session',
  secret:'2342kjhkj2h3i2uh32j3hk2jDKLKSl23kh42u3ih4',
  duration:4320 * 60 *1000,
  activeduration:1440 * 60 * 1000,
  httpOnly: true
}));

var lguser = {};
app.use(function(req,res,next){
   if(req.session && req.session.lgn){
     users.findOne({mail:req.session.mail},function(err,user){
      if(err){
        next();
      }
      else {
        if(user){
        lguser = user;
        delete lguser.phr;
        req.session = lguser;
        next();}
      else {next();}
      } 
     });
   }
   else {
    next();
   }
});

app.get('/hostel', function(req,res) {
  console.log('JESUS !!!');
  res.render('hostel');
});

app.get('logout',function(req,res){
  delete req.session;
  res.redirect('/');
});


 //app.get('/index',function(req,res){
 //  var incomming = req.headers.host;

 // if (incomming === 'topandviews.ru') {
 //   console.log(' serving RU');
 //   res.render('index');
 // } 
  
 // if (incomming === 'topandviews.co.uk') {
 //   console.log(' serving CO.UK');
 //   res.render('index');
 // }

 // if (incomming === 'topandviews.com') {
 //   console.log(' serving COM');
 //   res.render('index');
 //    }
//});

  
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
  if(uacheck === true) {
    res.render('mindex');
  }
  if(req.headers.host === 'topandviews.ru') 
    {console.log(d+' request on .ru from '+req.ip);
     res.render('index');}
  if(req.headers.host === 'topandviews.com') 
    {console.log(d+' request on .com from '+req.ip);
     res.render('index');}
  if(req.headers.host === 'topandviews.co.uk') 
    {console.log(d+' request on .co.uk from '+req.ip);
     res.render('index');}
});

app.get('/calendar',function(req,res){
  res.render('calendar');
  
});

//REGISTRATION
app.get('/rrregisterrr',function(req,res){
     res.render('register');
});

app.post('/newuser',function(req,res){
    //THOSE USERS ARE NORMAL PEOPLE, HOSTEL STUF WILL BE REGISTERED THROUGH ADMIN
    var vmail = req.body.mail; 
    var vu = req.body.u; //NEEDED TO WRITE COMMENTS, DONT ASK AT REGISTRATION
    if (vu.length === 0 )
      {vu = 0;}
    var vp = bcrypt.hashSync(req.body.p,bcrypt.genSaltSync(10));
    var ms = {};
    ms.trouble=1;
    ms.mtext='email incorrect';
    // MUST INCLUDE enquiries - all  - accepted WHEN WRITING TO THE DB
    // CHECK MAIL BEFOR WRTING
    function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
    if (validateEmail(vmail) === true) {
    users.find({mail:vmail},function(err,doc){
      if (err)
      {
        //DO SMTH
      }
      else {
        if(doc.length === 0)
        {
          users.insert({mail:vmail,phr:vp,lgn:vu,enquiries:{all:0,accepted:0}});
          find.users({email:vmail},function(err,docdoc){
            if (err){
              //DO SMTH
            }
            else{
               if (docdoc.length != 0) {
                req.session.user = confirmed;
                res.render('index',{'hello':confirmed.lgn,'userid':confirmed.userid});
               }
               else {
                  ms.mtext ='fail';
                  res.send(ms);
               }
            }
          });
        }
        else {
           ms.mtext='email exists'
           res.send(ms);
        }
      }// end of err's else
    });
    }   
    else {
      // INCORRECT EMAIL, SO WE SEND A NOTIFICATION
      res.send(ms);
    }

    });
    

//LOGIN MECHANICS
app.post('/check',function(req,res){
  //CHECK FOR PASSPORT PRIOR TO HOSTEL CHECK, SORT THIS OUT AFTER ALPHA
  vphr=req.body.phr;
  vlgn=req.body.lgn; // email
  //adding a marker to send to client
  // MARKER MECHANICS IS NOT PRESENT YET , NEEDS TO BE IMPLEMENTED
   var  ms = {};
  ms.trouble=1;
  ms.text='db';
  //end of marker
  users.findOne({lgn:vlgn},function(err,confirmed){
    if (err)
      {res.send(ms);}
    else 
    {
      if (confirmed.length != 0)
      {
         if(confirmed.hostel != 0) //HOSTEL LOGED IN , SERVE HOSTELCLIENT
            {
              if (bcrypt.compareSync(vphr,confirmed.phr))
               {
             var x = confirmed.hostel;
              hostels.find({hostelid:x},function(err,hostel){
                if (err)
                {
                  //DO SOMETHING
                }
                else {
                  if (hostel.length != 0)
                  {
                    var offridlst = hostel.offerids;
                     if (hostel.country === "russia")
                    { 
                      req.session = confirmed;
                      var name=hostel.nameru;
                    res.render('hosteladminru',{'offers':offridlst,'hostelname':name});
                    //
                    }
                    else {
                       req.session = confirmed;
                      res.render('hosteladminen',{'offers':offridlst,'hostelname':name});
                    }
                  }  
                  else
              {
                //DO SOMETHING
              } 
              }
              
            });
            }
            else
            {
              ms.mtext('wrong pas');
              res.send(ms);
              //WRONG PASSWORD
            }
         }
         else
          //USER LOGED IN 
         {
          if(bcrypt.compareSync(vphr,confirmed.phr))
          {
          //INDEX MUST BE MODIFIED TO SUPPORT NEW LOGING IN SYSTEM
          req.session = confirmed;
          res.redirect('index',{'hello':req.session.lgn,'usrid':req.session.usrid});
           }
           else {
            ms.mtext('wrong pas');
              res.send(ms);
              //WRONG PASSWORD
           }
         }
      }
      else {
        ms.text='wronguser'
        res.send(ms);
      }
    }
  });
});

//app.get('/full',function(req,res) {
//  if(req.headers.host === 'topandviews.ru') 
//    {console.log(d+' request on .ru from '+req.ip);
//     res.render('index');}
//  if(req.headers.host === 'topandviews.com') 
//    {console.log(d+' request on .com from '+req.ip);
//     res.render('index');}
//  if(req.headers.host === 'topandviews.co.uk') 
//    {console.log(d+' request on .co.uk from '+req.ip);
//     res.render('index');}
//});

//SEARCH RESULTS PROTOTYPE PAGE
app.get('/test',function(req,res) {
  res.render('sr')
});

//done with subdomains

//full version starts here, mobile will be below

//ORDER MECHANICS TEST
app.get('/ququ',function(req,res){

  console.log('request for ququ');
  res.render('orderstest');
});

//ADMIN SECTION FOR DB CONTROL
app.get('/admin/:section',function(req,res){
  switch (req.params.section) {
    case ('orders'):
      orders.find({},function(err,docs){
        if (err) {res.send('error');}
        else {
             if (docs != {})
                           {
                           console.log(docs);
                           res.render('adminorders',{'docs' : docs});
                            }
      
              else {
                    res.send('empty db');
                   }
              }
    });
    break
    case('hostels'):
      hostels.find({},function(err,docs){
        //NO PAGE , NEEDS TO BE CREATED ('adminorders' AS  A TEMPLATE)
        res.render('adminhostels',{'docs' : docs});
      });
    break
    case('users'):
      users.find({},function(err,docs){
        //NO PAGE , NEEDS TO BE CREATED ('adminorders' AS  A TEMPLATE)
        res.render('adminusers',{'docs' : docs});
      });
    break
    default:
    //ERROR HERE OR SOMETHING
    break
  }

});
console.log('FIRST BREAKPOINT');

//app.get('/admin', function(req,res) {
//  res.render('adminauth',{'message' : null});
//});

//EMPTY DB (STILL PLACES NEEDS CORRECTION) NAND DELETE PICTURES
app.post('/admin/clear',function(req,res){
  console.log(req.ip+" ENTERED /CLEAR");
  var clearpass = 'proventobewrong';
  if(req.body.token = clearpass) {
    places.remove({},function (err,done){
      console.log('all records deleted');
      res.send('all records deleted');
    });

     var removepath =  __dirname +"/public/images/places"; 
    fs.remove(removepath, function(err){
      if (err) {return console.error(err);}

         console.log("/PLACES DELETED ")
    });
  }

  else {
    res.send('ERROR');}
});
 console.log('SECOND BREAKPOINT');
//app.get('/upload', function(req,res) {
//      console.log('got request on /upload');
//      res.render('uploadauth');
//      });

//app.post('/uploadauth', function(req,res){
//  var masterlogin = 'tooleetoo676';
//  var masterpassword = 'cloderstam555';
//  var login = req.body.login;
//  var pass = req.body.password;
//
//  if (masterlogin !== login || masterpassword !== pass ) 
//                                                        {
//                                                          res.render('uploadauth');
//                                                        }
//  else 
//      {
//        res.render('upload');
//      }                                                      
//
//});  

// MOBILE VERSION STARTS HERE

//app.get('/m/',function(req,res){
//  console.log('got to /m/ section, render depending on req.headers.host');
//  if (req.headers.host === 'm.topandviews.ru') {res.render('mindex')}
//  if (req.headers.host === 'm.topandviews.com') {res.render('mindex')}
//  if (req.headers.host === 'm.topandviews.co.uk') {res.render('mindex')}  
//});

//app.get('/m/:lang/*',function (req,res,next){
//  var checklang = req.params.lang;
//  if (checklang === 'ru' ||checklang ===  'en' ||checklang ===  'es' ||checklang ===  'fr' ||checklang ===  'de' ||checklang ===  'it')
//    {next()}
//  else {res.render('my404')}
//});


//app.get('/m/:lang/geo', function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'ru'){res.render('mgeoru');} 
//   if (lang === 'en'){res.render('mgeo');} 
//   if (lang === 'de'){res.render('mgeode');} 
//   if (lang === 'fr'){res.render('mgeofr');} 
//   if (lang === 'es'){res.render('mgeoes');} 
//   if (lang === 'it'){res.render('mgeoit');} 
//});

//app.get('/m/:lang', function(req,res){
//  console.log('got into /m/:lang route')
//   var lang = req.params.lang;
//   if (lang === 'ru'){res.render('mindexru');} 
//   if (lang === 'en'){res.render('mindex');} 
//   if (lang === 'de'){res.render('mindexde');} 
//   if (lang === 'fr'){res.render('blank');} 
//   if (lang === 'es'){res.render('blank');} 
//   if (lang === 'it'){res.render('blank');} 
//});

//app.get('/m/:lang/geo/:city', function(req,res){
//    var lang = req.params.lang;
//    var vreqcity = req.params.city;
//    if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
//    if (vreqcity === 'newyork') {vreqcity = 'New York'};
//    if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
//    var absolute = [];
//    var rooftop = [];
//    var terrace = [];
//    var cuisine = [];
//    tops.find({city : vreqcity,toptype : 1}, function(err,firsttypedocs){
//       console.log('got data for absolute');
//         absolute = firsttypedocs;
//         tops.find({city : vreqcity,toptype : 2}, function(err,secondtypedocs){
//            console.log('got data for rooftop');
//              rooftop = secondtypedocs;
//              tops.find({city : vreqcity,toptype : 3}, function(err,thirdtypedocs){
//                   terrace = thirdtypedocs;
//                   tops.find({city : vreqcity,toptype : 4},function(err,fourthtypedocs){
//                        cuisine = fourthtypedocs;
//                     
//                         res.render('mgeoindex', { 'city' : vreqcity , 'first' : absolute , 'second' : rooftop , 'third' : terrace , 'fourth' : cuisine });   
//                   });
//              });
//         });
//
//    });
//
//  
//
//});


//mobile version's end



//app.get('/:lang',function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'en') {res.render('index')}
//  if (lang === 'ru') {res.render('indexru')}
//  if (lang === 'fr') {res.render('indexfr')}
//  if (lang === 'de') {res.render('indexde')}
//  if (lang === 'es') {res.render('indexes')}
//  if (lang === 'it') {res.render('indexit')} 
//});

//app.get('/:lang/contact', function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'en') {res.render('contact')}
//  if (lang === 'ru') {res.render('contactru')}
//  if (lang === 'fr') {res.render('contactfr')}
//  if (lang === 'de') {res.render('contactde')}
//  if (lang === 'es') {res.render('contactes')}
//  if (lang === 'it') {res.render('contactit')} 
//});

app.post('/search', function(req,res){
  console.log("INTO SEARCH , REQ.BODY:"+req.body.wifi);
  var vmixgenders = req.body.mixgenders;
  var vctype = req.body.ctype;
  var vwifi = req.body.wifi;
  var vppr = req.body.parking;
  var vprice = req.body.price;
  // ADD SEARCH CRITERIAS
  hostels.find({price:vprice},function(err,hostels){
    console.log(" ID DID SEARCH THE DB");
    if (hostels.length != 0)
      { cosnole.log(" , FOUND SOMETHING AND GOING TO SEND IT TO YOU");
        res.render("sr",{"hostels":hostels});}
    else {
      console.log(" IT WAS EMPTY AND IM GOING TO RENDER");
      //NO EMPTYSR YET EXISTS , MUST BE CREATED
      res.redirect('/emptysr');
    }
  });
});

app.get('/emptysr',function(req,res){
  res.render('emptysr');
}); 

app.get('/hostels/:hostel',function(req,res){
  var word=req.params.hostel 
  if (word === null) {res.render('index')}
  else {
    hostels.find({ppredir:word},function(err,hostel){
      if (hostel.length != 0) {
       res.render('pp',{"hostel":hostel});
      }
      else {
        // logging maybe ?
        res.render('index');
      }
    });
  }
});

console.log('THIRD BREAKPOINT');

//
//app.get('/:lang/geo/:city/new', function(req,res){
//   var nlang = req.params.lang;
//   var ncity = req.params.city;
//   var nnmbr = 0 ;
//   places.find({city : ncity}, {limit : 0 ,sort: {yearnow: -1}},function(err,newdoc) {
//       //, {limit : 0 ,sort: {yearnow: -1}}
//       function cnt (value,index,array) {
//        nnmbr++
//       } 
//       newdoc.forEach(cnt);
//       console.log(nnmbr,newdoc);
//
//  if (nlang === 'en') {res.render('new',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'ru') {res.render('newru',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'fr') {res.render('newfr')}
//  if (nlang === 'de') {res.render('newde',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'es') {res.render('newes')}
//  if (nlang === 'it') {res.render('newit')} 
//
//   });
//});

//EMPTY ORDERS
app.post('/drop',function(req,res){
  pass = req.params.drop;
  pp = 'secureshit';
  if (pass = pp)
  {
    orders.remove({},function (err,done){
      if (err){console.log('ERROR DROPIG DB');
         res.send('ERROR DROPIG DB');
       }
      else {
      testcount = 0;
      console.log('all recordsorders deleted');
      res.send('all records deleted');
       }
    });
  }
  else {
    res.send('Error')
  }
});

//UPDATE HOSTELS PAGE (STILL PACES NEEDS AN UPDATE)
app.post('/adminsr/updatepage', function(req,res) {
	var placenametest = req.body.placename;

	places.findOne({hname: placenametest}, function(err,singleplace){
       var placedata = JSON.stringify(singleplace,null,2);
        var nameeng = singleplace.nameen;
        var updateplacename = singleplace.placename;
		res.render('update', {'jsondata' : placedata,'nameeng':nameeng, 'placename': updateplacename});
	});
	
});

console.log('FOURTH BREAKPOINT');

//UPDATE HOSTELS MECHANICS (STILL PLACES NEEDS AN UPDATE)
app.post('/admin/update', function(req,res) {
 
 // UPDATES variable should be introduced, incremets each update on a place

 // var vplacename = req.body.placename ,
 // vnameru = req.body.nameru,
 // vnameen = req.body.nameen,
 // vtelephone = req.body.telephone,
 // vwww = req.body.www,
 // vppredir = req.body.ppredir,
 // vworkinghours = req.body.workinghours,
 // vrooftopbool = req.body.rooftop,
 // vterracebool = req.body.terrace,
 // vfid = req.body.fid ,
 // foid = req.body.oid ,
 // vmid = req.body.mid ,
 // vcity = req.body.city,
 // vcountry = req.body.country,
 // vyearnow = req.body.yearnow,
 // vyearfounded = req.body.yearfounded,
 // vadressru = req.body.adressru,
 // vadressen = req.body.adressen;


  if(req.files.images.length > 0) {
    var data = JSON.stringify(req.files);
    res.send(req.files.images[1]);
  }
  else 
    {res.send('empty files');
  }

    

//	places.update({placename: vplacename},{
//nameru : vnameru,
//nameen : vnameen,
//telephone : vtelephone,
//www : vwww,
//ppredir : vppredir,
//mainpreview : vmainpreview,
//cigarsbool : vcigarsbool,
//shishabool : vshishabool,
//workinghours : vworkinghours,
//rooftopbool : vrooftopbool,
//terracebool : vterracebool,
//fid : vfid,
//mid : vmid,
//oid : foid,
//toptype : vtoptype,
//glbtype : vglbtype,
//city : vcity,
//country : vcountry,
//yearnow : vyearnow,
//type : vtype,
//yearfounded : vyearfounded,
//images : photonum,
//});
//
//    console.log(vplacename+' has been updated')
//	res.redirect(vppredir);

  
});
console.log('FIFTH BREAKPOINT');
//app.post('/testupload', function(req,res){
//    var firstfield = req.body.textupload;
//    var secondfield = req.files.fileupload.name;
//    if (secondfield != 0) {console.log(secondfield);}
//    else {
//    	console.log('its fucking empty , bro !');
//         }
//    vteset ="/public/images/places/" + req.files.fileupload.name;
//    console.log(vteset);
//});


//app.post('/search', function(req,res){
//
//	var query = req.body.search;
//	console.log('searching for '+query);
//	var docs = [];
//	places.find({placename:query}, function(err,docs){
//       console.log(docs);
//       res.render('searchresults', {'searchresults': docs});
//       // placename:query});
//    });
// });

app.get('/upload', function(req,res) {
	    console.log('got request on /upload');
	    res.render('uploadauth');
	    });

app.post('/uploadauth', function(req,res){
  var masterlogin = 'test';
  var masterpassword = 'test';
  var login = req.body.login;
  var pass = req.body.password;
  console.log(pass);
  console.log(login);
  console.log("JESUS");
  if (masterlogin != login || masterpassword != pass ) 
                                                        {
                                                          res.render('uploadauth');
                                                        }
  else 
      {
        res.render('upload');
      }                                                      

});  





var testcount=1;
app.post('/orders/:hostel/:price',function(req,res){
  //ORDERCOUNT must go here, this is begining of getting statistic together. Orders taken, objects added, visitors etc.
  vphonep = req.body.phonep;
  vmail = req.body.mail;
  vphone = req.body.phone;
  vregistered = req.body.registered;
  vhostelid = req.params.hostel;
  vofferid= req.params.price;
  year = req.body.fyear;
  vmonth = req.body.fmonth;
  vday = req.body.fday;
  year = req.body.toyear;
  vmonth = req.body.tomonth;
  vday = req.body.today;
  vnights = req.body.nights;
  //DONT FORGET ABOUT "OUTER" FIELD
   if (vofferid === 'test')
   {
     vphonep = 1;
     vmail = 'test@test.com';
     vphone = 79237364453;
     vregistered = 0;
     vhostelid = testcount;
     vfyear = 2014;
     vfmonth = 11;
     vfday = 07;
     vtoyear = 2014;
     vtomonth = 12;
     vtoday = 10;
     vnights = 3; 
    orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:0,reqip:req.ip,outer:0});
    testcount++;

   }
   else {
  orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:0,reqip:req.ip,outer:0});
   }
});

console.log('SIXTH BREAKPOINT');

app.post('/enquery/:hostel/:price', function(req,res){
  console.log('GOT INTO ENQUERY !!!');
  //all the hostelclient magic happens here
  x = req.params.hostel;
  y = req.params.price;
  //z = req.param('coco');
  z = req.body.coco;
  month = req.body.month;
  year = req.body.year;
  console.log(z);
  console.log(month);
  console.log(year);
  
  switch ( z ) {
   case "enquiries":
   //used on main page of hostel web client
  orders.find({hostelid:x,offerid:y},function(err,results){
    res.send(results);
  });
   break
   case "calendar":
   console.log('GOT INTO CALENDAR');
     // used to form calendar in hostel web client , obviously
     // nights parameter must be used to form a class by an offerid name which then can be light up in web intrface calendar to see the length of stay
     orders.find({hostelid:x,offerid:y,fmonth:month,fyear:year},function(err,docs){
      if (err) {res.send('ERROR')}
      else {res.send(docs);}
     });
   break
   case "remove":
    //used to remove an offer 

    hostels.find({hostel:x},function(err,result){
      var offrcnt =  result.offrqntt;
      if (offrcnt > 0){
      offrcnt--;
      hostels.update({hostelid:x},{$set:{offrqntt:offrcnt}});
      eval("hostels.update({hostelid:x},{$set:{offer"+y+":undefined}});");
      hostels.find({hotelid:x},function(err,result){
        offrcnt++;
        eval("if (result.offer"+offrcnt+" === undefined){console.log('OFFER SUCCESFULY DELETED');}else {console.log('OFFER SEEMS TO STILL BE PRESENT: '+results.offer"+offrcnt+");}");
      });
    }
      else 
        //WHAT SHOUD BE DONE IN THIS CASE ? 
        {res.send("NOTHING TO BE DELETED")}
    });
     //SHOULD ANYTHING BE SENT TO CLIENT TO CONFIRM ???
   break
   case"add":
    //used to create an offer
    //OFFERS MUST BE CONFIRMED 
    var voffrprc=req.body.offrprc;
    var vcapacity = req.body.capacity;
    hostels.find({hostelid:x},function(err,result){
      var offrcnt = result.offrqntt;
       offrcnt++;
      eval("hostels.update({hostelid:x},{$set:{offer"+offrcnt+":{price:"+voffrprc+",capacity:"+vcapacity+",enquiries:0}}});");
    });
    
   break
   case "removeownclient":
    //used to remove clients enquieries which didn't come through our booking system 
    var venqid = req.body.enqid;
    orders.update({enqid:venqid},{$set:{confirmed:2}});
   break
   case"addownclient":
    //used to create a client enquiries which are not comming through our system
  var enqnum;
  hostels.find({hostelid:x},function(err,result){
    if (err)
    {console.log('DB ERROR WHILE LOOKUP FOR ADDOWNCLIENT');}
    else
    {
      if(result.length != 0)
      {enqnum = results.ownclients; }
      else{
        //WHAT ELSE ? 
      }
    }
  });

  var venqid = enqnum++;
  //var vofferid= req.params.price; - already set as "y"
  var year = req.body.fyear;
  var vmonth = req.body.fmonth;
  var vday = req.body.fday;
  var year = req.body.toyear;
  var vmonth = req.body.tomonth;
  var vday = req.body.today;
  var vnights = req.body.nights;
   orders.insert({hostelid:vhostelid,offerid:y,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:1,reqip:req.ip,outer:1,enqid:venqid});
   hostels.find({hostelid:x},function(err,result){
    if (err)
    {
      //WHAT ??
    }
   else
   {
    if(result.length != 0)
    {
      var vownclients = result.ownclients;
      vownclients++;
      hostel.update({hostelid:x},{$set:{ownclients:vownclients}});
    }
   else {
    //WHAT?
   }
   }
   });
   break
   case "confirm":
    //used to confirm a request for a room came through our system
    var venqid = req.body.enqid;
    orders.find({enqid:venqid},function(err,result){
      if (err)
         {
           //WHAT ??
         }
      else
         {
          if(result.length != 0)
             { 
               if (result.registered != 0)
               {var vuserid = result.registered}
               var vofferid = result.offerid;
               var vouter = results.outer;
                  hostels.find({hostelid:x},function(err,doc){
                    if(err)
                    {
                      //DO SMTH
                    }
                    else {
                      if(doc.length != 0)
                        {
                          //!!! CHECK IF ENOUGH CAPACITY
                         eval("var vcapacity = doc."+vofferid+".capacity;");
                         if (vcapacity > 0) 
                                    {
                                  //ADD CHECK IF OUTER
                                  if (vouter === 1){
                                      var vaccepted = doc.enquiries.accepted;
                                      var vownclients = doc.ownclients;
                                      vownclients++;
                                      vcapacity--;
                                      vaccepted++;
                                      hostel.update({hostelid:x},{$set:{vofferid:{capacity:vcapacity},ownclients:vownclients,enquires:{accepted:vaccepted}}});
                                      orders.update({enqid:venqid},{$set:{confirmed:1}});
                                       }
                                  else {

                                      var vaccepted = doc.enquiries.accepted;
                                      vcapacity--;
                                      vaccepted++;
                                      hostel.update({hostelid:x},{$set:{vofferid:{capacity:vcapacity},enquires:{accepted:vaccepted}}});
                                      orders.update({enqid:venqid},{$set:{confirmed:1}});
                                      users.find({userid:vuserid},function(err,someuser){
                                        if (err)
                                        {
                                          //DO SOMETHING
                                        }
                                        else
                                        {
                                          if(someuser.length != 0)
                                          {
                                            var vuaccepted = someuser.enquiries.accepted;
                                            vuaccepted++;
                                            users.update({userid:vuserid},{$set:{enquiries:{accepted:vuaccepted}}});
                                          }
                                          else
                                          {
                                            //DO SOMETHING
                                          }
                                        }
                                      });
                                    }
                                  }
                          else {
                            // HAPPENS WHEN TWO PEOPLE ORDER AND ONE IS MORE LUCKY THAN THE OTHER
                            res.send("OFFER IS NOT AVALIABLE")
                          }
                        } 
                      else{
                        //DO SMTH
                      }
                    }
                  });
                 
             }//if result.length !=0
          else 
              {
               //WHAT?
              }
         }
    });
   break
   case "dismiss":
    //used to dismiss a request for a room came through our system
     var venqid = req.body.enqid;
    orders.update({enqid:venqid},{$set:{accepted:2}});
   break
   default:
   //ADD SOME TYPE OF ERROR HERE
   break
  }
});



app.post('/upload',function(req,res) {
	console.log('UPLOAD SEQUENCE');
 
//AUTH NEEDED HERE/ Something simple like hardcoded passphrase, can be passed through req.body

if (req.body.nameru === undefined||
  req.body.nameen === undefined||
  req.body.coord === undefined||
  req.body.ctype === undefined||
  req.body.postn === undefined||
   req.body.telephone === undefined||
  req.body.www === undefined||
  req.body.ppredir === undefined||
  req.files.mainpreview.name === undefined||
  req.body.fid === undefined ||
  req.body.oid === undefined ||
  req.body.mid  === undefined ||
  req.body.city  === undefined||
  req.body.country === undefined||
  req.body.yearnow  === undefined||
  req.body.adressru === undefined||
  req.body.adressen === undefined||
    req.files.xml.name === undefined||
  req.body.placename  === undefined||
  req.body.xmlqntt === undefined||
  req.body.imgqntt === undefined)
  //ctype is for how close it is to the citycenter
 //wi-fi and parking should be added
  {res.send('Something wrong with your data, try again');}

     else{

         var checkdir = __dirname +"/public/images/places/"
         fs.ensureDir(checkdir, function(err) {
         if (err === null){
         console.log(checkdir+'exists');}
         });
         var photonum = req.body.imgqntt;
         var vplacename = req.body.placename;
         for (i=0;i<photonum;i++) {
           eval('var vimg_'+i+';');
           console.log(i+' VARIABLE CREATED');
         }
         
         var vmainpreviewimg;
         var vxmlfile;
         
                   
                  function upload(filepath,imageid,fieldid){
              	var oldPath = filepath;
              	console.log('UPLOAD 1 step, oldPath:'+ oldPath);
              var newPath = __dirname +"/public/images/places/" +vplacename+"/"+ imageid;
                  console.log('UPLOAD 2 step, newPath:' + newPath );
              fs.readFile(oldPath , function(err, data) {
                  fs.writeFile(newPath, data, function(err) {
                      fs.unlink(oldPath, function(){
                          if(err) throw err;
                          res.send('UPLOAD '+imageid+"file uploaded to: " + newPath);
                          fieldid = newPath;  });
                  }); 
              }); 
              };
           
                function imgcheck (n) {
                  var mistakes = 0;
                  console.log('into IMAGECHECK');
                  for (i=0;i<n;i++) {
                    eval('if (req.files.images['+i+'].name == null) {mistakes++}');
                    console.log('checked req.files.images['+i+'] , mistakes :'+mistakes);
                  }
                  if (mistakes>0) {return false;}
                   else {return true;}
              }
          console.log('GOING TO CHECK IMAGES')
         if ( imgcheck(photonum) === true )
         
             {
             console.log('FILES:OK');


             
             function uploadloop(n) {
               console.log('UPLOADLOOP START,'+n+' images will be processed');
                for(i=0;i<n;i++) {
                 eval("upload(req.files.images["+i+"].path,req.files.images["+i+"].name,vimg_"+i+");");
                }
                console.log('UPLOADLOOP EXIT');
             }
             function uploadloopxml(n) {
               console.log('XMLUPLOADLOOP START,'+n+' files will be processed');
                for(i=0;i<n;i++) {
                 eval("upload(req.files.images["+i+"].path,req.files.images["+i+"].name,vimg_"+i+");");
                }
                console.log('UPLOADLOOP EXIT');
             }
              
              var newplace = __dirname +"/public/images/places/" +vplacename;
             fs.mkdirs(newplace , function(err){
                      if (err) {return console.error(err);}
                       console.log('NEW FOLDER CREATED , MOVING FILES');
                       uploadloop(photonum);
                       upload(req.files.mainpreview.path,req.files.mainpreview.name,vmainpreviewimg);
                       upload(req.files.xml.path,req.files.xml.name,vxmlfile);
                       });
         
         
           if (req.body.wifi != undefined)
             {var vwifi = 1;}
           else 
            {var vwifi = 0;}
           if (req.body.parking != undefined)
            {var vparking = 1;}
           else 
            {var vparking = 0;}

         
         	var vnameru = req.body.nameru,
         	vnameen = req.body.nameen,
         	vtelephone = req.body.telephone,
         	vwww = req.body.www,
          vcoord = req.body.coord,
         	vppredir = req.body.ppredir,
         	vmainpreview = "/images/places/"+req.body.placename+"/"+ req.files.mainpreview.name,
         	vfid = req.body.fid ,
           foid = req.body.oid ,
           vmid = req.body.mid ,
         	vcity = req.body.city,
         	vcountry = req.body.country,
         	vyearnow = req.body.yearnow,
           vadressru = req.body.adressru,
           vadressen = req.body.adressen,
           vxmlqntt = req.body.xmlqntt,
           vxml = "/images/places/"+req.body.placename+"/" + req.files.xml.name;
         
            console.log(vplacename);
            console.log(vxml);

             
         
           
         	// CTYPE MUST BE ADDED - TELLS DISTANCE FROM THE CENTER
         
         	hostels.insert({placename : vplacename,
         nameru : vnameru,
         nameen : vnameen,
         aderssru: vadressru,
         adressen: vadressen,
         coord: vcoord,
         parking:vparking,
         wifi:vwifi,
         telephone : vtelephone,
         www : vwww,
         ppredir : vppredir,
         mainpreview : vmainpreview,
         fid : vfid,
         mid : vmid,
         oid : foid,
         city : vcity,
         country : vcountry,
         yearnow : vyearnow,
         xml : vxml,
         imgqntt : photonum,
         xmlqntt : vxmlqntt,
         offrqntt : 0,
         enquiries : {all:0,accepted:0},
         ownclients : 0,

         });
         
         	
         	
         
               var docs;
             hostelss.find({placename:vplacename},function(err,docs){
                 console.log('wrote to the places collection:' + docs);
                 });
           
         
            // news.find({placename:vplacename},function(err,docs){
            //     console.log('wrote to the news collection:' + docs);
            //     });
            
         
         	
         	console.log('UPLOAD DONE! REDIRECTING TO PP')
         	res.redirect(vppredir);}
         
         	else { 
         
         		console.log('SHITTY FILES, UPLOAD ABORTED');
         		res.redirect('/');
         };
     }
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
app.listen(80,'188.226.132.200');