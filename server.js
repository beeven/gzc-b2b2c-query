/**
 * Created by Beeven on 9/2/2014.
 */

var express = require("express"),
    app = express(),
    http = require("http");

var bbc = require("./B2B2C");

app.set('port', process.env.PORT || 3010);

app.use("/",bbc.routes);


http.createServer(app).listen(app.get('port'),function(){
    console.log("Express server listening on port " + app.get("port"));
});
