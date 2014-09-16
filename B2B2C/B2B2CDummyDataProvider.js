/**
 * Created by Beeven on 9/2/2014.
 */

var Q = require("q");


function makeData(id){
    return [
        {
            tax_bill_id: null,
            tax_total: 0,
            date_of_issue: "2014-09-16 03:10:21",
            receiver_id: id,
            orders: [
                {
                    order_id: "731197933138950",
                    freight_id: "defghijk",
                    status: "放行",
                    last_updated: "2014-09-16 00:10:21"
                }
            ]
        },
        {
            tax_bill_id: "P514120140700000106",
            tax_total: "137.5",
            date_of_issue: "2014-09-16 01:10:21",
            receiver_id: id,
            orders:[
                {
                    order_id: "713195292078950",
                    freight_id: "abcdefg",
                    status: "放行",
                    last_updated: "2014-09-15 12:50:21"
                },
                {
                    order_id: "713195292078950-1",
                    freight_id: "abcdefg",
                    status: "放行",
                    last_updated: "2014-09-15 12:49:22"
                },
                {
                    order_id: "713195292078950-2",
                    freight_id: "abcdefg",
                    status: "放行",
                    last_updated: "2014-09-15 15:22:28"
                }
            ]
        },
        {
            tax_bill_id: null,
            tax_total: 0,
            date_of_issue: "2014-09-16 00:10:21",
            receiver_id: id,
            orders: [
                {
                    order_id: "731197933138950",
                    freight_id: "defghijk",
                    status: "放行",
                    last_updated: "2014-09-16 00:10:21"
                }
            ]
        },
        {
            tax_bill_id: null,
            tax_total: 0,
            date_of_issue: "2014-09-15 00:09:21",
            receiver_id: id,
            orders: [
                {
                    order_id: "751197933138950",
                    freight_id: "defghijk",
                    status: "放行",
                    last_updated: "2014-09-15 00:09:21"
                }
            ]
        },
        {
            tax_bill_id: "P514120140700000003",
            tax_total: "120",
            date_of_issue: "2014-09-14 01:10:21",
            receiver_id: id,
            orders:[
                {
                    order_id: "713195292078950",
                    freight_id: "abcdefg",
                    status: "放行",
                    last_updated: "2014-09-14 12:50:21"
                },
                {
                    order_id: "713195292078950-1",
                    freight_id: "abcdefg",
                    status: "放行",
                    last_updated: "2014-09-14 12:49:22"
                }
            ]
        }
    ];
}


exports.query = function(criterion,startDate,endDate) {

    var data = makeData(criterion);

    return Q(data);
};
