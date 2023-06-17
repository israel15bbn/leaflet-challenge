// 1
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// 2
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 4
});

// 3
var tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
}).addTo(myMap);

// 4
var earthquakes = L.layerGroup().addTo(myMap);

// 5
d3.json(queryUrl).then(function(data) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>" +
        "</h3><hr><p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");
    }
  }).addTo(earthquakes);

  // 6
  function getColor(depth) {
    if (depth > 90) {
      return "#FF0000";
    } else if (depth > 70) {
      return "#FF4500";
    } else if (depth > 50) {
      return "#FF8C00";
    } else if (depth > 30) {
      return "#FFA500";
    } else if (depth > 10) {
      return "#FFFF00";
    } else {
      return "#ADFF2F";
    }
  }

  // 7
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = [];

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
              '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
              depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
          }
          return div;
        };
      
        // 8
        legend.addTo(myMap);
      
      });
