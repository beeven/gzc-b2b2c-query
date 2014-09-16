/**
 * Created by Beeven on 9/3/2014.
 */
var dataProvider = require("../../B2B2C/B2B2CDataProvider");

describe("B2B2CDataProvider",function(){


    it("should have a method naming query",function(){
        dataProvider.should.have.a.property("query");
        dataProvider.query.should.be.an.instanceOf(Function);
    });

    describe("B2B2CDataProvider.query",function(){
        it("should have 1 arguments",function(){
            dataProvider.query.should.have.lengthOf(1);
        });

        it("should return a promise if invoked",function(done){
            dataProvider.query("310103198209244043")
                .then(function(data){
                    data.should.be.an.Array.with.a.property("length").which.is.above(0);
                    done();
                })
                .fail(function(err){
                    console.error(err);
                    done();
                })
        });

    });

});
