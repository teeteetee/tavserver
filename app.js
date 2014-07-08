var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , places = db.get('places'),property = db.get('property'),chat = db.get('chat');
var fs = require('fs-extra');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon('/images/tavlogobw.png'));
app.use(logger('dev'));
app.use(require('connect').bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.get('*',function(req,res,next) {
//  console.log(req.url , req.headers.host );
//  next();
//})

//AS TEMPORARY
app.get('/chat',function(req,res){
 console.log('into chat');
 checkid()

  
  function checkid() {
    var vuserid = Math.random().toString().slice(2,9);
    console.log('request form chat,created id: '+vuserid+' checking if already exists...');
    chat.findOne({id: vuserid},function(err,doc){
      if(doc===null)
      {
        console.log('(1)Creating user');
        res.render('chat',{'adress': vuserid});
        chat.insert({id : vuserid,message : 'welcome',mcount : 1},function(err,doc){
          console.log(doc);
        });
        
      }
      else {
        var newnum = vuserid*2.5;
        console.log('(2)Creating user');
        res.render('chat',{'adress': newnum});
        chat.insert({id : newnum,message : 'welcome',mcount : 1},function(err,doc){
          console.log(doc);
        });
        
      }
    });
  }
  
});

app.get('/chat/check/:oppid',function(req,res){
  var oppid = req.params.oppid;
  console.log('chat check '+oppid);
  chat.findOne({id:oppid},function(err,doc){
    res.send(doc);
  });
});

app.post('/chat',function(req,res){
  console.log(req.body);
  var userid = req.body.id;
  var usermessage = req.body.message;
  var oppadd = req.body.oppid;
  var vmcount = req.body.mcount;
  console.log(userid+' says: '+usermessage+'to '+oppadd);
  chat.update({id : userid},{id : userid,message : usermessage,mcount : vmcount},function(err,doc){
    console.log('written to senders doc: '+doc)
  });
  chat.findOne({id : oppadd},function(err,doc){
    
    console.log('check for messages'+doc.message);
    res.send(doc.message,doc.mcount);
  });
});

app.get('/chat/drop',function(req,res){
  console.log('request for DROP');
  chat.drop();
  res.send('chat db dropped')
});

app.get('/chat/all',function(req,res){
  chat.find({},function(err,doc){
    res.send(doc);
  });
});
//END OF AS TEMPORARY



 

 app.get('/index',function(req,res){
   var incomming = req.headers.host;

  if (incomming === 'topandviews.ru') {
    console.log(' serving RU');
    res.render('indexru');
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

 app.get('/:lang/*',function (req,res,next){

  var checklang = req.params.lang;
  console.log('LANGUAGE CHECK:got request with '+checklang);
  if (checklang === 'ru' || checklang === 'en' || checklang === 'es' || checklang === 'fr' || checklang === 'de' || checklang === 'it' || checklang === 'places' )
    {next();}
  else {res.render('my404')}
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
  var d = new Date();
  if(req.headers.host === 'topandviews.ru') 
    {console.log(d+' request on .ru from '+req.ip);
     res.render('landingru');}
  if(req.headers.host === 'topandviews.com') 
    {console.log(d+' request on .com from '+req.ip);
     res.render('landing');}
  if(req.headers.host === 'topandviews.co.uk') 
    {console.log(d+' request on .co.uk from '+req.ip);
     res.render('landinguk');}
});



//done with subdomains

//full version starts here, mobile will be below

//app.get('/', function(req,res) {
//  console.log('got into / , choice by req.headers.host');
//        var incomming = req.headers.host;
//  if (incomming = 'topandviews.ru') {
//    res.render('indexru');
//  } 
//  if (incomming = 'topandviews.co.uk') {
//    res.render('index');
//  }
//  if (incomming = 'topandviews.com') {
//    res.render('index');
//  }
//        
//});

app.get('/:lang/places/:place', function(req,res){
  var plang = req.params.lang;
  var pp;
  var pptop;
   if (plang === 'ru'){var pp = 'ppru';var pptop = 'pptopru';} 
   if (plang === 'en'){var pp = 'pp';var pptop = 'pptop';} 
   if (plang === 'de'){var pp = 'ppde';var pptop = 'pptopde';} 
   if (plang === 'fr'){var pp = 'ppfr';var pptop = 'pptopfr';} 
   if (plang === 'es'){var pp = 'ppes';var pptop = 'pptopes';} 
   if (plang === 'it'){var pp = 'ppit';var pptop = 'pptopit';} 

  var reqplace = req.params.place;
  console.log('into PLACES, going to search for '+reqplace);
  places.findOne({placename : reqplace},function(err,placedoc){

    if (placedoc !== null)
                            {

    var top = placedoc.topbool;
    var vplacename  = placedoc.placename;
    var propername = placedoc.nameen;
    var vxml = placedoc.xml;
    var vtelephone = placedoc.telephone;
    var vweb = placedoc.www;
    var vshisha = placedoc.shisha;
    var vcigars = placedoc.cigars;
    var vworkinghours = placedoc.workinghours;
    var vyearfounded = placedoc.yearfounded;
    var vcity = placedoc.city;

    if (vshisha === 'on')
                       {
                        vshisha = 'Yes';
                       }
      else 
          {
           vshisha = 'No'
          }
    if (vcigars === 'on') 
                       {
                        vcigars = 'Yes';
                       }
      else 
          {
            vcigars = 'No';
          }                  

    if (top === 'on') 
                        {
                          res.render(pptop,{'placename': propername , 'xml' : vxml , 'telephone' : vtelephone , 'web' : vweb , 'cigars' : vcigars , 'shisha' : vshisha , 'yearfounded' : vyearfounded , 'city' : vcity ,'workinghours' : vworkinghours});
                        }
       else 
           {
            res.render(pp, {'placename': propername ,'workinghours' : vworkinghours, 'xml' : vxml , 'telephone' : vtelephone , 'web' : vweb , 'cigars' : vcigars , 'shisha' : vshisha , 'yearfounded' : vyearfounded , 'city' : vcity });
           }   
           }
       else 
           {
            res.render('my404');
           }                  
  });
});

//mobile version starts here

app.get('/admin', function(req,res) {
  res.render('adminauth',{'message' : null});
});

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

app.get('/upload', function(req,res) {
      console.log('got request on /upload');
      res.render('uploadauth');
      });

app.post('/uploadauth', function(req,res){
  var masterlogin = 'tooleetoo676';
  var masterpassword = 'cloderstam555';
  var login = req.body.login;
  var pass = req.body.password;

  if (masterlogin !== login || masterpassword !== pass ) 
                                                        {
                                                          res.render('uploadauth');
                                                        }
  else 
      {
        res.render('upload');
      }                                                      

});  



app.get('/m/',function(req,res){
  console.log('got to /m/ section, render depending on req.headers.host');
  if (req.headers.host === 'm.topandviews.ru') {res.render('mindexru')}
  if (req.headers.host === 'm.topandviews.com') {res.render('mindex')}
  if (req.headers.host === 'm.topandviews.co.uk') {res.render('mindex')}  
});

app.get('/m/:lang/*',function (req,res,next){
  var checklang = req.params.lang;
  if (checklang === 'ru' ||checklang ===  'en' ||checklang ===  'es' ||checklang ===  'fr' ||checklang ===  'de' ||checklang ===  'it')
    {next()}
  else {res.render('my404')}
});


app.get('/m/:lang/geo', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru'){res.render('mgeoru');} 
   if (lang === 'en'){res.render('mgeo');} 
   if (lang === 'de'){res.render('mgeode');} 
   if (lang === 'fr'){res.render('mgeofr');} 
   if (lang === 'es'){res.render('mgeoes');} 
   if (lang === 'it'){res.render('mgeoit');} 
});

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

app.get('/m/:lang/geo/:city', function(req,res){
    var lang = req.params.lang;
    var vreqcity = req.params.city;
    if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
    if (vreqcity === 'newyork') {vreqcity = 'New York'};
    if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
    var absolute = [];
    var rooftop = [];
    var terrace = [];
    var cuisine = [];
    tops.find({city : vreqcity,toptype : 1}, function(err,firsttypedocs){
       console.log('got data for absolute');
         absolute = firsttypedocs;
         tops.find({city : vreqcity,toptype : 2}, function(err,secondtypedocs){
            console.log('got data for rooftop');
              rooftop = secondtypedocs;
              tops.find({city : vreqcity,toptype : 3}, function(err,thirdtypedocs){
                   terrace = thirdtypedocs;
                   tops.find({city : vreqcity,toptype : 4},function(err,fourthtypedocs){
                        cuisine = fourthtypedocs;
                     
                         res.render('mgeoindex', { 'city' : vreqcity , 'first' : absolute , 'second' : rooftop , 'third' : terrace , 'fourth' : cuisine });   
                   });
              });
         });

    });

  

});

app.get('/m/:lang/languages',function (req,res){
   res.render('mlanguages');
});

app.get('/m/:lang/places',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mplacesru');} 
   if (lang === 'en'){res.render('mplaces');} 
   if (lang === 'de'){res.render('mplacesde');} 
   if (lang === 'fr'){res.render('mplacesfr');} 
   if (lang === 'es'){res.render('mplaceses');} 
   if (lang === 'it'){res.render('mplacesit');} 
});

app.get('/m/:lang/property',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mpropertyru');} 
   if (lang === 'en'){res.render('mproperty');} 
   if (lang === 'de'){res.render('mpropertyde');} 
   if (lang === 'fr'){res.render('mpropertyfr');} 
   if (lang === 'es'){res.render('mpropertyes');} 
   if (lang === 'it'){res.render('mpropertyit');} 
});

app.get('/m/:lang/yachtsjets',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('myachtsjetsru');} 
   if (lang === 'en'){res.render('myachtsjets');} 
   if (lang === 'de'){res.render('myachtsjetsde');} 
   if (lang === 'fr'){res.render('myachtsjetsfr');} 
   if (lang === 'es'){res.render('myachtsjetses');} 
   if (lang === 'it'){res.render('myachtsjetsit');} 
});

app.get('/m/:lang/campuses',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mcampusesru');} 
   if (lang === 'en'){res.render('mcampuses');} 
   if (lang === 'de'){res.render('mcampusesde');} 
   if (lang === 'fr'){res.render('mcampusesfr');} 
   if (lang === 'es'){res.render('mcampuseses');} 
   if (lang === 'it'){res.render('mcampusesit');} 
});






//mobile version's end


app.get('/:lang/geo', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('geo')}
  if (lang === 'ru') {res.render('georu')}
  if (lang === 'fr') {res.render('geofr')}
  if (lang === 'de') {res.render('geode')}
  if (lang === 'es') {res.render('geoes')}
  if (lang === 'it') {res.render('geoit')} 
});


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


app.get('/:lang/job', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('job')}
  if (lang === 'ru') {res.render('jobru')}
  if (lang === 'fr') {res.render('jobfr')}
  if (lang === 'de') {res.render('jobde')}
  if (lang === 'es') {res.render('jobes')}
  if (lang === 'it') {res.render('jobit')} 
});



app.get('/:lang/partners', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('partners')}
  if (lang === 'ru') {res.render('partnersru')}
  if (lang === 'fr') {res.render('partnersfr')}
  if (lang === 'de') {res.render('partnersde')}
  if (lang === 'es') {res.render('partnerses')}
  if (lang === 'it') {res.render('partnersit')} 
});



app.get('/:lang/campuses', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('soon')}
  if (lang === 'ru') {res.render('soon')}
  if (lang === 'fr') {res.render('soon')}
  if (lang === 'de') {res.render('soon')}
  if (lang === 'es') {res.render('soon')}
  if (lang === 'it') {res.render('soon')} 
});


app.get('/:lang/property', function(req,res){
  var prlang = req.params.lang;
  if (prlang === 'en') {res.render('buystaysell',{lang : prlang})}
  if (prlang === 'ru') {res.render('buystaysellru',{lang : prlang})}
  if (prlang === 'fr') {res.render('buystaysellfr')}
  if (prlang === 'de') {res.render('buystaysellde',{lang : prlang})}
  if (prlang === 'es') {res.render('buystayselles')}
  if (prlang === 'it') {res.render('buystaysellit')} 
});

app.get('/:lang/property/buy', function(req,res){
  var blang = req.params.lang;
  if (blang === 'en') {res.render('buy')}
  if (blang === 'ru') {res.render('buyru',{lang : blang})}
  if (blang === 'fr') {res.render('buyfr')}
  if (blang === 'de') {res.render('buyde',{lang : blang})}
  if (blang === 'es') {res.render('buyes')}
  if (blang === 'it') {res.render('buyit')} 
});


app.get('/:lang/property/stay', function(req,res){
  var slang = req.params.lang;
  if (slang === 'en') {res.render('stay')}
  if (slang === 'ru') {res.render('stayru',{lang : slang})}
  if (slang === 'fr') {res.render('stayfr')}
  if (slang === 'de') {res.render('stayde')}
  if (slang === 'es') {res.render('stayes')}
  if (slang === 'it') {res.render('stayit')} 
});


app.get('/:lang/property/sell', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('sell')}
  if (lang === 'ru') {res.render('sellru')}
  if (lang === 'fr') {res.render('sellfr')}
  if (lang === 'de') {res.render('sellde')}
  if (lang === 'es') {res.render('selles')}
  if (lang === 'it') {res.render('sellit')} 
});


app.get('/:lang/places', function(req,res){
  var plang = req.params.lang;
  if (plang === 'en') {res.render('places', {lang : plang})}
  if (plang === 'ru') {res.render('placesru',{lang : plang})}
  if (plang === 'fr') {res.render('placesfr')}
  if (plang === 'de') {res.render('placesde',{lang : plang})}
  if (plang === 'es') {res.render('placeses')}
  if (plang === 'it') {res.render('placesit')} 
});


app.get('/:lang/yachtsjets', function(req,res){
  var ylang = req.params.lang;
  if (ylang === 'en') {res.render('yachtsjets')}
  if (ylang === 'ru') {res.render('yachtsjetsru',{lang : ylang})}
  if (ylang === 'fr') {res.render('yachtsjetsfr')}
  if (ylang === 'de') {res.render('yachtsjetsde')}
  if (ylang === 'es') {res.render('yachtsjetses')}
  if (ylang === 'it') {res.render('yachtsjetsit')} 
});


app.get('/:lang/yachts', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('soon')}
  if (lang === 'ru') {res.render('soon')}
  if (lang === 'fr') {res.render('soon')}
  if (lang === 'de') {res.render('soon')}
  if (lang === 'es') {res.render('soon')}
  if (lang === 'it') {res.render('soon')} 
});


app.get('/:lang/jets', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('soon')}
  if (lang === 'ru') {res.render('soon')}
  if (lang === 'fr') {res.render('soon')}
  if (lang === 'de') {res.render('soon')}
  if (lang === 'es') {res.render('soon')}
  if (lang === 'it') {res.render('soon')} 
});


app.get('/:lang/job/photographer', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('photographer')}
  if (lang === 'ru') {res.render('photographerru')}
  if (lang === 'fr') {res.render('photographerfr')}
  if (lang === 'de') {res.render('photographerde')}
  if (lang === 'es') {res.render('photographeres')}
  if (lang === 'it') {res.render('photographerit')} 
});


app.get('/:lang/job/office', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('office')}
  if (lang === 'ru') {res.render('officeru')}
  if (lang === 'fr') {res.render('officefr')}
  if (lang === 'de') {res.render('officede')}
  if (lang === 'es') {res.render('officees')}
  if (lang === 'it') {res.render('officeit')} 
});


app.get('/:lang/job/it', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('it')}
  if (lang === 'ru') {res.render('itru')}
  if (lang === 'fr') {res.render('itfr')}
  if (lang === 'de') {res.render('itde')}
  if (lang === 'es') {res.render('ites')}
  if (lang === 'it') {res.render('itit')} 
});

//app.get('/geo/:city/places',function(req,res){
//  var geocity = req.params.city;
//  res.render('geoplaces',{'city': geocity});
//});

app.get('/:lang/geo/:city/places', function(req,res){
  var vlang = req.params.lang;
  var vcity = req.params.city;
  if (vlang === 'en') {res.render('geoplaces',{'lang' : vlang,'city' : vcity})}
  if (vlang === 'ru') {res.render('geoplacesru',{'lang' : vlang,'city' : vcity})}
  if (vlang === 'fr') {res.render('geoplacesfr')}
  if (vlang === 'de') {res.render('geoplacesde')}
  if (vlang === 'es') {res.render('geoplaceses')}
  if (vlang === 'it') {res.render('geoplacesit')} 
});

//app.get('geo/:city/property',function(req,res){
//  var geocity = req.params.city;
//  res.render('geoproperty',{'city': geocity});
//});

app.get('/:lang/geo/:city/property', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('geoproperty')}
  if (lang === 'ru') {res.render('geopropertyru')}
  if (lang === 'fr') {res.render('geopropertyfr')}
  if (lang === 'de') {res.render('geopropertyde')}
  if (lang === 'es') {res.render('geopropertyes')}
  if (lang === 'it') {res.render('geopropertyit')} 
});



app.post('/:lang/places',function(req,res){
  var lang = req.params.lang,
   plcity = req.body.city,
   plname = req.body.searchbox,
   plfitness = req.body.fitness,
   plmealdrink = req.body.mealdrink,
   plcoworking = req.body.coworking,
   plbeauty = req.body.beauty,
   plrooftop = req.body.rooftop,
   plterrace = req.body.terrace,
   plcigars = req.body.cigars,
   plshisha = req.body.shaisha;
   
   console.log(plcity);

   if (plcity == undefined) {
     places.find({})
   }
});

app.get('/:lang/geo/:city', function(req,res){
    var vreqcity = req.params.city;
    var vcityen = req.params.city;
    var newscity = req.params.city;
    var vlang = req.params.lang;
    
    
    var absolute = [];
    var rooftop = [];
    var terrace = [];
    var cuisine = [];
    var newdoc = [];
    
    places.find({city : vreqcity,toptype : 1}, function(err,firsttypedocs){
       console.log('got data for absolute');
         absolute = firsttypedocs;
         places.find({city : vreqcity,toptype : 2}, function(err,secondtypedocs){
            console.log('got data for rooftop');
              rooftop = secondtypedocs;
              places.find({city : vreqcity,toptype : 3}, function(err,thirdtypedocs){
                   terrace = thirdtypedocs;
                   places.find({city : vreqcity,toptype : 4},function(err,fourthtypedocs){
                        cuisine = fourthtypedocs;
                     
                         places.find({city : vreqcity, glbtype : 'mealdrink'},{limit:5, sort :{_id:-1}},function(err,newdocs) {
                               newdoc = newdocs ; 
                               

                              if (vlang === 'en') {
                                if (vreqcity === 'newyork') {vreqcity = 'New York'};
                                if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
                                if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
                                res.render('geoindex', { city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'ru') {
                                console.log('got data from db, currently in RU ');
                                if (vreqcity === 'newyork') {vreqcity = 'Нью-Йорк'};
                                if (vreqcity === 'losangeles') {vreqcity = 'Лос-Анжелес'}
                                if (vreqcity === 'stpetersburg') {vreqcity = 'Санкт-Петербург'}
                                if (vreqcity === 'london') {vreqcity = 'Лондон'};
                                if (vreqcity === 'moscow') {vreqcity = 'Москва'};
                                console.log('translated city names,  render');
                                res.render('geoindexru', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'fr') {
                                res.render('geoindex', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'de') {
                                 console.log('got data from db, currently in DE ');
                                if (vreqcity === 'newyork') {vreqcity = 'New York'};
                                if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
                                if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
                                if (vreqcity === 'london') {vreqcity = 'London'};
                                if (vreqcity === 'moscow') {vreqcity = 'Moskau'};
                                console.log('translated city names,  render');
                                res.render('geoindexde', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'es') {
                                res.render('geoindex', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'it') {
                                res.render('geoindex', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              } 
                               
                         });
                         
                   });
              });
         });

    });

  

});

app.get('/:lang/geo/:city/new', function(req,res){
   var nlang = req.params.lang;
   var ncity = req.params.city;
   var nnmbr = 0 ;
   places.find({city : ncity}, {limit : 0 ,sort: {yearnow: -1}},function(err,newdoc) {
       //, {limit : 0 ,sort: {yearnow: -1}}
       function cnt (value,index,array) {
        nnmbr++
       } 
       newdoc.forEach(cnt);
       console.log(nnmbr,newdoc);

  if (nlang === 'en') {res.render('new',{city : ncity,news : newdoc,pnumber : nnmbr})}
  if (nlang === 'ru') {res.render('newru',{city : ncity,news : newdoc,pnumber : nnmbr})}
  if (nlang === 'fr') {res.render('newfr')}
  if (nlang === 'de') {res.render('newde',{city : ncity,news : newdoc,pnumber : nnmbr})}
  if (nlang === 'es') {res.render('newes')}
  if (nlang === 'it') {res.render('newit')} 

   });
});

app.post('/property/buy', function(req,res){
  var vflat = req.body.flat;
  var vpenthouse = req.body.penthouse;
  var vapartment = req.body.apartment;
  var vhouse = req.body.house;
  var voffice = req.body.office;
  var vscaleone = req.body.scaleone;
  var vscaletwo = req.body.scaletwo;
  var vscalethree = req.body.scalethree;
  var vmscaleone = req.body.mscaleone;
  var vmscaletwo = req.body.mscaletwo;
  var vmscalethree = req.body.mscalethree;

  //property.find({ptype: })
});

app.post('/admin',function(req,res) {
  var log = req.body.login;
  var pass = req.body.password;
  var adminlogin = 'kookoojoo999';
  var adminpass = 'lomotom787';
  var message = 'Wrong log/pass.';
  console.log(log,pass);
  if (log !== adminlogin || pass !== adminpass) 
                                               {
                                                console.log('somebody trying to access admin directory');
                                                res.render('adminauth',{'message' : message });
                                               }
  else
       {
        console.log('admin directory entered')
        res.render('adminsearch');
       }
});



//app.post('/advancedsearch',function(req,res){
//  var rooftop = ' rooftop : '+req.body.rooftop;
//  var terrace = ' terrace : '+req.body.terrace;
//  var shisha = ' shisha : '+req.body.shisha;
//  var cigars = ' cigars : '+req.body.cigars;
//  var city = 'city : '+req.body.city;
//
//  var query = new Array(); 
// if (req.body.rooftop !== undefined) 
//                                    {
//                                      rooftop ='rooftop : true';
//                                      query.push(rooftop);
//                                    };
// if (req.body.terrace !== undefined) 
//                                    {
//                                      terrace = 'terrace : true';
//                                      query.push(terrace)
//                                    };
// if (req.body.shisha !== undefined) 
//                                    {
//                                      shisha = 'shisha : true';
//                                      query.push(shisha)
//                                    };
// if (req.body.cigars !== undefined) 
//                                    {
//                                      cigars = 'cigars : true';
//                                      query.push(cigars)
//                                    };
//
// var result = query;
// console.log(JSON.stringify(result));
// res.send(result);
//});
 

app.post('/adminsearch', function(req,res){
	var adminquery = req.body.adminsearch;

	if (adminquery !== 'all') 
	   {
	   console.log(adminquery);
	   places.find({placename:adminquery}, function(err,admindocs) {
 		  res.render('adminsr',{"sr": admindocs});
	    });
	   }

	else 
	     {
		   places.find({}, function(err,admindocs) {

			  console.log('admin wnats to see all docs');
			  if (admindocs.length !== 0) 
			     {
			     	
 		           res.render('adminsr',{"sr": admindocs});
 	             }

 		     else 
 		          {
 		     	   console.log('db empty');
 		     	   res.send('empty db , man !');
 		          }
 		    });
         }
});
	

app.post('/adminsr/remove', function(req,res) {
	var vplacename = req.body.placename;
	console.log('going to deal with the files first');

  var dirdel = __dirname +"/public/images/places/" +vplacename;
         fs.ensureDir(dirdel, function(err) {
               console.log(err); //null
  //dir has now been created, including the directory it is to be placed in
             });

       
     places.findOne({placename: vplacename}, function(err,deldoc) {
         console.log(deldoc);
       	if (deldoc.placename !== undefined) 
       	       {
                 var count = deldoc.image;
                 var vplacename = deldoc.placename;
                 var mainpreview = deldoc.mainpreview;
                 var xml = deldoc.xmlfile;
                  
                 var dirtoremove =  __dirname +"/public/images/places/" +vplacename;
                 fs.remove(dirtoremove,function(err){
                         if (err) {return console.log(err);}
                         console.log(vplacename+"FILES DELETED");
                         });

                  places.remove({placename: vplacename});
                  console.log(vplacename+' record removed from db');
       
              
                 res.send(vplacename+' has been deleted');
                  
                }
        else {res.send('db returned shit, try again');}

              
            });
        });



app.post('/adminsr/updatepage', function(req,res) {
	var placenametest = req.body.placename;

	places.findOne({placename: placenametest}, function(err,singleplace){
       var placedata = JSON.stringify(singleplace,null,2);
        var nameeng = singleplace.nameen;
        var updateplacename = singleplace.placename;
		res.render('update', {'jsondata' : placedata,'nameeng':nameeng, 'placename': updateplacename});
	});
	
});

app.post('/admin/update', function(req,res) {

 // var vplacename = req.body.placename ,
 // vnameru = req.body.nameru,
 // vnameen = req.body.nameen,
 // vtelephone = req.body.telephone,
 // vwww = req.body.www,
 // vppredir = req.body.ppredir,
 // vcigarsbool = req.body.cigars,
 // vshishabool = req.body.shisha,
 // vworkinghours = req.body.workinghours,
 // vrooftopbool = req.body.rooftop,
 // vterracebool = req.body.terrace,
 // vfid = req.body.fid ,
 // foid = req.body.oid ,
 // vmid = req.body.mid ,
 // vtype = req.body.type,
 // vglbtype = req.body.glbtype,
 // vcity = req.body.city,
 // vcountry = req.body.country,
 // vyearnow = req.body.yearnow,
 // vyearfounded = req.body.yearfounded,
 // vtoptype= req.body.toptype,
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

app.post('/testupload', function(req,res){
    var firstfield = req.body.textupload;
    var secondfield = req.files.fileupload.name;
    if (secondfield != 0) {console.log(secondfield);}
    else {
    	console.log('its fucking empty , bro !');
         }
    vteset ="/public/images/places/" + req.files.fileupload.name;
    console.log(vteset);
});

//app.get('/geo', function(req,res){
//  res.render('geo');
//});


app.get('/geo/:city/places', function (req,res){
  if (req.params.city != 'moscow' || 'london' || 'newyork' || 'losangeles' || 'stpetersburg') { res.render('my404');}
  var geocity = req.params.city ;
  res.render('geoplaces',{'city': geocity});
});

app.get('/geo/:city/property', function (req,res){
  if (req.params.city != 'moscow' || 'london' || 'newyork' || 'losangeles' || 'stpetersburg') { res.render('my404');}
  var geocity = req.params.city ;
  res.render('geoproperty',{'city': geocity});
});

app.post('/search', function(req,res){

	var query = req.body.search;
	console.log('searching for '+query);
	var docs = [];
	places.find({placename:query}, function(err,docs){
       console.log(docs);
       res.render('searchresults', {'searchresults': docs});
       // placename:query});
    });
 });

app.get('/upload', function(req,res) {
	    console.log('got request on /upload');
	    res.render('uploadauth');
	    });

app.post('/uploadauth', function(req,res){
  var masterlogin = 'tooleetoo676';
  var masterpassword = 'cloderstam555';
  var login = req.body.login;
  var pass = req.body.password;

  if (masterlogin !== login || masterpassword !== pass ) 
                                                        {
                                                          res.render('uploadauth');
                                                        }
  else 
      {
        res.render('upload');
      }                                                      

});  

app.post('/upload',function(req,res) {
	console.log('UPLOAD SEQUENCE');
 


if (req.body.nameru === undefined||
  req.body.nameen === undefined||
   req.body.telephone === undefined||
  req.body.www === undefined||
  req.body.ppredir === undefined||
  req.files.mainpreview.name === undefined||
  req.body.workinghours === undefined||
  //vblankbool = req.body.blankbool,
  //vblanktextru = req.body.blanktextru,
  //vblanktexten = req.body.blanktexten,
  req.body.fid === undefined ||
  req.body.oid === undefined ||
  req.body.mid  === undefined ||
  req.body.type  === undefined||
  req.body.glbtype  === undefined||
  req.body.city  === undefined||
  req.body.country === undefined||
  req.body.yearnow  === undefined||
  req.body.yearfounded === undefined||
  req.body.toptype === undefined||
  req.body.adressru === undefined||
  req.body.adressen === undefined||
    req.files.xml.name === undefined||
  req.body.placename  === undefined||
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
         	vworkinghours = req.body.workinghours,
         	//vblankbool = req.body.blankbool,
         	//vblanktextru = req.body.blanktextru,
         	//vblanktexten = req.body.blanktexten,
         	vfid = req.body.fid ,
           foid = req.body.oid ,
           vmid = req.body.mid ,
         	vtype = req.body.type,
          vglbtype = req.body.glbtype,
         	vcity = req.body.city,
         	vcountry = req.body.country,
         	vyearnow = req.body.yearnow,
         	vyearfounded = req.body.yearfounded,
         	vtoptype= req.body.toptype,
           vadressru = req.body.adressru,
           vadressen = req.body.adressen,
           vcigars = true,
           vshisha = true,
           vterrace = true,
           vrooftop = true,
           vxml = "/images/places/"+req.body.placename+"/" + req.files.xml.name;
         
            console.log(vplacename);
            console.log(vxml);

             if(req.body.cigars === undefined) {vcigars = false}
             if(req.body.shisha === undefined) {vshisha = false}
             if(req.body.rooftop === undefined) {vrooftop = false}
             if(req.body.terrace === undefined) {vterrace = false}
         
           
         	
         
         	places.insert({placename : vplacename,
         nameru : vnameru,
         nameen : vnameen,
         telephone : vtelephone,
         www : vwww,
         ppredir : vppredir,
         mainpreview : vmainpreview,
         cigarsbool : vcigars,
         shishabool : vshisha,
         workinghours : vworkinghours,
         rooftopbool : vrooftop,
         terracebool : vterrace,
         fid : vfid,
         mid : vmid,
         oid : foid,
         toptype : vtoptype,
         city : vcity,
         country : vcountry,
         yearnow : vyearnow,
         type : vtype,
         glbtype : vglbtype,
         xml : vxml,
         yearfounded : vyearfounded,
         images : photonum,
         });
         
         	
         	
         
               var docs;
             places.find({placename:vplacename},function(err,docs){
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