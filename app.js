var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , hostels = db.get('hostels'),orders = db.get('orders');
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

app.get('/hostel', function(req,res) {
  console.log('JESUS !!!');
  res.render('hostel');
});


 app.get('/index',function(req,res){
   var incomming = req.headers.host;

  if (incomming === 'topandviews.ru') {
    console.log(' serving RU');
    res.render('index');
  } 
  
  if (incomming === 'topandviews.co.uk') {
    console.log(' serving CO.UK');
    res.render('index');
  }

  if (incomming === 'topandviews.com') {
    console.log(' serving COM');
    res.render('index');
     }
});

  
//subdomain magic 
app.get('*', function(req,res,next) { 
  var d = new Date();
  if(req.headers.host === 'm.topandviews.com')  //if it's a sub-domain
   {console.log(d+' got a mobile version request on .com from '+req.ip);
    req.url = '/m' + req.url; 
    console.log(req.url); //append some text yourself
  next();} 
 

  if(req.headers.host === 'm.topandviews.co.uk')  //if it's a sub-domain
    {console.log(d+' got a mobile version request on co.uk from '+req.ip);
    req.url = '/m' + req.url;  //append some text yourself
    console.log(req.url);
    next();} 
     
  
  if(req.headers.host === 'm.topandviews.ru')  //if it's a sub-domain
    {console.log(d+' got a mobile version request on .ru from  '+req.ip);
    req.url = '/m' + req.url ;  //append some text yourself
    console.log(req.url);
    next();}
    
    else {next();}

}); 



app.get('/',function(req,res) {
  
  console.log('entered "/" route');
  console.log('User-Agent: ' + req.headers['user-agent']);
  var userAgent=req.headers['user-agent']
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

app.get('/full',function(req,res) {
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

app.get('/test',function(req,res) {
  res.render('sr')
});

//done with subdomains

//full version starts here, mobile will be below

app.get('/ququ',function(req,res){
  console.log('request for ququ');
  res.render('orderstest');
});

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
        res.render('adminhostels',{'docs' : docs});
      });
    break
    case('users'):
      users.find({},function(err,docs){
        res.render('adminusers',{'docs' : docs});
      });
    break
    default:
    //ERROR HERE OR SOMETHING
    break
  }

});

//app.get('/admin', function(req,res) {
//  res.render('adminauth',{'message' : null});
//});

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

// mobile version start here

app.get('/m/',function(req,res){
  console.log('got to /m/ section, render depending on req.headers.host');
  if (req.headers.host === 'm.topandviews.ru') {res.render('mindex')}
  if (req.headers.host === 'm.topandviews.com') {res.render('mindex')}
  if (req.headers.host === 'm.topandviews.co.uk') {res.render('mindex')}  
});

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

app.get('/m/:lang', function(req,res){
  console.log('got into /m/:lang route')
   var lang = req.params.lang;
   if (lang === 'ru'){res.render('mindexru');} 
   if (lang === 'en'){res.render('mindex');} 
   if (lang === 'de'){res.render('mindexde');} 
   if (lang === 'fr'){res.render('blank');} 
   if (lang === 'es'){res.render('blank');} 
   if (lang === 'it'){res.render('blank');} 
});

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



app.get('/:lang',function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('index')}
  if (lang === 'ru') {res.render('indexru')}
  if (lang === 'fr') {res.render('indexfr')}
  if (lang === 'de') {res.render('indexde')}
  if (lang === 'es') {res.render('indexes')}
  if (lang === 'it') {res.render('indexit')} 
});

app.get('/:lang/contact', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('contact')}
  if (lang === 'ru') {res.render('contactru')}
  if (lang === 'fr') {res.render('contactfr')}
  if (lang === 'de') {res.render('contactde')}
  if (lang === 'es') {res.render('contactes')}
  if (lang === 'it') {res.render('contactit')} 
});

app.get('/search', function(req,res){
  var vhname = req.params.hname;
  var vmixgenders = req.params.mixgenders;
  var vtrndist = req.params.trndist;
  var vwifi = req.params.wifi;
  var vppr = req.params.ppr;
  var vprice = req.params.price
  
  hostels.find({price:vprice,hname:vhname,mixgenders:vmixgenders,trndist:vtrndist,wifi:vwifi,ppr:vppr},function(err,hostels){
    if (hostels.length != 0)
      {res.render("sr",{"hostels":hostels});}
  });
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


app.post('/adminsr/updatepage', function(req,res) {
	var placenametest = req.body.placename;

	places.findOne({hname: placenametest}, function(err,singleplace){
       var placedata = JSON.stringify(singleplace,null,2);
        var nameeng = singleplace.nameen;
        var updateplacename = singleplace.placename;
		res.render('update', {'jsondata' : placedata,'nameeng':nameeng, 'placename': updateplacename});
	});
	
});

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



app.get('/piu',function(req,res){
  console.log('request for piu');
  res.send('piu piu');
});

var testcount=1;
app.post('/orders/:hostel/:price',function(req,res){
  //ORDERCOUNT must go here, this is begining of getting statistic together. Orders taken, objects added, visitors etc.
  vdates=req.body.dates;
  vphonep = req.body.phonep;
  vmail = req.body.mail;
  vphone = req.body.phone;
  vregistered = req.body.registered;
  vhostelid = req.params.hostel;
  vofferid= req.params.price;
  year = req.params.fyear;
  vmonth = req.params.fmonth;
  vday = req.params.fday;
  year = req.params.toyear;
  vmonth = req.params.tomonth;
  vday = req.params.today;
   if (vofferid === 'test')
   { vdates=[12102014,20102014];
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
    orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday});
    testcount++;

   }
   else {
  orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday});
   }
});

app.post('/enquery/:hostel/:price', function(req,res){
  //all the hostelclient magic happens here
  x = req.params.hostel;
  y = req.params.price;
  z = req.param('coco');
  //console.log(z);
  //res.send(' HOSTEL IS: '+x+'\n'+'PRICE IS: '+y+'\n'+'BODY IS: '+z)
  switch ( z ) {
   case "enquires":
  
  orders.find({hostel:x,price:y},function(err,results){

  });
   break
   case "calendar":
     month = req.param('month');
   break
   case "remove":
   break
   case"add":
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
         
         
           
         
         	var vnameru = req.body.nameru,
         	vnameen = req.body.nameen,
         	vtelephone = req.body.telephone,
         	vwww = req.body.www,
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
           vxml = "/images/places/"+req.body.placename+"/" + req.files.xml.name;
         
            console.log(vplacename);
            console.log(vxml);

             
         
           
         	
         
         	hostels.insert({placename : vplacename,
         nameru : vnameru,
         nameen : vnameen,
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
         images : photonum,
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