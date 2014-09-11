/**
 * Created by zzzxj on 8/24/2014.
 */

'use strict';
angular.module('common.service.module', [])
    .factory('fetchDataService', ['$resource',
        function ($resource) {
            return $resource('api/fetchData/:action', {}, {
                fetch: { method: 'POST', params: {action: 'fetch'}, isArray: false },
                query: { method: 'GET', params: {action: 'query'}, isArray: false },
                save: { method: 'POST', params: {action: 'save'} },
                destroy: { method: 'POST', params: {action: 'destroy'} }
            })
        }
    ])

    .factory('SelectHelper', [
        function () {
            return function () {
                //Select helper would return the selected list
                //Usage that in controller: $scope.SelectHelper = new SelectHelper();
                //Usage that in html: <input type="checkbox" ng-click="SelectHelper.ToggleSelectedAll(ListData)" />
                var selectedList = []

                this.SelectedAll = false
                this.HadSelect = false;
                this.ToggleSelected = function (item) {
                    if (!!!item.isSelected) {
                        item.isSelected = true;
                        selectedList.push(item)
                        this.HadSelect = true
                    } else {
                        var index = selectedList.indexOf(item)
                        item.isSelected = false;
                        selectedList.splice(index, 1)
                        if (selectedList.length == 0) this.HadSelect = false
                    }
                }
                this.ToggleSelectedAll = function (currListData) {
                    this.SelectedAll = !this.SelectedAll;
                    if (this.SelectedAll) {
                        selectedList = [].concat(currListData);
                        for (var i in currListData) {
                            currListData[i].isSelected = true;
                        }
                        this.HadSelect = true
                    } else {
                        for (var i in currListData) {
                            delete currListData[i].isSelected;
                        }
                        selectedList = [];
                        this.HadSelect = false
                    }
                }
                this.GetSelectedIds = function () {
                    var DeleteProjectIdList = [];
                    for (var i in selectedList) {
                        DeleteProjectIdList.push(selectedList[i].Id);
                    }
                    return DeleteProjectIdList;
                }
                this.GetSelectedList = function () {
                    for (var i in selectedList) {
                        delete selectedList[i].isSelected;
                    }
                    return selectedList;
                }
            }
        }
    ])
    .factory('socket', function ($rootScope) {
        var socket = io.connect('http://localhost:3001');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        }
    })

