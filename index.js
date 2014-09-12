/**
 * Created by Beeven on 9/4/2014.
 */

var b2b2c = require("./B2B2C");
var checkPointNotice = require("./CheckPointNotice");

exports.setup = function(app) {
    app.use("/B2B2C",b2b2c.routes);
    app.use("/CheckPointNotice",checkPointNotice.routes);
};