/**
 * Created by zzzxj on 8/19/2014.
 */

'use strict';

angular.module("GZCApp", [
    "ngResource",
    "ngRoute"
    /*"ui.bootstrap"*/
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/input', {
                templateUrl: 'partials/main.html',
                controller: 'mainController'
            })
            /*$routeProvider.when('/result', {
             templateUrl: 'partials/dataList.html',
             controller: 'resultController'
             })*/
            $routeProvider.otherwise({ redirectTo: '/input' });
        }])

    .controller('mainController', ['$scope', 'queryService',
        function ($scope, queryService) {
            var today = new Date();
            $scope.queryData = {
                phoneOrName: '',
                startDate: new Date(today.setMonth(today.getMonth() - 1)),
                endDate: new Date()
            };
            $scope.resultDataList = [];
            $scope.ListDataStatus = 'loading';
            $scope.showList = false;

            $scope.NavObj = [
                { Value: 'List', DisplayName: '列表' },
                { Value: 'Data', DisplayName: '数据' }
            ]
            $scope.ChangeList = function (value) {
                var typeName, isReadOnly;
                $scope.ActivedValue = value;
                switch (value) {
                    case 'List':
                        break;
                    case 'Data':
                        break;
                    default:
                        $scope.ActivatedValue = $scope.NavObj[0].Value;
                        break;
                }
            }
            $scope.ChangeList();

            $scope.fixedTop = false;
            function navFixedToggle() {
                document.addEventListener('scroll', ScrollHandle, false);
                var navigate = document.getElementById('navigate'),
                    navFixedTop,
                    navFixedBottom,
                    navigatePrototypeClass = navigate.className,
                    isNavFixed = false,
                    isFirstScroll = false;

                function ScrollHandle() {
                    if (!isFirstScroll) {
                        $scope.navigateHeight = navigate.offsetHeight;

                        navFixedTop = getNavigateOffsetTop();
                        navFixedBottom = getNavigateOffsetBottom();
                        isFirstScroll = true;
                    }
                    var offsetTop = document.body.scrollTop;
                    if (offsetTop >= navFixedTop) {
                        $scope.fixedTop = true;
                        //isNavFixed = true;
                        //navigate.className += ' navbar-fixed-top';
                    }
                    if (offsetTop <= navFixedBottom) {
                        $scope.fixedTop = false;
                        //isNavFixed = false;
                        //navigate.className = navigatePrototypeClass;
                    }
                    $scope.$digest();
                }

                function getNavigateOffsetTop() {
                    return navigate.offsetTop;
                }

                function getNavigateOffsetBottom() {
                    return navigate.offsetTop;
                }
            }

            navFixedToggle();

            $scope.query = function () {
                $scope.showList = true;
                $scope.ListDataStatus = 'loading';
                queryService.query({id: $scope.queryData.phoneOrName}, function (result) {
                    if (result.length > 0) {
                        $scope.ListDataStatus = 'none'
                    } else {
                        $scope.ListDataStatus = 'done'
                    }
                    $scope.resultDataList = result;
                });
            };
        }
    ])

    .directive('fixedTopNavBar', [
        function () {
            return {
                restrict: 'AE',
                require: '?ngModel',
                replace: false,
                scope: {
                    ObjectHasCustomInfo: '=ngModel',
                    save: '&',
                    isEditDetail: '=',
                    onGetEventDone: '@'
                },
                controller: ['$scope', function ($scope) {

                }],
                link: function (scope, element, attr) {

                }
            }
        }
    ])

    .factory('queryService', ['$resource',
        function ($resource) {
            return $resource('api/:action/:id', {}, {
                query: { method: 'GET', params: {action: 'query'}, isArray: true }
            })
        }
    ])