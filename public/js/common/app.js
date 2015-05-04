/**
 * Created by zzzxj on 8/19/2014.
 */

'use strict';

angular.module("GZCApp", [
    "ngResource",
    "ngRoute",
    "ngDeviceDetector",
    "ui.bootstrap",
    "spinner"
])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/mobile', {
                templateUrl: 'partials/mobile_main.html',
                controller: 'mobileMainCtrl'
            })
            .when("/desktop", {
                templateUrl: 'partials/desktop_main.html',
                controller: "desktopMainCtrl"
            })
            .when("/",{
                template:"<div></div>",
                controller: "deviceDetectCtrl"
            })
            $routeProvider.otherwise({ redirectTo: '/' });
        }])

    .controller("deviceDetectCtrl",['$location','deviceDetector',function($location,deviceDetector){
        if(deviceDetector.isMobile() && !deviceDetector.isTablet()) {
            $location.path("/mobile")
        } else {
            $location.path("/desktop")
        }
    }])

    .controller('mobileMainCtrl', ['$scope', 'queryService',
        function ($scope, queryService) {
            var today = new Date();
            $scope. phoneOrName= '';
            $scope.startDate= new Date(today.getTime() - 30*24*3600*1000);
            $scope.endDate= new Date();
            
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
            $scope.query = function () {
                $scope.showList = true;
                $scope.ListDataStatus = 'loading';
                queryService.query({
                    id: $scope.phoneOrName,
                    start: $scope.startDate,
                    end: $scope.endDate
                }, function (result) {
                    //console.log(result)
                    if (result.length <= 0) {
                        $scope.ListDataStatus = 'none'
                    } else {
                        $scope.ListDataStatus = 'done'
                    }
                    $scope.resultDataList = result;
                });
            };
            //$scope.query();
        }
    ])
    .controller("desktopMainCtrl",["$scope",'queryService',function($scope,queryService){
        $scope.maxDate = new Date();
        $scope.minDate = new Date($scope.maxDate - 1000*3600*24*90);
        $scope.startDate = $scope.minDate;
        $scope.endDate = $scope.maxDate;
        $scope.format = 'yyyy-MM-dd'
        $scope.startDateOpen = false;
        $scope.endDateOpen = false;
        $scope.idNum = null;

        $scope.open = function($event, which) {
            $event.preventDefault();
            $event.stopPropagation();
            if(which == 'start') {
                $scope.startDateOpen = true;
            } else {
                $scope.endDateOpen = true;
            }
        }
        $scope.results = [];

        $scope.query = function() {
            if(!$scope.idNum) {
                return;
            }
            $scope.loadStatus = 'loading';
            queryService.query({
                id: $scope.idNum,
                start: $scope.startDate,
                end: $scope.endDate
            }, function(results){
                if(results.length > 0) {
                    $scope.results = flatten(results);
                    $scope.loadStatus = 'done';
                } else {
                    $scope.results = [];
                    $scope.loadStatus = 'none';
                }
            })
        }

        function flatten(results) {
            var ret = [];
            var index = 0;
            var rowindex = 0;
            for(index=0;index<results.length;index++) {
                ret.push({
                    tax_bill_id: results[index].tax_bill_id,
                    tax_total: results[index].tax_total,
                    rows : results[index].orders.length,
                    order_id: results[index].orders[0].order_id,
                    status: results[index].orders[0].status,
                    freight_id:results[index].orders[0].freight_id,
                    last_updated: results[index].orders[0].last_updated
                });
                if(results[index].orders.length > 1) {
                    for(rowindex=1; rowindex < results[index].orders.length; rowindex++) {
                        ret.push({
                            order_id: results[index].orders[rowindex].order_id,
                            status: results[index].orders[rowindex].status,
                            freight_id: results[index].orders[rowindex].freight_id,
                            last_updated: results[index].orders[rowindex].last_updated
                        })
                    }
                }
            }
            return ret;
        }
    }])

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
    ]);

angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
    .factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

        var $transition = function (element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

            var transitionEndHandler = function (event) {
                $rootScope.$apply(function () {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            };

            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }

            // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
            $timeout(function () {
                if (angular.isString(trigger)) {
                    element.addClass(trigger);
                } else if (angular.isFunction(trigger)) {
                    trigger(element);
                } else if (angular.isObject(trigger)) {
                    element.css(trigger);
                }
                //If browser does not support transitions, instantly resolve
                if (!endEventName) {
                    deferred.resolve(element);
                }
            });

            // Add our custom cancel function to the promise that is returned
            // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
            // i.e. it will therefore never raise a transitionEnd event for that transition
            deferred.promise.cancel = function () {
                if (endEventName) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject('Transition cancelled');
            };

            return deferred.promise;
        };

        // Work out the name of the transitionEnd event
        var transElement = document.createElement('trans');
        var transitionEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var animationEndEventNames = {
            'WebkitTransition': 'webkitAnimationEnd',
            'MozTransition': 'animationend',
            'OTransition': 'oAnimationEnd',
            'transition': 'animationend'
        };

        function findEndEventName(endEventNames) {
            for (var name in endEventNames) {
                if (transElement.style[name] !== undefined) {
                    return endEventNames[name];
                }
            }
        }

        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    }]);
angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

    .directive('collapse', ['$transition', function ($transition) {

        return {
            link: function (scope, element, attrs) {

                var initialAnimSkip = true;
                var currentTransition;

                function doTransition(change) {
                    var newTransition = $transition(element, change);
                    if (currentTransition) {
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);
                    return newTransition;

                    function newTransitionDone() {
                        // Make sure it's this transition, otherwise, leave it alone.
                        if (currentTransition === newTransition) {
                            currentTransition = undefined;
                        }
                    }
                }

                function expand() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        element.removeClass('collapse').addClass('collapsing');
                        doTransition({ height: element[0].scrollHeight + 'px' }).then(expandDone);
                    }
                }

                function expandDone() {
                    element.removeClass('collapsing');
                    element.addClass('collapse in');
                    element.css({ height: 'auto' });
                }

                function collapse() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        collapseDone();
                        element.css({ height: 0 });
                    } else {
                        // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                        element.css({ height: element[0].scrollHeight + 'px' });
                        //trigger reflow so a browser realizes that height was updated from auto to a specific value
                        var x = element[0].offsetWidth;

                        element.removeClass('collapse in').addClass('collapsing');

                        doTransition({ height: 0 }).then(collapseDone);
                    }
                }

                function collapseDone() {
                    element.removeClass('collapsing');
                    element.addClass('collapse');
                }

                scope.$watch(attrs.collapse, function (shouldCollapse) {
                    if (shouldCollapse) {
                        collapse();
                    } else {
                        expand();
                    }
                });
            }
        };
    }]);
angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse', "template/accordion/accordion.html", "template/accordion/accordion-group.html"])

    .constant('accordionConfig', {
        closeOthers: true
    })

    .controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

        // This array keeps track of the accordion groups
        this.groups = [];

        // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
        this.closeOthers = function (openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
            if (closeOthers) {
                angular.forEach(this.groups, function (group) {
                    if (group !== openGroup) {
                        group.isOpen = false;
                    }
                });
            }
        };

        // This is called from the accordion-group directive to add itself to the accordion
        this.addGroup = function (groupScope) {
            var that = this;
            this.groups.push(groupScope);

            groupScope.$on('$destroy', function (event) {
                that.removeGroup(groupScope);
            });
        };

        // This is called from the accordion-group directive when to remove itself
        this.removeGroup = function (group) {
            var index = this.groups.indexOf(group);
            if (index !== -1) {
                this.groups.splice(index, 1);
            }
        };

    }])

    // The accordion directive simply sets up the directive controller
    // and adds an accordion CSS class to itself element.
    .directive('accordion', function () {
        return {
            restrict: 'EA',
            controller: 'AccordionController',
            transclude: true,
            replace: false,
            templateUrl: 'template/accordion/accordion.html'
        };
    })

    // The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    .directive('accordionGroup', function () {
        return {
            require: '^accordion',         // We need this directive to be inside an accordion
            restrict: 'EA',
            transclude: true,              // It transcludes the contents of the directive into the template
            replace: true,                // The element containing the directive will be replaced with the template
            templateUrl: 'template/accordion/accordion-group.html',
            scope: {
                heading: '@',               // Interpolate the heading attribute onto this scope
                subHeading: '@',
                isOpen: '=?',
                isDisabled: '=?'
            },
            controller: function () {
                this.setHeading = function (element) {
                    this.heading = element;
                };
            },
            link: function (scope, element, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);

                scope.$watch('isOpen', function (value) {
                    if (value) {
                        accordionCtrl.closeOthers(scope);
                    }
                });

                scope.toggleOpen = function () {
                    if (!scope.isDisabled) {
                        scope.isOpen = !scope.isOpen;
                    }
                };
            }
        };
    })

    // Use accordion-heading below an accordion-group to provide a heading containing HTML
    // <accordion-group>
    //   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
    // </accordion-group>
    .directive('accordionHeading', function () {
        return {
            restrict: 'EA',
            transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true,
            require: '^accordionGroup',
            link: function (scope, element, attr, accordionGroupCtrl, transclude) {
                // Pass the heading to the accordion-group controller
                // so that it can be transcluded into the right place in the template
                // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
                accordionGroupCtrl.setHeading(transclude(scope, function () {
                }));
            }
        };
    })

    // Use in the accordion-group template to indicate where you want the heading to be transcluded
    // You must provide the property on the accordion-group controller that will hold the transcluded element
    // <div class="accordion-group">
    //   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
    //   ...
    // </div>
    .directive('accordionTransclude', function () {
        return {
            require: '^accordionGroup',
            link: function (scope, element, attr, controller) {
                scope.$watch(function () {
                    return controller[attr.accordionTransclude];
                }, function (heading) {
                    if (heading) {
                        element.html('');
                        element.append(heading);
                    }
                });
            }
        };
    });
angular.module("template/accordion/accordion.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/accordion/accordion.html",
        "<div class=\"card-group\" ng-transclude></div>");
}]);
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html",
            "<div class=\"card\">\n" +
            "  <div class=\"card-header\">\n" +
            "   <div class=\"card-title\">" +
            "    <h4>\n" +
            "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\" style='display: block;'>" +
            "       <span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
            "    </h4>\n" +
            "    <span ng-if=\"!!subHeading\" class=\"ps10 text-muted\">{{subHeading}}</span>" +
            "    </div>\n" +
            "  </div>\n" +
            "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
            "	  <div class=\"panel-body\" ng-transclude style='padding: 0px;'></div>\n" +
            "  </div>\n" +
            "</div>");
}]);
