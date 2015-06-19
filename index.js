//npm modules
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "hyd-imp"});
var clone = require('clone');
var levelup = require('levelup');

// var db = levelup('./tableSchemas');
// var dbOptions = {};
// dbOptions['db'] = db;

var schemaIds = require('./schemaIds/schemas.json');

//custom modules
var hydstraTools = require('./scripts');
var requests = require('./requests');
var URIs = hydstraTools.uris(); 
var agencyNo = 0;

for (orgcode in URIs) {
    if (!URIs.hasOwnProperty(orgcode)) { continue }
    var URLList = URIs[orgcode];
    var URInumber = 0;
    loopServices(orgcode, URInumber, URLList);
}

function loopServices(orgcode, URInumber, urls ){
    var URLitem = clone(urls[URInumber]);
    log.info('lookup [',URInumber,'],  orgcode: ',orgcode, ', urls.length: ', urls.length);
    var options = {};
    options['urlItem'] = URLitem;
    options['uriNumber'] = URInumber;
    options['log'] = log;
    options['db'] = schemaIds;
    
    requests.requestTable( options, function(){
        if ( URInumber < urls.length ){
            URInumber++;
            //var urlist = clone(urls[URInumber]);
            loopServices( orgcode, URInumber, urls );
        }
    });
}


// var url = require('url');
// var levelup = require('levelup');
// var clone = require('clone');
// var split = require('split');
// var split2 = require('split2');

var req = require('request');
var domain = require('domain'),
reqDomain = domain.create();

var fs = require('fs');

// var db = levelup('../tableSchemas');
// var dbOptions = {};
// dbOptions['db'] = db;
    
//custom modules
//var hydstraTools = require('../scripts');

function requestTable(options,callback){
    var urlitem = clone(options.urlItem);
    var URInumber = options.uriNumber;
    console.log('# [',URInumber,']');
    var log = options.log;
    //console.log('urlitem',urlitem);
    var URIoptions = {'pool': {'maxSockets': Infinity},'keepAlive':false};
    
    var query = urlitem.query;
    //console.log('in request Table options',options);
    //console.log('in request Table urlitem',urlitem);
    //console.log('in request Table query',query);
    //var options = urlitem.options;
    var orgcode = urlitem.orgcode;
    var table = urlitem.table;
    
    //var schemaId = webservice.schemaId;
    
    var devFile =  __dirname + '/data/'+orgcode+'.json';
    var uriUnparsed = 'http://' + urlitem.host + urlitem.path + JSON.stringify(query);
    
    console.log('# [',URInumber,'] uriUnparsed',uriUnparsed,', query',query);
    // //var uriUnparsed = 'http://' + webservice.host + webservice.path + JSON.stringify(webservice.query);
    // dbOptions['table'] = table;
    
    // var test = 1;
    // //if (webservice.decode){
    // if ( test ){
    //     uri = url.parse(uriUnparsed)
    //     uri.path = decodeURIComponent(uri.path);
        
    //     URIoptions['uri'] = uri;
    // }
    // else{
    //     URIoptions = 'http://' + urlitem.host + urlitem.path + query;
    // }
    
    // // reqDomain.on('error', function(err) {
    // //     log.error('Error caught in request domain: ' + err);
    // // });

    //   log.info('query: ',URIoptions);
      return callback();
    // reqDomain.run(function() {
    //   log.info('query: ',URIoptions);
    //   callback();
    //   // req.get(URIoptions)
    //   //   .pipe(split2())
    //   //   .pipe(hydstraTools.cleanReturn())
    //   //   .pipe(hydstraTools.lookupSchemaId(dbOptions))
    //   //   //.pipe(hydstraTools.generateMetaSchema())
    //   //   // .pipe(hydstraTools.loginToGFC())
    //   //   //.pipe(hydstraTools.createSchema())
    //   //   // .pipe(hydstraTools.loginToCompanyTable())
    //   //   // .pipe(hydstraTools.createTableSchemaAssociation()) // this will return the schema _id for a company-table 
        
    //   //   .pipe(hydstraTools.createRecord())
    //   //   .pipe(fs.createWriteStream(devFile))
    //   //   //.resume()
    //   //   .on('close',function(){
    //   //     log.info('close [',orgcode,']');
    //   //      setTimeout( function(){
    //   //         return callback();
    //   //         //rr.removeAllListeners();
    //   //      },1000);
    //   //  })        
    // })
}