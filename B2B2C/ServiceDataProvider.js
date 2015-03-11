var Q = require("q"),
    http = require("http")


exports.query = function(criteria,startDate,endDate){
    var deferred = Q.defer();
    var request = http.get("http://10.53.1.181:3000/b2b2c/api/query/"+criteria+"?start="+startDate+"&end="+endDate,function(res){
        res.on('data',function(chunk){
            deferred.resolve(JSON.parse(chunk.toString()));
            //console.log("got: ",chunk);
        });
    });
    request.on('error',function(e){
        deferred.reject(e);
        console.error(e);
    });
    return deferred.promise;

};
