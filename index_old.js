//node modules
var fs = require('fs');
var https = require('https');
var http = require('http');

//npm modules
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "hyd-imp"});
var moment = require('moment');

var clone = require('clone');

var split = require('split');
var split2 = require('split2');

var domain = require('domain'),
reqDomain = domain.create();

var url = require('url');

var req = require('request');

var levelup = require('levelup');
var db = levelup('./tableSchemas');
var dbOptions = {};
dbOptions['db'] = db;
    
//custom modules
var hydstraTools = require('./scripts');
var requests = require('./requests');
var URIs = hydstraTools.uris(); 
var config = require('./config');

//var webservices = config.services;
//var query = require('./queries').getTable;

var agencyNo = 0;
var URIoptions = {'pool': {'maxSockets': Infinity},'keepAlive':false};


for (orgcode in URIs) {
    if (!URIs.hasOwnProperty(orgcode)) { continue }
    //log.info('orgcode: ', orgcode);
    var URLList = URIs[orgcode];
    //callURLList(orgcode,URLList);    
    var URInumber = 0;
    //console.log('URLList',URLList);
    loopServices(orgcode, URInumber, URLList);
    
}

// function callURLList(orgcode,URLList){
//     for (var i = 0; i < URLList.length ; i++) {
//       //var webservice = webservices[i];
//       //webservice['query'] = query;
//       log.info('orgcode: ', URLList[i].orgcode);
//       //log.info('params: ', URLList[i].query.params);
//       //var months = monthIncrement;
//       //var c = 0;
//       // requestTable(URLList[i],function(data){
//       //   log.info(data);
//       // });
//       var URL = {}
//       URL = clone(URLList[i]); 
//       var URInumber = 0;
//       console.log('i [',i,'], URL [',URL,']');

//       //loopServices(URL, URInumber);
      
//     }    
// }


// loopURI(URLList[i], URInumber, param, table, function(){

// });



function loopServices(orgcode, URInumber, urls ){
    var URLitem = clone(urls[URInumber]);
    log.info('lookup [',URInumber,'],  orgcode: ',URLitem.orgcode, ', urls.length: ', urls.length);
    //console.log('URInumber < URLList.length',URInumber ,'<', URLList.length)
    //console.log('URRLists[URInumber]',URLitem)
    var options = {};
    options['urlItem'] = URLitem;
    options['uriNumber'] = URInumber;
    options['log'] = log;

    requests.requestTable( options, function(){
        if ( URInumber < urls.length ){
            URInumber++;
            var urlist = clone(urls[URInumber]);
            loopServices( orgcode, urlist , URInumber);
        }
    });
}


function requestTable (urlitem,URInumber,callback){
    console.log('urlitem',urlitem);
    var query = JSON.stringify(urlitem.query);
    var options = urlitem.options;
    var orgcode = urlitem.orgcode;
    var table = urlitem.table;
    //var schemaId = webservice.schemaId;
    
    var devFile =  __dirname + '/data/'+orgcode+'.json';

    var uriUnparsed = 'http://' + urlitem.host + urlitem.path + query;
    
    //var uriUnparsed = 'http://' + webservice.host + webservice.path + JSON.stringify(webservice.query);
    dbOptions['table'] = table;
    var test = 1;
    //if (webservice.decode){
    if ( test ){
        uri = url.parse(uriUnparsed)
        uri.path = decodeURIComponent(uri.path);
        
        URIoptions['uri'] = uri;
    }
    else{
        URIoptions = 'http://' + urlitem.host + urlitem.path + query;
    }
    
    reqDomain.on('error', function(err) {
        log.error('Error caught in request domain: ' + err);
    });

    reqDomain.run(function() {
      //log.info('query: ',URIoptions);

      req.get(URIoptions)
        .pipe(split2())
        .pipe(hydstraTools.cleanReturn())
        .pipe(hydstraTools.lookupSchemaId(dbOptions))
        //.pipe(hydstraTools.generateMetaSchema())
        // .pipe(hydstraTools.loginToGFC())
        //.pipe(hydstraTools.createSchema())
        // .pipe(hydstraTools.loginToCompanyTable())
        // .pipe(hydstraTools.createTableSchemaAssociation()) // this will return the schema _id for a company-table 
        
        .pipe(hydstraTools.createRecord())
        .pipe(fs.createWriteStream(devFile))
        //.resume()
        .on('close',function(){
          log.info('close [',orgcode,']');
           setTimeout( function(){
              callback();
              //rr.removeAllListeners();
           },1000);
        })        
    })
}




//         if( y < filterParams.length ) {
//             y++;
//             loopFilters ( webservice, y, table, cb );
//             //info.log('calling table: '+table+', param: ', param);
//         };
//     });



//loopServices (webservices, agencyNo);

// function loopServices (webservices, agencyNo){
//   var c = 0;
//   var webservice = webservices[agencyNo];
//   webservice['query'] = query;
  


//   log.info('calling services: ', webservice.orgcode);
//   loopTables(webservice, c, function(){
//     if ( agencyNo < webservices.length ){
//         agencyNo++;
//         loopServices( webservices, agencyNo);
//     }
//   });
// }

// function loopTables ( webservice, i, cb ){
//     var tbles = webservice.tables;
//     var y = 0;
//     //var mDate = moment().format('YYYY');
//     //for (var i = 0; i < tbles.length ; i++) {
    
//     var table = tbles[i];
//     log.info('calling table: ', table)        
    
//     loopFilters(webservice, y, table, function(){
//         if (i < tbles.length){
//             i++;    
//             loopTables(webservice, i, cb);
//         }    
//     });
//     //}

//     // loopFilters(webservice, months, tble, function(){
//     //   y++;
//     //   months = months + monthIncrement;
//     //   if( typeof tbles !== 'string' && y < tbles.length ) { loopTables(webservice, months)}
//     // });
// }


// function loopFilters ( webservice, y, table, cb){
//     param = filterParams[y];
//     //var query = webservice.query;
//     //query.params.table_name = table; 
//     //query.params.sitelist_filter = 'match('+param+'*)'; 
//     //webservice['query'] = query;
//     //log.info('query: ', query)
//     //requestTable(webservice, table, function(){
//     var x = 0;
//     loopSubFilters(webservice, x, param, table, function(){
//         if( y < filterParams.length ) {
//             y++;
//             loopFilters ( webservice, y, table, cb );
//             //info.log('calling table: '+table+', param: ', param);
//         };
//     });
// }

// function loopSubFilters ( webservice, x, param, table, cb){
//     var query = webservice.query;
//     query.params.table_name = table;
//     var subParam = filterParams[x];
//     var fullParam = param + subParam;
//     query.params.sitelist_filter = 'match('+fullParam+'*)'; 
//     webservice['query'] = query;
//     //log.info('x: ',x,', query: ', query)
//     requestTable(webservice, table, function(){
//         if( x <= 9 ) {
//             x++;
//             loopSubFilters ( webservice, x, param, table, cb );
//             //info.log('calling table: '+table+', param: ', param);
//         };
//     });
// }


    // var mDate = moment().format('YYYY');
    // requestTable(webservice, table, sDate, function(){
    //     months++;
    //     if( yDate >= 1890 ) {
    //         setTimeout(function() {
    //             log.info('yDate > 1890:',yDate,', table: ',table);
    //             loopFilters(webservice, months, table);
    //         }, 500); 
    //     }
    // });
// function loopDates (webservice, months, table){
//     var sDate = moment().subtract(months, 'years').format('YYYYMMDD');
//     var eDate = moment().subtract(months+1, 'years').format('YYYYMMDD');
//     var yDate = Number(sDate.slice(0,4));


//     var start = {};
//     var end = {};

//     var complexFilter = [];

//     start['fieldname'] = 'datecreate';
//     start['value'] = sDate;
//     start['operator'] = 'LE';

//     end['fieldname'] = 'datecreate';
//     end['value'] = eDate;
//     end['operator'] = 'GT';
//     end['combine'] = 'AND';
//     complexFilter.push(start);    
//     complexFilter.push(end);    
    
//     var query = webservice.query;
//     //query.params.complex_filter = complexFilter; //.push(start,end);// = complexFilter;
//     query.params.table_name = table; //.push(start,end);// = complexFilter;
    
//     log.info('months: ',months,'sDate: ',sDate,', eDate:',eDate,', query:',query, 'start:',start,', end: ',end);

//     webservice['query'] = query;
               
//     yDate = 1880;           
//     requestTable(webservice, table, sDate, function(){
//         months++;
//         if( yDate >= 1890 ) {
//             setTimeout(function() {
//                 log.info('yDate > 1890:',yDate,', table: ',table);
//                 loopDates(webservice, months, table);
//             }, 500); 
//         }
//     });
// }
