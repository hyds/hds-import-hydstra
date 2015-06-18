var tableServices = require('./tableServices')();
var tableQuery = require('../queries').table;
var matchParams = require('./matchParams')();
var clone = require('clone');

module.exports = function (){
    var orgURIs = {};
    for (orgcode in tableServices) {
        if (!tableServices.hasOwnProperty(orgcode)) { continue }
        orgURIs[orgcode] = [];
        var orgcodeTables = tableServices[orgcode];
        for (var i = 0; i < orgcodeTables.length ; i++) {
            var url = clone(orgcodeTables[i]);
            var query = clone(tableQuery);
            query.params.table_name = orgcodeTables[i].table;
            for (var h = 0; h < matchParams.length; h++) {
                query.params.sitelist_filter = clone(matchParams[h]);
                //query.params.table_name = matchParams[h]; 
                url['query'] = clone(query);
                orgURIs[orgcode].push(url);
                //console.log('url.query: ',url.query)
            }
        }
    }
    //console.log('orgURIs',orgURIs);
    return orgURIs;
}