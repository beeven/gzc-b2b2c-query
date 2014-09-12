/**
 * Created by Beeven on 9/2/2014.
 */

var express = require("express"),
    app = express(),
    routes = require("./index"),
    http = require("http");

app.set('port', process.env.PORT || 3000);


routes.setup(app);

http.createServer(app).listen(app.get('port'),function(){
    console.log("Express server listening on port " + app.get("port"));
});
