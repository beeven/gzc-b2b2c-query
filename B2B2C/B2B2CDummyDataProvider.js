/**
 * Created by Beeven on 9/2/2014.
 */

var Q = require("q");


function makeData(name,id){
    return [
        {
            receiver_name: name, // 收件人名称
            receiver_id: id,
            tax_number: "P518520140400000009", // 个人税单号，应征税额为0时，此处 null
            tax_total: 1194.20, // 计税物品总值
            post_sum: 119.42, // 行邮税税额
            rateable_total: 119.42, // 应征税额
            taxable_date: new Date("2014-09-03") // 计税日期
        },
        {
            receiver_name: name, // 收件人名称
            receiver_id: id,
            tax_number: null, // 个人税单号，应征税额为0时，此处 null
            tax_total: 312, // 计税物品总值
            post_sum: 31.2, // 行邮税税额
            rateable_total: 0, // 应征税额
            taxable_date: new Date("2014-09-02") // 计税日期
        },
        {
            receiver_name: name, // 收件人名称
            receiver_id: id,
            tax_number: null, // 个人税单号，应征税额为0时，此处 null
            tax_total: 213.40, // 计税物品总值
            post_sum: 21.34, // 行邮税税额
            rateable_total: 0, // 应征税额
            taxable_date: new Date("2014-09-01") // 计税日期
        },
        {
            receiver_name: name, // 收件人名称
            receiver_id: id,
            tax_number: "P518520140300000023", // 个人税单号，应征税额为0时，此处 null
            tax_total: 3194.20, // 计税物品总值
            post_sum: 319.42, // 行邮税税额
            rateable_total: 319.42, // 应征税额
            taxable_date: new Date("2014-08-30") // 计税日期
        },
        {
            receiver_name: name, // 收件人名称
            receiver_id: id,
            tax_number: null, // 个人税单号，应征税额为0时，此处 null
            tax_total: 194.20, // 计税物品总值
            post_sum: 19.42, // 行邮税税额
            rateable_total: 0, // 应征税额
            taxable_date: new Date("2014-08-29") // 计税日期
        }
    ];
}


exports.query = function(criterion,startDate,endDate) {
    var name="奥巴马";
    var id = "350204197705306527";
    if(/[a-zA-Z0-9]{13}/.test(id)) {
        id = criterion;
    } else {
        name = criterion;
    }
    var start = Date.parse(startDate);
    var end = Date.parse(endDate);
    var data = makeData(name,id);
    if(!isNaN(start)) {
        data = data.filter(function(x){return x.taxable_date >= start});
    }
    if(!isNaN(end)) {
        data = data.filter(function(x){return x.taxable_date <= end});
    }

    return Q(data);
};
