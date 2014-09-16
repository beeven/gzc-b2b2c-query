/**
 * Created by Beeven on 2014-09-02.
 */

var Q = require("q");

var oracle = require("oracle");

var config = {
    hostname: '10.53.1.194',
    port: 1521,
    database: "ZNHG",
    user: "kjecsel",
    password: "kjecsel"
};

function GroupTaxBill(items) {
    var results = [];
    var groups = {};
    var i;
    for(i=0;i < items.length;i++) {
        var item = items[i];
        if(item.tax_bill_id) {
            if(!groups[item.tax_bill_id]){
                groups[item.tax_bill_id] = {
                    tax_bill_id : item.tax_bill_id,
                    tax_total: item.tax_total,
                    date_of_issue: item.date_of_issue,
                    orders: []
                };
            }
            groups[item.tax_bill_id].orders.push({
                order_id: item.order_id,
                freight_id: item.freight_id,
                status: item.status,
                last_updated: item.last_updated
            })
        }
        else {
            results.push({
                tax_bill_id: null,
                tax_total: 0,
                date_of_issue: item.last_updated,
                orders: [{
                    order_id: item.order_id,
                    freight_id : item.freight_id,
                    status: item.status,
                    last_updated: item.last_updated
                }]
            })
        }
    }
    for(var prop in groups){
        if(groups.hasOwnProperty(prop))
            results.push(groups[prop]);
    }
    results.sort(function(a,b){return a.date_of_issue - b.date_of_issue});
    return results;
}

exports.query = function(criterion){
    /*
    var start = Date.parse(startDate);
    var end = Date.parse(endDate);
    */

    var queryString = 'select ORDERDOCID as "receiver_id", ' +
        'CHILDORDERNO as "order_id", ' +
        'TRANSPORT_NO as "freight_id", ' +
        'HANDLE_DATE as "last_updated", ' +
        'EBSTATUS as "status", ' +
        'RATEABLE_TOTAL as "tax_total", ' +
        'PRINT_DATE as "date_of_issue", ' +
        'TAX_NUMBER as "tax_bill_id" ' +
        'from KJECCUS.V_EBILL_FOR_WECHAT ' +
        'where ORDERDOCID = (:1) ';

    var parameters = [criterion];
/*
    if(!!start && !end) {
        queryString += "and PRINT_DATE >= (:3) ";
        parameters.push(start);
    }
    else if(!start && !!end) {
        queryString += "and PRINT_DATE <= (:3) ";
        parameters.push(end);
    }
    else if(!!start && !!end){
        queryString += "and PRINT_DATE between (:3) and (:4) ";
        parameters.push(start);
        parameters.push(end);
    }
*/
    queryString += "order by nvl(PRINT_DATE,HANDLE_DATE) desc";

    var deferred = Q.defer();

    oracle.connect(config,function(err,connection){
        if(err) {
            console.error("Error connection to db:", err);
            deferred.reject(err);
        }

        connection.execute(
            queryString,
            parameters,
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
