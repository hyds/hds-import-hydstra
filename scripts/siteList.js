var uris = require('./uris')();
var matchParams = require('./matchParams')();

module.exports = function (){
	var test = [];
	var org = {};
	var queries = [];
	// for (var i = 0; i < uris.length; i++) {
	// 	//console.log('uris qury: i [',i,'] ',uris[i].query.params.table_name);
	// 	var orgcode = uris[i].orgcode;
	// 	org['orgcode'] = uris[i].orgcode;
		
	// 	for (var h = 0; h < matchParams.length; h++) {
	// 		var query = {};
	// 		var urlQuery = {};
	// 		var params = {};

	// 		urlQuery.host = uris[i].host;
	// 		urlQuery.path = uris[i].path;
	// 		urlQuery.orgcode = orgcode;
	// 		urlQuery['table'] = uris[i].query.params.table_name;
			
	// 		params['sitelist_filter'] = matchParams[h]; 
	// 		params['table_name'] = uris[i].query.params.table_name;
	// 		params['return_type'] = uris[i].query.params.return_type;
			
	// 		query['params'] = params;
	// 		query['function'] = uris[i]['query']['function'];
	// 		query['version'] = uris[i]['query']['version'];
			
	// 		urlQuery.query = query;
			
	// 		queries.push(org);
	// 	}
	// }
	return queries;
}



