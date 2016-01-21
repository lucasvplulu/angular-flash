/*! angular-flash - v2.0.0 - 2016-01-21
* https://github.com/sachinchoolur/angular-flash
* Copyright (c) 2016 Sachin; Licensed MIT */
'use strict';

/*! angular-flash - v2.0.0 - 2016-01-17
 * https://github.com/sachinchoolur/angular-flash
 * Copyright (c) 2016 Sachin; Licensed MIT */

var app = angular.module('flash', []);

app.run(['$rootScope', function ($rootScope) {
    return $rootScope.flashes = [];
}]);

app.directive('dynamic', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function link(scope, ele, attrs) {
            return scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                return $compile(ele.contents())(scope);
            });
        }
    };
}]);

app.directive('closeFlash', ['$compile', '$rootScope', 'Flash', function ($compile, $rootScope, Flash) {
    return {
        link: function link(scope, ele, attrs) {
            var index = undefined;
            index = parseInt(attrs.closeFlash, 10);
            return ele.on('click', function () {
                Flash.dismiss(index);
                $rootScope.$apply();
            });
        }
    };
}]);

app.directive('flashMessage', ['Flash', function (Flash) {
    return {
        restrict: 'E',
        scope: {
            duration: '=duration'
        },
        template: '<div ng-show="$root.flashes.length > 0"><div role="alert" ng-repeat="flash in $root.flashes track by $index" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash="{{$index}}"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div></div>',
        link: function link(scope, ele, attrs) {
            Flash.setDefaultTimeout(scope.duration);
        }
    };
}]);

app.factory('Flash', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    var dataFactory = {};
    dataFactory.setDefaultTimeout = function (timeout) {
        dataFactory.defaultTimeout = timeout;
    };
    dataFactory.getDefaultTimeout = function () {
        return dataFactory.defaultTimeout;
    };
    dataFactory.create = function (type, text, timeout, addClass) {
        var $this = undefined,
            flash = undefined;
        $this = this;
        flash = {
            type: type,
            text: text,
            addClass: addClass
        };
        if (dataFactory.defaultTimeout && (typeof timeout === 'undefined' || timeout === 0)) {
            flash.timeout = dataFactory.defaultTimeout;
        } else if (timeout) {
            flash.timeout = timeout;
        }
        $rootScope.flashes.push(flash);
        if (flash.timeout) {
            flash.timeoutObj = $timeout(function () {
                $this.dismiss($rootScope.flashes.length - 1);
            }, flash.timeout);
        }
    };
    dataFactory.pause = function (index) {
        if ($rootScope.flashes[index].timeoutObj) {
            $timeout.cancel($rootScope.flashes[index].timeoutObj);
        }
    };
    dataFactory.dismiss = function (index) {
        dataFactory.pause(index);
        $rootScope.flashes.splice(index, 1);
        $rootScope.$digest();
    };
    dataFactory.clear = function () {
        while ($rootScope.flashes.length > 0) {
            dataFactory.dismiss(0);
        }
    };
    dataFactory.reset = dataFactory.clear;
    return dataFactory;
}]);
//# sourceMappingURL=angular-flash.js.map
