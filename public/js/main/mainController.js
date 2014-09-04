/**
 * Created by zzzxj on 8/19/2014.
 */
'use strict';

angular.module('main.module', ['common.service.module'])
    .controller('mainController', ['$scope', 'queryService',
        function ($scope, queryService) {
            var today = new Date();
            $scope.queryData = {
                phoneOrName: '',
                startDate: new Date(today.setMonth(today.getMonth() - 1)),
                endDate: new Date()
            }
            $scope.resultDataList = [];
            $scope.query = function () {
                queryService.query({id: $scope.queryData.phoneOrName}, function (result) {
                    console.log(result)
                    $scope.resultDataList = result;
                });
            }

        }
    ])
    /*.controller('resultController', ['$scope',
     function ($scope) {

     }
     ])*/
    .factory('queryService', ['$resource',
        function ($resource) {
            return $resource('api/:action/:id', {}, {
                query: { method: 'GET', params: {action: 'query'}, isArray: true }
            })
        }
    ])