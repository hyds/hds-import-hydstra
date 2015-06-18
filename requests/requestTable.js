var url = require('url');
var levelup = require('levelup');
var clone = require('clone');
var split = require('split');
var split2 = require('split2');

var req = require('request');
var domain = require('domain'),
reqDomain = domain.create();

var fs = require('fs');

var db = levelup('.../tableSchemas');
var dbOptions = {};
dbOptions['db'] = db;
    
//custom modules
var hydstraTools = require('../scripts');


module.exports = function (urlitem,URInumber,callback){
    console.log('urlitem',urlitem);
    var URIoptions = {'pool': {'maxSockets': Infinity},'keepAlive':false};
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
              return callback();
              //rr.removeAllListeners();
           },1000);
        })        
    })
}