var tableServices = require('./tableServices')();
var tableQuery = require('../queries').table;
var matchParams = require('./matchParams')();
var clone = require('clone');

module.exports = function (){
    var orgURIs = {};
    var count = 0;
    for (orgcode in tableServices) {
        if (!tableServices.hasOwnProperty(orgcode)) { continue }
        count++;
        orgURIs[orgcode] = [];
        //console.log('urirs [', count, '] org :',orgcode); //,', url.query: ',orgURIs[orgcode])
        var orgcodeTables = tableServices[orgcode];
        for (var i = 0; i < orgcodeTables.length ; i++) {
            var url = clone(orgcodeTables[i]);
            var query = clone(tableQuery);
            query.params.table_name = orgcodeTables[i].table;
            for (var h = 0; h < matchParams.length; h++) {
                query.params.sitelist_filter = clone(matchParams[h]);
                url['query'] = clone(query);
                url['decode'] = orgcodeTables[i].decode;
                orgURIs[orgcode].push(clone(url));
                
            }
        }
    }
    // console.log('orgURIs',orgURIs);
    // for (orgcode in tableServices) {
    //     if (!tableServices.hasOwnProperty(orgcode)) { continue }
     
    // }
    return orgURIs;
}