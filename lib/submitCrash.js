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

function submitCrash(crashDB, table, data) {
    var Firebase = require('firebase');
    var bikeSafetyDB = new Firebase(crashDB);
    var crashDB = bikeSafetyDB.child(table);
    var crash = crashDB.push();

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
            city: 'Unknown',
            class: 'Unknown',
            configuration: 'Unknown',
            county: 'Unknown',
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

    crash.set(crashTemplate);
}

module.exports = submitCrash;

submitCrash('https://bikesafety.firebaseio.com', 'CrashesUserSubmitted_Sanitized', {
    biker: {age: 15},
    location: {city: "Durham"}
});
