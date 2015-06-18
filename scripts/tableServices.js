var config = require('../config');
var webservices = config.services;

module.exports = function (){
    var orgcodeTables = {};
    for (var i = 0; i < webservices.length ; i++) {
        var webservice = webservices[i];
        var tables = webservice.tables;
        var orgcode = webservice.orgcode;
        orgcodeTables[orgcode] = [];
        for (var y = 0; y < tables.length ; y++){
            var tableService = {}
            var table = tables[y];
            tableService['orgcode'] = webservice.orgcode;
            tableService['host'] = webservice.options.host;
            tableService['path'] = webservice.options.path; 
            tableService['table'] = table;             
            orgcodeTables[orgcode].push(tableService);
        }
    }
    //console.log('orgcodeTables',orgcodeTables);
    return orgcodeTables;
}
