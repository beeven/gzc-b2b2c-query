/**
 * Created by Beeven on 9/2/2014.
 */

var express = require("express"),
    app = express();


app.use(express.static(__dirname+"/public"));
app.listen(8080);


// query format: api/query/:id?start=2014-09-02&end=2014-09-03
// id: 身份证号/姓名
// start: 起始日期
// end: 结束日期
app.get("api/query/:id",function(req,res){
    res.json([{
        receiver_name: "奥巴马", // 收件人名称
        receiver_id: "350204197705306527",
        tax_number: "P518520140400000009", // 个人税单号，应征税额为0时，此处 null
        tax_total: 1194.20, // 计税物品总值
        post_sum: 119.42, // 行邮税税额
        rateable_total: 119.42, // 应征税额
        taxable_date: new Date("2014-09-03") // 计税日期
    },{

    }]);
});