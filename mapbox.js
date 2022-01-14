mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// First example
const map = new mapboxgl.Map(
  {
    container: 'map',  // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
  }
);

// ----------------------------------------------------------------------------------
// Second example
const naturalEarth = new mapboxgl.Map(
  {
    container: 'naturalEarth',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 0],
    zoom: 0.6,
    projection: 'naturalEarth'
  }
);

// ------------------------------------------------------------------------------------
// Example with geoLocation
const geoLocation = new mapboxgl.Map({
  container: 'geoLocation',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.4512, 43.6568],
  zoom: 8
});

const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );

  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      place_name: 'Lat: ' + lat + ' Lng: ' + lng,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature',
    };
  }

  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];

  if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  return geocodes;
};

// Add the control to the map.
geoLocation.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    localGeocoder: coordinatesGeocoder,
    zoom: 4,
    placeholder: 'Try: -40, 170',
    mapboxgl: mapboxgl,
    reverseGeocode: true
  })
)

// Points on a map

const pointsOnMap = new mapboxgl.Map({
  container: 'pointsOnMap',
  style: 'mapbox://styles/examples/cjgiiz9ck002j2ss5zur1vjji',
  center: [-87.661557, 41.893748],
  zoom: 10.7
});

pointsOnMap.on('click', (event) => {
  const features = pointsOnMap.queryRenderedFeatures(event.point, {
    layers: ['chicago-parks']
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];

  const popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
    )
    .addTo(pointsOnMap);
});

