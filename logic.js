var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function markerSize(magnitude) {return magnitude * 4;};

var earthquakes = new L.LayerGroup();

d3.json(quakes, function (geoJson) {
  L.geoJSON(geoJson.features, {
      pointToLayer: function (geoJsonPoint, latlng) {
          return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
      },

      style: function (geoJsonFeature) {
          return {
              fillColor: Color(geoJsonFeature.properties.mag),
              fillOpacity: 0.7,
              weight: 0.1,
              color: 'black'
          }
      },

      onEachFeature: function (feature, layer) {
          layer.bindPopup(
              "<h4 style='text-align:center;'>" + feature.id +
              "</h4><hr><h5 style='text-align:center;'>" + feature.properties.title + 
              "</h5><hr><h3 style='text-align:center;'>" + feature.geometry.coordinates + "</h3>"
              );
      }
  }).addTo(earthquakes);
  createMap(earthquakes);
});

function Color(magnitude) {
  if (magnitude > 5) {
      return 'red'
  } else if (magnitude > 4) {
      return 'darkorange'
  } else if (magnitude > 3) {
      return 'tan'
  } else if (magnitude > 2) {
      return 'yellow'
  } else if (magnitude > 1) {
      return 'darkgreen'
  } else {
      return 'lightgreen'
  }
};

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?" + "access_token="+API_KEY, {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.high-contrast',
    accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
  });

  var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1Ijoib2xhd3JlbmNlNzk5IiwiYSI6ImNqZXZvcTBmdDBuY3oycXFqZThzbjc5djYifQ.-ChNrBxEIvInNJWiHX5pXg'
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "High Contrast": highContrastMap,
    "Satellite" : satellite  
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
}



  