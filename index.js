//npm modules
var log = bunyan.createLogger({name: "hyd-imp"});
var clone = require('clone');
    
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
    log.info('lookup [',URInumber,'],  orgcode: ',URLitem.orgcode, ', urls.length: ', urls.length);
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