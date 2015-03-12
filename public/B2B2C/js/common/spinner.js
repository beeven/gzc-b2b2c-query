/*
	Written by Beeven on 3/12/2015
*/
(function(angular){
	"use strict";
	angular.module('spinner',[])
	.directive('spinner',function(){
		return {
			template:"<div class='spinner'>" + "<div class='cube'></div>".repeat(3*3) + "</div>",
			restrict: 'A',
			scope: {
				style: "@spinner"
			},
			controller: function($scope, $element, $attrs) {
				console.log($scope.style);
			}
		};
	})
})(angular);