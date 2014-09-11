var express = require("express"),
    app =   express.Router(),
    dataProvider = require("./dataProvider");

var dp = new dataProvider();

app.get("/api/currentList/:index",function(req,res){
    var index = req.params.index;
    var filter = req.query.filter;
    dp.fetch(index,filter).then(function(data){
        res.json(data);
    });
});

app.get("/api/currentList/allFrom/:fromId",function(req,res){
    var index = req.params.fromId;
    dp.fetchGreater(index).then(function(data){
        res.json(data);
    })
});

exports.routes = app;
