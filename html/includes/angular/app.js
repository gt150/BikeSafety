var OCEM = angular.module('BikeSafety', ['ngRoute', 'ui.bootstrap', 'ui.mask','firebase', 'leaflet-directive']);

OCEM.constant('_',window._);

OCEM.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        templateUrl: '/partials/MainMap',
        controller: 'mapController'
    })
    .when('/addAccident', {
        templateUrl: '/partials/AddAccident',
        controller: 'addAccidentController'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

function makeMapColoredLinearly(arr,fromColor,toColor) {
  var result = {};
  var arrayColorsFunction = d3.scale.linear()
      .domain([0,arr.length-1])
      .interpolate(d3.interpolateRgb)
      .range([fromColor,toColor]);
  _.forEach(arr,function(val,index) {
      result[val] = arrayColorsFunction(index);
  });
  return result;
}

OCEM.service('datasetSettings', function() {
    var injuries = [
        'Unknown',
        'O: No Injury',
        'A: Disabling Injury',
        'B: Evident Injury',
        'C: Possible Injury',
        'K: Killed'
    ];
    var races = [
        'Unknown',
        'Asian',
        'Black',
        'Hispanic',
        'White',
        'Other'
    ];
    var genders = [ 'Unknown', 'Female', 'Male' ];
    var booleanColorsFunction = function(d) {
        var booleanColors = {
            Male: '#FA6019',
            Female: '#4E98C6',
            No: '#FA6019',
            Yes: '#4E98C6',
            Unknown: '#AFAF6E',
            Missing: '#AFAF6E', // TODO when we clean up the data, this can go away
            "": '#AFAF6E' // TODO when we clean up the data, this can go away
        };
        return booleanColors[d];
    };
    var speeds = [
        'Unknown',
        '',
        '0-5 mph',
        '6-10 mph',
        '11-15 mph',
        '16-20 mph',
        '21-25 mph',
        '26-30 mph',
        '31-35 mph',
        '36-40 mph',
        '41-45 mph',
        '46-50 mph',
        '51-55 mph',
        '56-60 mph'
    ];
    var speedColorMap = makeMapColoredLinearly(speeds.slice(2),colorbrewer.PuBu[9][0],colorbrewer.PuBu[9][8]);
    // TODO when the data is cleaned up this can go away
    speedColorMap.Unknown = '#AFAF6E';
    speedColorMap[''] = '#AFAF6E';
    var speedColorsFunction = function(d) {
        return speedColorMap[d];
    };

    // The key names listed below match the column names in the Firebase table:
    //
    // The keys for each data item are used to render the legend on the map, and
    // to populate the options on the 'add accident' page.
    //
    // Key details:
    //   description:
    //   type: Used to determine how to render the add accident form
    //   options: For 'list' types, the list of valid options.
    //   colors: A function that maps a value to a color. Used by the D3 library
    //     to pick the color of the data point (and render the legend). If not
    //     provided category10 is used.
    return {
        bike_injur: {
            description: 'Bicyclist Injury',
            type: 'list',
            options: injuries
        },
        bike_sex: {
            description: 'Bicyclist Gender',
            type: 'list',
            options: genders,
            colors: booleanColorsFunction
        },
        ambulancer: {
            description: 'Ambulance Called',
            type: 'boolean',
            colors: booleanColorsFunction
        },
        bike_alc_d: {
            description: 'Bicyclist Drunk',
            type: 'boolean',
            colors: booleanColorsFunction
        },
        bike_pos: {
            description: 'Bicyclist Location'
        },
        bike_race: {
            description: 'Bicyclist Race',
            type: 'list',
            options: races
        },
        drvr_alc_d: {
            description: 'Driver Drunk',
            type: 'boolean',
            colors: booleanColorsFunction
        },
        drvr_estsp: {
            description: 'Driver Speed',
            type: 'list',
            options: speeds,
            colors: speedColorsFunction
        },
        drvr_injur: {
            description: 'Driver Injury',
            type: 'list',
            options: injuries
        },
        drvr_race: {
            description: 'Driver Race',
            type: 'list',
            options: races
        },
        drvr_sex: {
            description: 'Driver Gender',
            type: 'list',
            options: genders,
            colors: booleanColorsFunction
        },
        weather: {
            description: 'Weather',
            type: 'list',
            options: [
                'Unknown',
                'Clear',
                'Cloudy',
                'Rain'
            ]
        }
    };
});

OCEM.service('getPaths', function($http) {
    return $http.get('/data/durham-bike-lanes.topojson');
});

OCEM.service('getCrashes', function($q, $firebase) {
    $('#pleaseWaitDialog').modal('show');
    var deferred = $q.defer();
    var ref = new Firebase('https://bikesafety.firebaseio.com/Crashes');
    ref.once('value', function(snapshot){
        deferred.resolve(snapshot.val());
        $('#pleaseWaitDialog').modal('hide');
    });
    return deferred.promise;
});

OCEM.service('getCrashesUserSubmitted', function($q, $firebase) {
    $('#pleaseWaitDialog').modal('show');
    var deferred = $q.defer();
    var ref = new Firebase('https://bikesafety.firebaseio.com/CrashesUserSubmitted');
    ref.once('value', function(snapshot){
        deferred.resolve({
          data: _.values(snapshot.val()),
          db: ref
        });
        $('#pleaseWaitDialog').modal('hide');
    });
    return deferred.promise;
});

OCEM.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(request) {
                if (request.method === 'GET') {
                    if (request.url.indexOf('.') === -1) {
                        var sep = request.url.indexOf('?') === -1 ? '?' : '&';
                        request.url = request.url + sep + 'cacheBust=' + new Date().getTime();
                    }
                }
                return request;
            }
        };
    });
}]);

OCEM.controller('headerController', ['$scope','$location',function($scope, $location) {
    $scope.paths = {
        '/': {
            label: 'Add Accident',
            next: '/addAccident'
        },
        '/addAccident': {
            label: 'View Map',
            next: '/'
        }
    };
    $scope.label = $scope.paths[$location.path()].label;
    $scope.togglePage = function() {
        $location.path($scope.paths[$location.path()].next);
        $scope.label = $scope.paths[$location.path()].label;
    };
}]);
