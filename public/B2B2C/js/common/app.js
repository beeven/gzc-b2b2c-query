/**
 * Created by zzzxj on 8/19/2014.
 */

'use strict';

angular.module("GZCApp", [
    "ngResource",
    "ngRoute",
    'main.module',
    'common.service.module',
    "ui.bootstrap"
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/input', {
                templateUrl: 'partials/main.html',
                controller: 'mainController'
            })
            /*$routeProvider.when('/result', {
                templateUrl: '/partials/dataList.html',
                controller: 'resultController'
            })*/
            $routeProvider.otherwise({ redirectTo: '/input' });
        }])