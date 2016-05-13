"use strict";

var Redis = require("ioredis"),
    crypto = require("crypto");

class Security {
    constructor(options) {
        this.options = options || {expire:60};
        this.client = new Redis({keyPrefix:"B2B2C"});
    }
    saveCSRF() {
        var hash = crypto.randomBytes(20).toString('hex');
        return this.client.set(hash,'1','EX',this.options.expire).then(function(){return hash;});
    }
    checkCSRF(hash) {
        return this.client.del(hash).then(function(result){
            if(result != 1) {
                return Promise.reject("csrf token not found");
            }
        });
    }
    createMiddleware() {
        var that = this;
        return function(req,res,next) {
            var token = req.header('X-XSRF-TOKEN');
            if(token) {
                that.checkCSRF(token).then(function(){
                    next();
                })
                .catch(function(err){
                    return res.status(401).send("Invalid CSRF");
                });
            } else {
                res.status(401).send("Request not from website");
            } 
        };
    }
}
