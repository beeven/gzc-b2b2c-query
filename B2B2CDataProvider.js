/**
 * Created by Beeven on 2014-09-02.
 */

var Q = require("q");

var oracle = require("oracle");

var config = {
    hostname: '172.7.1.84',
    port: 1521,
    database: "HYDEC",
    user: "kjecdec",
    password: "dbwork"
};



exports.query = function(criterion,startDate,endDate){
    var start = Date.parse(startDate);
    var end = Date.parse(endDate);
    var deferred = Q.defer();

    oracle.connect(config,function(err,connection){
        if(err) {
            console.error("Error connection to db:", err);
            deferred.reject(err);
        }
        connection.execute(
            'select OID as "Id", ' +
            'RECEIVE_NAME as "receiver_name", ' +
            'RECEIVE_NUM as "receiver_id", ' +
            'TAX_NUMBER as "tax_number", ' +
            'TAX_TOTAL as "tax_total", ' +
            'POST_SUM as "post_sum", ' +
            'RATEABLE_TOTAL as "rateable_total", ' +
            'TAXABLE_DATE as "taxable_date" ' +
            'from COM_EB_POSTITEMS_TAX ' +
            'where RECEIVE_NAME like (:1) ' +
            'or RECEIVE_NUM like (:2) ' +
            'order by TAXABLE_DATE desc',
            [criterion,criterion,start,end],
            function(err, results){
                if(err) {
                    console.error("Error executing query: ",err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(results);
                }
                connection.close();
            });
    });
    return deferred.promise;
};
