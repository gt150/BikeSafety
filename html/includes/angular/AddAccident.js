function mixin(a, b) {
    for (var p in b) {
        a[p] = b[p];
    }

    return a;
}

function person(extra) {
    return mixin({
      age: 'Unknown',
      alcohol: 'Unknown',
      injury: 'Unknown',
      race: 'Unknown',
      sex: 'Unknown'
    }, extra);
}

function submitCrash(result, data) {
    var crashTemplate = {
        biker: person({
            direction: 'Unknown',
            position: 'Unknown'
        }),
        driver: person({
            estimated_speed: 'Unknown',
            vehicle_type: 'Unknown'
        }),
        crash: {
            ambulence: 'Unknown',
            group: 'Unknown',
            hit_and_run: 'Unknown',
            light_conditions: 'Unknown',
            location: 'Unknown',
            road_conditions: 'Unknown',
            road_defects: 'Unknown',
            timestamp: 'Unknown',
            type: 'Unknown',
            weather: 'Unknown',
            workzone: 'Unknown'
        },
        location: {
            characteristics: 'Unknown',
            city: 'Durham',
            class: 'Unknown',
            configuration: 'Unknown',
            county: 'Durham',
            development: 'Unknown',
            feature: 'Unknown',
            lanes: 'Unknown',
            latitude: 'Unknown',
            locality: 'Unknown',
            longitude: 'Unknown',
            region: 'Unknown',
            rural_urban: 'Unknown',
            speed_limit: 'Unknown',
            surface: 'Unknown',
            traffic_control: 'Unknown'
        }
    };

    for (cat in data) {
        mixin(crashTemplate[cat], data[cat]);
    }

    var crash = result.db.push();
    crash.set(crashTemplate);
}

// TODO add deafult 'unknown' value to all the comboboxes.
angular.module('BikeSafety').controller('addAccidentController', ['$scope','$location','getCrashesUserSubmitted','datasetSettings',
function ($scope, $location, getCrashesUserSubmitted, datasetSettings) {
  $scope.questions = datasetSettings;

  $scope.ambulancer = "Unknown";
  $scope.weather = "Unknown";
  $scope.bike_injur = "Unknown";
  $scope.bike_sex = "Unknown";
  $scope.bike_race = "Unknown";
  $scope.bike_alc_d = "Unknown";
  $scope.drvr_injur = "Unknown";
  $scope.drvr_sex = "Unknown";
  $scope.drvr_race = "Unknown";
  $scope.drvr_estsp = "Unknown";
  $scope.drvr_alc_d = "Unknown";
  $scope.center = {
    lat: 35.9886,
    lng: -78.9072,
    zoom: 15
  };
  $scope.markers = {
    Location: {
      lat: 35.9886,
      lng: -78.9072,
      message: "Crash location",
      focus: true,
      draggable: true
    }
  };
  $scope.layers = {
    baselayers: {
      xyz: {
        name: "CartoDB",
        url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        type: "xyz"
      }
    }
  };

  var updatePosition = function(position) {
    $scope.lookingUpLocation = false;
    $scope.center.lat = position.coords.latitude;
    $scope.center.lng = position.coords.longitude;
    $scope.markers.Location.lat = position.coords.latitude;
    $scope.markers.Location.lng = position.coords.longitude;
    $scope.$apply();
  };
  var showPositionError = function(err) {
    $scope.lookingUpLocation = false;
    $scope.positionError = true;
  };
  if (navigator.geolocation) {
    $scope.lookingUpLocation = true;
    navigator.geolocation.getCurrentPosition(updatePosition,showPositionError);
  }

  $scope.addAccident = function() {
    // TODO show some kind of status notification, maybe redirect to the map
    // when the new accident has been added.
    var dataset;
    getCrashesUserSubmitted.then(function(result) {
        submitCrash(result, {
            biker: {
                injury: $scope.bike_injur,
                sex: $scope.bike_sex,
                race: $scope.bike_race,
                alcohol: $scope.bike_alc_d
            },
            driver: {
                injury: $scope.drvr_injur,
                sex: $scope.drvr_sex,
                race: $scope.drvr_race,
                estimated_speed: $scope.drvr_estsp,
                alcohol: $scope.drvr_alc_d
            },
            crash: {
                ambulance: $scope.ambulancer,
                weather: $scope.weather
            },
            location: {
                latitude: $scope.markers.Location.lat,
                longitude: $scope.markers.Location.lng
            }
        });
        $scope.accidentPosted = true;
    });
  };
}]);
