var request = require("request"),
    Promise = require("bluebird"),
    http = require("http");


exports.query = function(criteria,startDate,endDate){
    return new Promise(function(resolve,reject){
        request.get(`http://10.53.1.181:3000/b2b2c/api/query/${criteria}?start=${startDate}&end=${endDate}`, function(err,response,body){
            if(!err && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                console.error(new Date().toString(), err);
                reject({statusCode: response.statusCode, err: err});
            }
        });
    });
};
