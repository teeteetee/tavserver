var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , places = db.get('places'),property = db.get('property');
var fs = require('fs');

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
    req.url = '/m' + req.url + 'ru';  //append some text yourself
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
  if (checklang === 'ru' || checklang === 'en' || checklang === 'sp' || checklang === 'fr' || checklang === 'gr' || checklang === 'it' || checklang === 'm' )
    {next();}
  else {res.render('my404')}
});

app.get('/:lang/geo', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('geo')}
  if (lang === 'ru') {res.render('georu')}
  if (lang === 'fr') {res.render('geofr')}
  if (lang === 'gr') {res.render('geogr')}
  if (lang === 'sp') {res.render('geosp')}
  if (lang === 'it') {res.render('geoit')} 
});


app.get('/:lang',function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('index')}
  if (lang === 'ru') {res.render('indexru')}
  if (lang === 'fr') {res.render('indexfr')}
  if (lang === 'gr') {res.render('indexgr')}
  if (lang === 'sp') {res.render('indexsp')}
  if (lang === 'it') {res.render('indexit')} 
});

app.get('/:lang/contact', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('contact')}
  if (lang === 'ru') {res.render('contactru')}
  if (lang === 'fr') {res.render('contactfr')}
  if (lang === 'gr') {res.render('contactgr')}
  if (lang === 'sp') {res.render('contactsp')}
  if (lang === 'it') {res.render('contactit')} 
});


app.get('/:lang/job', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('job')}
  if (lang === 'ru') {res.render('jobru')}
  if (lang === 'fr') {res.render('jobfr')}
  if (lang === 'gr') {res.render('jobgr')}
  if (lang === 'sp') {res.render('jobsp')}
  if (lang === 'it') {res.render('jobit')} 
});



app.get('/:lang/partners', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('partners')}
  if (lang === 'ru') {res.render('partnersru')}
  if (lang === 'fr') {res.render('partnersfr')}
  if (lang === 'gr') {res.render('partnersgr')}
  if (lang === 'sp') {res.render('partnerssp')}
  if (lang === 'it') {res.render('partnersit')} 
});



app.get('/:lang/campuses', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('campuses')}
  if (lang === 'ru') {res.render('campusesru')}
  if (lang === 'fr') {res.render('campusesfr')}
  if (lang === 'gr') {res.render('campusesgr')}
  if (lang === 'sp') {res.render('campusessp')}
  if (lang === 'it') {res.render('campusesit')} 
});


app.get('/:lang/property', function(req,res){
  var prlang = req.params.lang;
  if (prlang === 'en') {res.render('buystaysell',{lang : prlang})}
  if (prlang === 'ru') {res.render('buystaysellru',{lang : prlang})}
  if (prlang === 'fr') {res.render('buystaysellfr')}
  if (prlang === 'gr') {res.render('buystaysellgr')}
  if (prlang === 'sp') {res.render('buystaysellsp')}
  if (prlang === 'it') {res.render('buystaysellit')} 
});

app.get('/:lang/property/buy', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('buy')}
  if (lang === 'ru') {res.render('buyru')}
  if (lang === 'fr') {res.render('buyfr')}
  if (lang === 'gr') {res.render('buygr')}
  if (lang === 'sp') {res.render('buysp')}
  if (lang === 'it') {res.render('buyit')} 
});


app.get('/:lang/property/stay', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('stay')}
  if (lang === 'ru') {res.render('stayru')}
  if (lang === 'fr') {res.render('stayfr')}
  if (lang === 'gr') {res.render('staygr')}
  if (lang === 'sp') {res.render('staysp')}
  if (lang === 'it') {res.render('stayit')} 
});


app.get('/:lang/property/sell', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('sell')}
  if (lang === 'ru') {res.render('sellru')}
  if (lang === 'fr') {res.render('sellfr')}
  if (lang === 'gr') {res.render('sellgr')}
  if (lang === 'sp') {res.render('sellsp')}
  if (lang === 'it') {res.render('sellit')} 
});


app.get('/:lang/places', function(req,res){
  var plang = req.params.lang;
  if (plang === 'en') {res.render('places', {lang : plang})}
  if (plang === 'ru') {res.render('placesru',{lang : plang})}
  if (plang === 'fr') {res.render('placesfr')}
  if (plang === 'gr') {res.render('placesgr')}
  if (plang === 'sp') {res.render('placessp')}
  if (plang === 'it') {res.render('placesit')} 
});


app.get('/:lang/yachtsjets', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('yachtsjets')}
  if (lang === 'ru') {res.render('yachtsjetsru')}
  if (lang === 'fr') {res.render('yachtsjetsfr')}
  if (lang === 'gr') {res.render('yachtsjetsgr')}
  if (lang === 'sp') {res.render('yachtsjetssp')}
  if (lang === 'it') {res.render('yachtsjetsit')} 
});


app.get('/:lang/yachts', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('yachts')}
  if (lang === 'ru') {res.render('yachtsru')}
  if (lang === 'fr') {res.render('yachtsfr')}
  if (lang === 'gr') {res.render('yachtsgr')}
  if (lang === 'sp') {res.render('yachtssp')}
  if (lang === 'it') {res.render('yachtsit')} 
});


app.get('/:lang/jets', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('jets')}
  if (lang === 'ru') {res.render('jetsru')}
  if (lang === 'fr') {res.render('jetsfr')}
  if (lang === 'gr') {res.render('jetsgr')}
  if (lang === 'sp') {res.render('jetssp')}
  if (lang === 'it') {res.render('jetsit')} 
});

app.get('/admin', function(req,res) {
	res.render('adminauth',{'message' : null});
});

app.get('/new/:city', function(req,res){
  var reqcity = req.params.city;
  res.send('news for '+reqcity+' supposed to be here');
});


app.get('/:lang/job/photographer', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('photographer')}
  if (lang === 'ru') {res.render('photographerru')}
  if (lang === 'fr') {res.render('photographerfr')}
  if (lang === 'gr') {res.render('photographergr')}
  if (lang === 'sp') {res.render('photographersp')}
  if (lang === 'it') {res.render('photographerit')} 
});


app.get('/:lang/job/office', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('office')}
  if (lang === 'ru') {res.render('officeru')}
  if (lang === 'fr') {res.render('officefr')}
  if (lang === 'gr') {res.render('officegr')}
  if (lang === 'sp') {res.render('officesp')}
  if (lang === 'it') {res.render('officeit')} 
});


app.get('/:lang/job/it', function(req,res){
  var lang = req.params.lang;
  if (lang === 'en') {res.render('it')}
  if (lang === 'ru') {res.render('itru')}
  if (lang === 'fr') {res.render('itfr')}
  if (lang === 'gr') {res.render('itgr')}
  if (lang === 'sp') {res.render('itsp')}
  if (lang === 'it') {res.render('itit')} 
});

//app.get('/geo/:city/places',function(req,res){
//  var geocity = req.params.city;
//  res.render('geoplaces',{'city': geocity});
//});

app.get('/:lang/geo/:city/places', function(req,res){
  var vlang = req.params.lang;
  if (vlang === 'en') {res.render('geoplaces',{lang : vlang})}
  if (vlang === 'ru') {res.render('geoplacesru',{lang : vlang})}
  if (vlang === 'fr') {res.render('geoplacesfr')}
  if (vlang === 'gr') {res.render('geoplacesgr')}
  if (vlang === 'sp') {res.render('geoplacessp')}
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
  if (lang === 'gr') {res.render('geopropertygr')}
  if (lang === 'sp') {res.render('geopropertysp')}
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
                     
                         places.find({city : vreqcity, type : 'mealdrink'},{limit:5, sort :{_id:-1}},function(err,newdocs) {
                               newdoc = newdocs ; 

                              if (vlang === 'en') {
                                if (vreqcity === 'newyork') {vreqcity = 'New York'};
                                if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
                                if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
                                res.render('geoindex', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
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
                              if (vlang === 'gr') {
                                res.render('geoindex', { lang : vlang , city : vreqcity , first : absolute , second : rooftop , third : terrace , fourth : cuisine, news :newdoc, cityen : vcityen })
                              }
                              if (vlang === 'sp') {
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

app.get('/places/:place', function(req,res){
  var reqplace = req.params.place;
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

    if (vshisha === on)
                       {
                        vshisha = 'Yes';
                       }
      else 
          {
           vshisha = 'No'
          }
    if (vcigars === on) 
                       {
                        vcigars = 'Yes';
                       }
      else 
          {
            vcigars = 'No';
          }                  

    if (top === on) 
                        {
                          res.render('pptop',{'placename': propername , 'xml' : vxml , 'telephone' : vtelephone , 'web' : vweb , 'cigars' : vcigars , 'shisha' : vshisha , 'yearfounded' : vyearfounded , 'city' : vcity });
                        }
       else 
           {
            res.render('pp', {'placename': propername , 'xml' : vxml , 'telephone' : vtelephone , 'web' : vweb , 'cigars' : vcigars , 'shisha' : vshisha , 'yearfounded' : vyearfounded , 'city' : vcity });
           }   
           }
       else 
           {
            res.render('my404');
           }                  
  });
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
	var placenametest = req.body.placename;
	console.log('going to deal with the files first');


	  function deleteimg (addr) {
	  	fs.unlink(addr, function (err) {
           if (err) throw err;
            console.log('successfully deleted addr');
           });
	  }
       
     places.findOne({placename: placenametest}, function(err,deldoc) {
         console.log(deldoc);
       	if (deldoc !== null) 
       	   {


                 var first = deldoc.firstsideimg;
                 var second = deldoc.secondsideimg;
                 var third = deldoc.thirdsideimg;
                 var fourth = deldoc.fourthsideimg;
                 var fifth = deldoc.fifthsideimg;
                 var sixth = deldoc.sixthsideimg;
                 var mainpreview = deldoc.mainpreview;
                 var xml = deldoc.xmlfile;
       
                 if (first !== null && second !== null && third !== null && fourth !== null && fifth !== null && sixth !== null && mainpreview !== null && xml !== null)
                 
                      {deleteimg(first);
                      deleteimg(second);
                      deleteimg(third);
                      deleteimg(fourth);
                      deleteimg(fifth);
                      deleteimg(sixth);
                      deleteimg(mainpreview);
                      deleteimg(xml);
       
                      console.log('files have been dealt with, proceeding with db data');
       
       
                      places.remove({placename: placenametest});
                      console.log('done with db data.');
       
            	      //places.remove({placename: placenametest});
            	      var vmessage = '<script>alert('+placenametest+' has been deleted);</script>'
            	      //res.send(placenametest+' is removed from db (this is not a test)');
            	      res.render('adminsearch',{'message':vmessage});
                      }

             	else 
             	     { 
                      places.remove({placename: placenametest});
             		res.send('some shit happened while checking presense of the 8 files, probably some of them missing.deleted db data anyway :) have fun sorting this shit out');
             
                      }
            }
    
        else 
    	    { res.send('some shit hapened while quering the database, remove aborted');
            }

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

  var vplacename = req.body.placename ,
	vnameru = req.body.nameru,
	vnameen = req.body.nameen,
	vtelephone = req.body.telephone,
	vwww = req.body.www,
	vppredir = req.body.ppredir,
	vcigarsbool = req.body.cigarsbool,
	vshishabool = req.body.shishabool,
	vworkinghours = req.body.workinghours,
	vkind = req.body.kind,
	vsort = req.body.sort,
	vtexten = req.body.texten,
	vtextru = req.body.textru,
	vrooftopbool = req.body.rooftopbool,
	vterracebool = req.body.terracebool,
	vblankbool = req.body.blankbool,
	vblanktextru = req.body.blanktextru,
	vblanktexten = req.body.blanktexten,
	vfid = req.body.fid ,
	vtopbool = req.body.topbool,
	vtoptype = req.body.toptype,
	vcity = req.body.city,
	vcountry = req.body.country,
	vyearnow = req.body.yearnow,
	vyearfounded = req.body.yearfounded;
    

	places.update({placename: vplacename},
	{
nameru : vnameru,
nameen : vnameen,
telephone : vtelephone,
www : vwww,
ppredir : vppredir,
cigarsbool : vcigarsbool,
shishabool : vshishabool,
workinghours : vworkinghours,
kind : vkind,
sort : vsort,
texten : vtexten,
textru : vtextru,
rooftopbool : vrooftopbool,
terracebool : vterracebool,
blankbool : vblankbool,
blanktextru : vblanktextru,
blanktexten : vblanktexten,
fid : vfid,
topbool : vtopbool,
toptype : vtoptype,
city : vcity,
country : vcountry,
yearnow : vyearnow,
yearfounded : vyearfounded});

    console.log(vplacename+' has been updated')
	res.redirect(vppredir);

  
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
//app.get('/places/:place', function(req,res) {
//	var reqplace = req.params.place;
//	console.log(reqplace);
//	var doc = new Object();
//	places.findOne({placename:reqplace}, function(err,doc){
//		console.log(doc);
//		 if (doc.topbool !== true) 
//		                          {
//                                  res.render('pp',{'placenameen': doc.nameen,'telephone':doc.telephone,'xml':doc.xml});  
//                                  }
//         else
//             	res.render('pptop',{'placenameen': doc.nameen,'telephone':doc.telephone,'xml':doc.xml});
//             }                         
//	});
//
//	
//});


app.post('/upload',function(req,res) {
	console.log('starting doin something');


function imgvariables (n) {
  for (i=1;i<=n;i++) {
    eval("var img_"+i+" = "+i);
    eval("console.log(img_"+i+")");
  }
}

var photonum = req.body.photonum

imgvariables(photonum);


//var vfirstsideimg;
//var vseconsideimg;
//var vthirdsideimg;
//var vfourthsideimg;
//var vfifthsideimg;
//var vsixthsideimg;
var vmainpreviewimg;
var vxmlfile;

   
    function upload(filepath,imageid,fieldid){
	var oldPath = filepath;
	console.log('1 step, oldPath:'+ oldPath);
var newPath = __dirname +"/public/images/places/" + imageid;
    console.log('2 step, newPath:' + newPath );
fs.readFile(oldPath , function(err, data) {
    fs.writeFile(newPath, data, function(err) {
        fs.unlink(oldPath, function(){
            if(err) throw err;
            res.send(imageid+"image uploaded to: " + newPath);
            fieldid = newPath;
        });
    }); 
}); 
};

if (req.files.firstside.name != 0 && req.files.secondside.name != 0 && req.files.thirdside.name != 0 && req.files.fourthside.name != 0 && req.files.fifthside.name != 0 && req.files.sixthside.name != 0 && req.files.xml.name != 0 )

{
console.log('files:ok');

function uploadloop(imgname,n) {
   for(i=1;i<=n;i++) {
    eval("upload(req.files.img_"+i+".path,req.files.img_"+i+".name,img_"+i);
   }
}

//upload(req.files.firstside.path,req.files.firstside.name,vfirstsideimg);
//upload(req.files.secondside.path,req.files.secondside.name,vseconsideimg);
//upload(req.files.thirdside.path,req.files.thirdside.name,vthirdsideimg);
//upload(req.files.fourthside.path,req.files.fourthside.name,vfourthsideimg);
//upload(req.files.fifthside.path,req.files.fifthside.name,vfifthsideimg);
//upload(req.files.sixthside.path,req.files.sixthside.name,vsixthsideimg);
upload(req.files.mainpreview.path,req.files.mainpreview.name,vmainpreviewimg);
upload(req.files.xml.path,req.files.xml.name,vxmlfile);


var vplacename = req.body.placename ,
	vnameru = req.body.nameru,
	vnameen = req.body.nameen,
	vtelephone = req.body.telephone,
	vwww = req.body.www,
	vppredir = req.body.ppredir,
	vmainpreview = "/public/images/places/previews/"+ req.files.mainpreview.name,
	vcigarsbool = req.body.cigarsbool,
	vshishabool = req.body.shishabool,
	vworkinghours = req.body.workinghours,
	vkind = req.body.kind,
	vsort = req.body.sort,
	vtexten = req.body.texten,
	vtextru = req.body.textru,
	vrooftopbool = req.body.rooftopbool,
	vterracebool = req.body.terracebool,
	vblankbool = req.body.blankbool,
	vblanktextru = req.body.blanktextru,
	vblanktexten = req.body.blanktexten,
	vfid = req.body.fid ,
	vtopbool = req.body.topbool,
	vcity = req.body.city,
	vcountry = req.body.country,
	vyearnow = req.body.yearnow,
	vyearfounded = req.body.yearfounded,
	vtoptype= req.body.toptype,
    vxml = "/public/images/places/" + req.files.xml.name;

    if (vtopbool !== false) 
    	                   {
    	                   	tops.insert({placename : vplacename,
                                         nameru : vnameru,
                                         nameen : vnameen,
                                         city : vcity,
                                         country : vcountry,
                                         toptype : vtoptype,
                                         ppredir : vppredir,
                                         yearfounded : vyearfounded
                                         });
    	                   }

   else 
   	   {
   	   	console.log('writing to places and news');
   	   }

	console.log(vplacename,vxml);

	places.insert({placename : vplacename,
nameru : vnameru,
nameen : vnameen,
telephone : vtelephone,
www : vwww,
ppredir : vppredir,
mainpreview : vmainpreview,
cigarsbool : vcigarsbool,
shishabool : vshishabool,
workinghours : vworkinghours,
kind : vkind,
sort : vsort,
texten : vtexten,
textru : vtextru,
rooftopbool : vrooftopbool,
terracebool : vterracebool,
blankbool : vblankbool,
blanktextru : vblanktextru,
blanktexten : vblanktexten,
fid : vfid,
topbool : vtopbool,
toptype : vtoptype,
city : vcity,
country : vcountry,
yearnow : vyearnow,
xml : vxml,
yearfounded : vyearfounded,
firstsideimg: vfirstsideimg,
secondsideimg: vsecondsideimg,
thirdsideimg: vthirdsideimg,
fourthsideimg: vfourthsideimg,
fifthsideimg: vfifthsideimg,
sixthsideimg: vsixthsideimg,
mainpreviewimg: vmainpreview,
xmlfile: vxmlfile});

	news.insert({placename : vplacename,
nameru : vnameru,
nameen : vnameen,
ppredir : vppredir,
mainpreview : vmainpreview,
city : vcity,
country : vcountry,
yearnow : vyearnow
	});

	

      var docs;
    places.find({placename:vplacename},function(err,docs){
        console.log('wrote to the places collection:' + docs);
        });
  

    news.find({placename:vplacename},function(err,docs){
        console.log('wrote to the news collection:' + docs);
        });
   

	
	console.log('upload done! redirecting to pp')
	res.redirect(vppredir);}

	else { 

		console.log('shitty files, upload has been aborted');
		res.redirect('/upload');
};

});

//mobile version starts here

app.get('/m',function(req,res){
  res.render('mindex');
});

app.get('/m/:lang/*',function (req,res){
  var checklang = req.params.lang;
  if (checklang != 'ru' || 'en' || 'sp' || 'fr' || 'gr' || 'it')
    {res.render('my404')}
});


app.get('/m/:lang/geo', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru'){res.render('mgeoru');} 
   if (lang === 'en'){res.render('mgeo');} 
   if (lang === 'gr'){res.render('mgeogr');} 
   if (lang === 'fr'){res.render('mgeofr');} 
   if (lang === 'sp'){res.render('mgeosp');} 
   if (lang === 'it'){res.render('mgeoit');} 
});

app.get('/m/:lang', function(req,res){
  console.log('got into /m/:lang route')
   var lang = req.params.lang;
   if (lang === 'ru'){res.render('mindexru');} 
   if (lang === 'en'){res.render('mindex');} 
   if (lang === 'gr'){res.render('blank');} 
   if (lang === 'fr'){res.render('blank');} 
   if (lang === 'sp'){res.render('blank');} 
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

app.get('/m/:lang/places',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mplacesru');} 
   if (lang === 'en'){res.render('mplaces');} 
   if (lang === 'gr'){res.render('mplacesgr');} 
   if (lang === 'fr'){res.render('mplacesfr');} 
   if (lang === 'sp'){res.render('mplacessp');} 
   if (lang === 'it'){res.render('mplacesit');} 
});

app.get('/m/:lang/property',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mpropertyru');} 
   if (lang === 'en'){res.render('mproperty');} 
   if (lang === 'gr'){res.render('mpropertygr');} 
   if (lang === 'fr'){res.render('mpropertyfr');} 
   if (lang === 'sp'){res.render('mpropertysp');} 
   if (lang === 'it'){res.render('mpropertyit');} 
});

app.get('/m/:lang/yachtsjets',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('myachtsjetsru');} 
   if (lang === 'en'){res.render('myachtsjets');} 
   if (lang === 'gr'){res.render('myachtsjetsgr');} 
   if (lang === 'fr'){res.render('myachtsjetsfr');} 
   if (lang === 'sp'){res.render('myachtsjetssp');} 
   if (lang === 'it'){res.render('myachtsjetsit');} 
});

app.get('/m/:lang/campuses',function (req,res){
  var lang = req.params.lang;
   if (lang === 'ru'){res.render('mcampusesru');} 
   if (lang === 'en'){res.render('mcampuses');} 
   if (lang === 'gr'){res.render('mcampusesgr');} 
   if (lang === 'fr'){res.render('mcampusesfr');} 
   if (lang === 'sp'){res.render('mcampusessp');} 
   if (lang === 'it'){res.render('mcampusesit');} 
});

app.get('/m/:lang/languages',function (req,res){
  res.render('mlanguages');
});




//mobile version's end

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