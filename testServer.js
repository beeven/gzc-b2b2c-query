/**
 * Created by zzzxj on 9/12/2014.
 */

var express = require("express"),
    app = express(),
    routes = require("./index"),
    http = require("http"),
    path = require('path');

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

routes.setup(app);

http.createServer(app).listen(app.get('port'),function(){
    console.log("Express server listening on port " + app.get("port"));
});
