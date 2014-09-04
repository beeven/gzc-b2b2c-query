/**
 * Created by Beeven on 9/4/2014.
 */
var express = require("express"),
    app = express.Router();

var dataProvider = require("./B2B2CDummyDataProvider");


// query format: api/query/:id?start=2014-09-02&end=2014-09-03
// id: 身份证号/姓名
// start: 起始日期
// end: 结束日期
app.get("/api/query/:id",function(req,res){
    var id = req.params.id;
    var startDate = req.query.start;
    var endDate = req.query.end;

    dataProvider.query(id,startDate,endDate)
        .then(function(data){
            res.json(data);
        })
        .fail(function(err){
            res.send(500);
            console.error(err);
        });
});





exports.routes = app;