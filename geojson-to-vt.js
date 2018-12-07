'use strict';

const vtpbf = require('vt-pbf');
const geojsonVt = require('geojson-vt');

exports.convert = function convert(geojson) {
  let tileindex = geojsonVt(geojson);

  return tileindex;
};

exports.find = function (tileindex, z, x, y) {
  let tile = tileindex.getTile(Number(z), Number(x), Number(y));
  let buff;

  if (tile) {
    // pass in an object mapping layername -> tile object
    buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile });
  }

  return buff;
};
