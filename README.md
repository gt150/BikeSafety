Overview
--------

A [demo is here](http://desolate-garden-4742.herokuapp.com/).

TODO
====

[![Stories in Backlog](https://badge.waffle.io/bikesafety/bikesafety.svg?label=backlog&title=Backlog)](http://waffle.io/bikesafety/bikesafety).
[![Stories in Ready](https://badge.waffle.io/bikesafety/bikesafety.svg?label=ready&title=Ready)](http://waffle.io/bikesafety/bikesafety).

Run
===

    npm install
    npm start

TopoJSON
========

The frontend application uses [TopoJSON](https://github.com/mbostock/topojson)
to render paths. If the source geojson is updated then the topojson needs to be
updated too.

To convert the geojson file to topojson:

    ./node_modules/.bin/topojson -p BIKE_FACIL --id-property OBJECTID_12 html/src/data/durham-bike-lanes.geojson > html/src/data/durham-bike-lanes.topojson

