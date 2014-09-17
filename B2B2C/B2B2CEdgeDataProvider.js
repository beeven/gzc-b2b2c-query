var edge = require("edge");
var Q = require("q");

var csquery = edge.func({
    //source: require("path").join(__dirname,"query.cs"),
    assemblyFile: "query.dll",
    typeName: "Startup",
    methodName: "Invoke",
    references: ['System.Data.dll','System.Data.OracleClient.dll']
});


exports.query = function(criterion){
    var deferred = Q.defer();
    csquery(criterion,function(err,results){
        if(err) {
            console.error(err);
            deferred.reject(err);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}
