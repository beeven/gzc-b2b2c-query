var edge = require("edge");
var Q = require("q");

var csquery = edge.func({
    source: require("path").join(__dirname,"B2B2CEdgeDataProvider.cs"),
    //assemblyFile: "B2B2CEdgeDataProvider.dll",
    //typeName: "Startup",
    //methodName: "Invoke",
    references: ['System.Data.dll','System.Data.OracleClient.dll']
});


exports.query = function(criterion,startDate,endDate){
    var deferred = Q.defer();
    csquery({
        criterion: criterion,
        startDate: startDate,
        endDate: endDate
    },function(err,results){
        if(err) {
            console.error(err);
            deferred.reject(err);
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}
