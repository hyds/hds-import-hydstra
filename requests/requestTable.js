var url = require('url');
var clone = require('clone');
var split = require('split');
var split2 = require('split2');

var req = require('request');
var domain = require('domain'),
reqDomain = domain.create();

var fs = require('fs');
    
//custom modules
var hydstraTools = require('../scripts');

module.exports = function (options,callback){
    var urlitem = clone(options.urlItem);
    var URInumber = options.uriNumber;
    var log = options.log;
    var URIoptions = {'pool': {'maxSockets': Infinity},'keepAlive':false};
    var dbOptions = {}
    dbOptions['schemas'] = options['db'];
    var query = urlitem.query;
    var decode = urlitem.decode;
    

    //console.log('# [','URInumber'URInumber,'] query',query);
    //console.log('in request Table options',options);
    //console.log('in request Table urlitem',urlitem);
    //console.log('decode: ',decode);
    //console.log('in request Table query',query);
    //var options = urlitem.options;
    var orgcode = urlitem.orgcode;
    var table = urlitem.table;
    
    //var schemaId = webservice.schemaId;
    
    var devFile =  __dirname + '/data/'+orgcode+'.json';
    var uriUnparsed = 'http://' + urlitem.host + urlitem.path + JSON.stringify(query);
    
    //var uriUnparsed = 'http://' + webservice.host + webservice.path + JSON.stringify(webservice.query);
    dbOptions['table'] = table;
    
    if (decode){
        uri = url.parse(uriUnparsed)
        uri.path = decodeURIComponent(uri.path);
        
        URIoptions['uri'] = uri;
    }
    else{
        URIoptions = 'http://' + urlitem.host + urlitem.path + query;
    }
    
    reqDomain.on('error', function(err) {
        log.error('Error caught in request domain: ' + err + uriUnparsed );
    });

    reqDomain.run(function() {
      //log.info('query: ',URIoptions);
      log.info('URI # [',URInumber,']');//,'urlitem',urlitem);
      //console.log('URInumber',URInumber,'] URIoptions',URIoptions);//,'urlitem',urlitem);
    
        var r = req.get(URIoptions)
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
               log.info('close [',orgcode,'] #[',URInumber,'], table[',table,']');
                setTimeout( function(){
                   return callback();
                   //rr.removeAllListeners();
                },1000)
             });
        
	r.on('end',function(){
               log.info('close [',orgcode,'] #[',URInumber,'], table[',table,']');
                setTimeout( function(){
                   return callback();
                   //rr.removeAllListeners();
                },1000)
             });
	r.end();   
    })
}
