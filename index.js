'use strict';

const express = require('express');
const cors = require('cors');
const zlib = require('zlib');
const toVT = require('./geojson-to-vt');
const app = express();
let geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -112.1484375,
              35.460669951495305
            ],
            [
              -87.890625,
              30.44867367928756
            ],
            [
              -95.97656249999999,
              43.58039085560784
            ],
            [
              -112.1484375,
              35.460669951495305
            ]
          ]
        ]
      }
    }
  ]
};
let tileIndex = toVT.convert(geojson);

app.use(cors());
app.use(express.static('public'));

app.get('/:z/:x/:y.vector.pbf', (req, res) => {
  let { z, x, y } = req.params;
  let vt = toVT.find(tileIndex, z, x, y);

  if (!vt) {
    return res.sendStatus(404);
  }
  
  zlib.gzip(vt, function(err, pbf) {
    if (err) {
      return res.status(500).json(err);
    }

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Cache-Control': 'public, max-age=604800',
      'Content-Type': 'application/x-protobuf',
      'Content-Encoding': 'gzip'
    });

    res.send(pbf);
  });
});



// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});