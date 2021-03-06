var through = require('through2');

//module.exports = function (table){
module.exports = function (dbOptions){
  //var db = dbOptions.db;
  var schemas = dbOptions.schemas;
  var table = dbOptions.table;
  var lookupKey = 'kisters_hydstra' +'_' + table.toLowerCase();
  var dataReturn;
    
  return through(function write(buffer, _, next) {
    var line = buffer.toString();
    
    // var tr = through(function (buf, _, next) {
    //   this.push(buf.toString().toUpperCase());
    //   next();
    // });

    //console.log('schema + dataReturn',dataReturn);
    //console.log('db[lookupKey] ', schemas)
                    

    if (! line || line == 'undefined'){ 
        console.log('line undefined: ', line, ', next()');
        next(); 
    }
    else{

        // db.createReadStream()
        //     .on('data', function (data) {
        //         console.log('line',line);
    
        //         if (data['key'] == lookupKey){
        //             console.log("lookupSchema data: ", data);
        //             
                    var d = {};
                    // d['schemaId'] = data.value;
                    d['schemaId'] = schemas[lookupKey];
                    //console.log('schemas[lookupKey] ', schemas[lookupKey])
                    console.log('schemaId: ', d.schemaId)
                    d['json'] = JSON.parse(line);
                    dataReturn = JSON.stringify(d);
                    next();
            //     }
            // })
    }
},
  function end(cb){
    this.push(dataReturn, 'utf8');
    cb();
  })
}