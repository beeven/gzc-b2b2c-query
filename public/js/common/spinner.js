/*
	Written by Beeven on 3/12/2015
*/
(function(angular){
	"use strict";
	angular.module('spinner',[])
	.directive('spinner',function(){
        var content;
        function repeat(pattern ,count) {
            if(count<1) return '';
            var result = '';
            while (count > 1) {
                if(count & 1) result += pattern;
                count >>= 1, pattern += pattern;
            }
            return result + pattern;
        }
        if(!String.prototype.repeat) {
            content = repeat("<div class='cube'></div>",9);
        } else {
            content = "<div class='cube'></div>".repeat(9);
        }
		return {
			template:"<div class='spinner'>" + content + "</div>",
			restrict: 'A',
			scope: {
				style: "@spinner"
			},
			controller: function($scope, $element, $attrs) {
			}
		};
	})
})(angular);
