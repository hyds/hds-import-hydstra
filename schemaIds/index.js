module.exports = function (db){
    var schemaIds = {};
    db.createReadStream()
        .on('data', function (data) {
            var vendorSysTable = data.key;
            var id = data.value;
            schemaIds[vendorSysTable] = id ;
        })
        .on('end', function(){
    		// /console.log('schemaIds in modules',schemaIds);
    		return schemaIds;
        })
}