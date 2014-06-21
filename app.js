var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , places = db.get('places'),property = db.get('property'), news = db.get('news'), tops = db.get('tops');
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

app.get('*',function(req,res,next) {
  var d = new Date();
  if(req.headers.host === 'topandviews.ru') 
    {console.log(d+' request on .ru form '+req.ip);}
  if(req.headers.host === 'topandviews.com') 
    {console.log(d+' request on .com form '+req.ip);}
  if(req.headers.host === 'topandviews.co.uk') 
    {console.log(d+' request on .co.uk form '+req.ip);}
  next();
});

//subdomain magic 
app.get('*', function(req,res,next) { 
  var d = new Date();
  if(req.headers.host === 'm.topandviews.com')  //if it's a sub-domain
   {console.log(d+' got a mobile version request on .com from '+req.ip);
    req.url = '/m' + req.url; 
    console.log(req.url); //append some text yourself
  next();} 
  else {

  if(req.headers.host === 'm.topandviews.co.uk')  //if it's a sub-domain
    {console.log(d+' got a mobile version request on co.uk from '+req.ip);
    req.url = '/m' + req.url;  //append some text yourself
    console.log(req.url);
    next();} 
     else {
  
    if(req.headers.host === 'm.topandviews.ru')  //if it's a sub-domain
    {console.log(d+' got a mobile version request on .ru from  '+req.ip);
    req.url = '/m' + req.url + 'ru';  //append some text yourself
    console.log(req.url);}
    else {next();}
       
     }
   }


}); 





//done with subdomains

//full version starts here, mobile will be below

app.get('/', function(req,res) {
        var incomming = req.headers.host;
  if (incomming = 'topandviews.ru') {
    res.render('indexru');
  } 
  if (incomming = 'topandviews.co.uk') {
    res.render('index');
  }
  if (incomming = 'topandviews.com') {
    res.render('index');
  }
        
});

app.get('/choice',function(req,res){
  var incomming = req.headers.host;
  if (incomming = 'topandviews.ru') {
    res.render('landingru');
  } 
  if (incomming = 'topandviews.co.uk') {
    res.render('landinguk');
  }
  if (incomming = 'topandviews.com') {
    res.render('landing');
  }
});

app.get('/:lang/choiceru',function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('landingru')}
  if (lang === 'fr') {res.render('landingfr')}
  if (lang === 'gr') {res.render('landinggr')}
  if (lang === 'sp') {res.render('landingsp')}
  if (lang === 'it') {res.render('landingit')} 

});

app.get('/:lang',function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('indexru')}
  if (lang === 'fr') {res.render('indexfr')}
  if (lang === 'gr') {res.render('indexgr')}
  if (lang === 'sp') {res.render('indexsp')}
  if (lang === 'it') {res.render('indexit')} 
});

app.get('/contact',function(req,res){
   res.render('blank');
});

app.get('/:lang/contact', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('contactru')}
  if (lang === 'fr') {res.render('contactfr')}
  if (lang === 'gr') {res.render('contactgr')}
  if (lang === 'sp') {res.render('contactsp')}
  if (lang === 'it') {res.render('contactit')} 
});

app.get('/job',function(req,res){
  res.render('job');
});

app.get('/:lang/job', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('jobru')}
  if (lang === 'fr') {res.render('jobfr')}
  if (lang === 'gr') {res.render('jobgr')}
  if (lang === 'sp') {res.render('jobsp')}
  if (lang === 'it') {res.render('jobit')} 
});

app.get('/partners',function(req,res){
  res.render('blank')
});

app.get('/:lang/partners', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('partnersru')}
  if (lang === 'fr') {res.render('partnersfr')}
  if (lang === 'gr') {res.render('partnersgr')}
  if (lang === 'sp') {res.render('partnerssp')}
  if (lang === 'it') {res.render('partnersit')} 
});

app.get('/campuses', function(req,res){
  res.render('blank');
});

app.get('/:lang/campuses', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('campusesru')}
  if (lang === 'fr') {res.render('campusesfr')}
  if (lang === 'gr') {res.render('campusesgr')}
  if (lang === 'sp') {res.render('campusessp')}
  if (lang === 'it') {res.render('campusesit')} 
});

app.get('/property', function(req,res){
  res.render('buystaysell');
});

app.get('/:lang/property', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('propertyru')}
  if (lang === 'fr') {res.render('propertyfr')}
  if (lang === 'gr') {res.render('propertygr')}
  if (lang === 'sp') {res.render('propertysp')}
  if (lang === 'it') {res.render('propertyit')} 
});

app.get('/property/buy', function(req,res){
  res.render('buy');
});

app.get('/:lang/property/buy', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('buyru')}
  if (lang === 'fr') {res.render('buyfr')}
  if (lang === 'gr') {res.render('buygr')}
  if (lang === 'sp') {res.render('buysp')}
  if (lang === 'it') {res.render('buyit')} 
});

app.get('/property/stay', function(req,res){
  res.render('stay');
});

app.get('/:lang/property/stay', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('stayru')}
  if (lang === 'fr') {res.render('stayfr')}
  if (lang === 'gr') {res.render('staygr')}
  if (lang === 'sp') {res.render('staysp')}
  if (lang === 'it') {res.render('stayit')} 
});

app.get('/property/sell', function(req,res){
  res.render('blank');
});

app.get('/:lang/property/sell', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('sellru')}
  if (lang === 'fr') {res.render('sellfr')}
  if (lang === 'gr') {res.render('sellgr')}
  if (lang === 'sp') {res.render('sellsp')}
  if (lang === 'it') {res.render('sellit')} 
});

app.get('/places', function(req,res){
  res.render('places');
});

app.get('/:lang/places', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('placesru')}
  if (lang === 'fr') {res.render('placesfr')}
  if (lang === 'gr') {res.render('placesgr')}
  if (lang === 'sp') {res.render('placessp')}
  if (lang === 'it') {res.render('placesit')} 
});

app.get('/advsearch',function(req,res){
  res.render('advsearch');
});

app.get('/yachtsjets',function(req,res){
  res.render('yachtsjets');
});

app.get('/:lang/yachtsjets', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('yachtsjetsru')}
  if (lang === 'fr') {res.render('yachtsjetsfr')}
  if (lang === 'gr') {res.render('yachtsjetsgr')}
  if (lang === 'sp') {res.render('yachtsjetssp')}
  if (lang === 'it') {res.render('yachtsjetsit')} 
});

app.get('/yachts',function(req,res){
  res.render('blank');
});

app.get('/:lang/yachts', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('yachtsru')}
  if (lang === 'fr') {res.render('yachtsfr')}
  if (lang === 'gr') {res.render('yachtsgr')}
  if (lang === 'sp') {res.render('yachtssp')}
  if (lang === 'it') {res.render('yachtsit')} 
});

app.get('/jets',function(req,res){
  res.render('blank');
});

app.get('/:lang/jets', function(req,res){
  var lang = req.params.lang;
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

app.get('/job/photographer',function(req,res){
  res.render('photographer');
});

app.get('/:lang/job/photographer', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('photographerru')}
  if (lang === 'fr') {res.render('photographerfr')}
  if (lang === 'gr') {res.render('photographergr')}
  if (lang === 'sp') {res.render('photographersp')}
  if (lang === 'it') {res.render('photographerit')} 
});

app.get('/job/office',function(req,res){
  res.render('office');
});

app.get('/:lang/job/office', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('officeru')}
  if (lang === 'fr') {res.render('officefr')}
  if (lang === 'gr') {res.render('officegr')}
  if (lang === 'sp') {res.render('officesp')}
  if (lang === 'it') {res.render('officeit')} 
});

app.get('/job/it',function(req,res){
  res.render('it');
});

app.get('/:lang/job/it', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('itru')}
  if (lang === 'fr') {res.render('itfr')}
  if (lang === 'gr') {res.render('itgr')}
  if (lang === 'sp') {res.render('itsp')}
  if (lang === 'it') {res.render('itit')} 
});

app.get('/geo/:city/places',function(req,res){
  var geocity = req.params.city;
  res.render('geoplaces',{'city': geocity});
});

app.get('/:lang/geo/:city/places', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('geoplacesru')}
  if (lang === 'fr') {res.render('geoplacesfr')}
  if (lang === 'gr') {res.render('geoplacesgr')}
  if (lang === 'sp') {res.render('geoplacessp')}
  if (lang === 'it') {res.render('geoplacesit')} 
});

app.get('geo/:city/property',function(req,res){
  var geocity = req.params.city;
  res.render('geoproperty',{'city': geocity});
});

app.get('/:lang/geo/:city/property', function(req,res){
  var lang = req.params.lang;
  if (lang === 'ru') {res.render('geopropertyru')}
  if (lang === 'fr') {res.render('geopropertyfr')}
  if (lang === 'gr') {res.render('geopropertygr')}
  if (lang === 'sp') {res.render('geopropertysp')}
  if (lang === 'it') {res.render('geopropertyit')} 
});

app.post('/places', function(req,res){
  res.render('blank')
  
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

    if (top.bool === on) 
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

app.post('/advancedsearch',function(req,res){
  var rooftop = ' rooftop : '+req.body.rooftop;
  var terrace = ' terrace : '+req.body.terrace;
  var shisha = ' shisha : '+req.body.shisha;
  var cigars = ' cigars : '+req.body.cigars;
  var city = 'city : '+req.body.city;

  var query = new Array(); 
 if (req.body.rooftop !== undefined) 
                                    {
                                      rooftop ='rooftop : true';
                                      query.push(rooftop);
                                    };
 if (req.body.terrace !== undefined) 
                                    {
                                      terrace = 'terrace : true';
                                      query.push(terrace)
                                    };
 if (req.body.shisha !== undefined) 
                                    {
                                      shisha = 'shisha : true';
                                      query.push(shisha)
                                    };
 if (req.body.cigars !== undefined) 
                                    {
                                      cigars = 'cigars : true';
                                      query.push(cigars)
                                    };

 var result = query;
 console.log(JSON.stringify(result));
 res.send(result);
});
 

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

app.get('/geo', function(req,res){
  res.render('geo');
});

app.get('/geo/:city', function(req,res){
    var vreqcity = req.params.city;

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
                     
              	   	     res.render('geoindex', { 'city' : vreqcity , 'first' : absolute , 'second' : rooftop , 'third' : terrace , 'fourth' : cuisine });   
              	   });
              });
         });

    });

  

});

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


app.get('/m/geo', function(req,res){
  res.render('mgeo');
});

app.get('/m/:lang', function(req,res,next){
   var lang = req.params.lang;
   if (lang === 'ru'){res.render('mindexru');} 
   if (lang === 'en'){res.render('mindex');} 
   if (lang === 'gr'){res.render('blank');} 
   if (lang === 'fr'){res.render('blank');} 
   if (lang === 'sp'){res.render('blank');} 
   if (lang === 'it'){res.render('blank');} 
});

app.get('/m/geo/:city', function(req,res){
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

app.get('/m/places',function (req,res){
  res.render('blank');
});

app.get('/m/property',function (req,res){
  res.render('blank');
});

app.get('/m/yachtsjets',function (req,res){
  res.render('blank');
});

app.get('/m/campuses',function (req,res){
  res.render('blank');
});

app.get('/m/languages',function (req,res){
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