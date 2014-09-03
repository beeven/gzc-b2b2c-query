/**
 * Created by Beeven on 9/3/2014.
 */
var dataProvider = require("../B2B2CDummyDataProvider");

describe("B2B2CDataProvider",function(){


    it("should have a method naming query",function(){
        dataProvider.should.have.a.property("query");
        dataProvider.query.should.be.a.Function;
    });

    describe("B2B2CDataProvider.query",function(){
        it("should have 3 arguments",function(){
            dataProvider.query.should.have.lengthOf(3);
        });

        it("should return a promise if invoked",function(done){
            var ret = dataProvider.query("abc","2014-03-21","2014-09-20");
            ret.should.be.an.Object;
            ret.should.have.a.property("then");
            done();
        });

    });
});