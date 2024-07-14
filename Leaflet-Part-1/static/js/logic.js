// Store our API endpoint as queryUrl.
let queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL.
d3.json(queryUrl).then(
  // 1. Pass the features to a createFeatures() function:
  createFeatures
);

// Function to get color for earthquakes depth
function getColor(d) {
  return d > 90
    ? "#523787" // Dark purple color
    : d > 70
    ? "#734b9e" // Darker purple color
    : d > 50
    ? "#c35e9c" // Light purple color
    : d > 30
    ? "#f3749a" // Pink color
    : d > 10
    ? "#fca087" // Light Pink color
    : "#fddbb3"; // Light peach/beige color
}

// 2.
function createFeatures(earthquakeData) {
  // Log the response to ensure data is being fetched correctly
  console.log("API response:", earthquakeData);
  // Pull the 'features' property from earthquakeData.
  let features = earthquakeData.features;
  // Log the 'features' data to verify the extraction
  console.log("Features data:", features);
  // Initialise an array to hold the earthquake markers.
  let quakeMarkers = [];
  // Loop through the features array.
  for (let index = 0; index < features.length; index++) {
    let feature = features[index];
    // Log each earthquake's data to understand its structure
    console.log("Earthquake data:", feature);
    // For each earthquake, create a marker, and bind a popup with the earthquake's magnitude, location, and depth.
    let quakeMarker = L.circle(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {
        radius: feature.properties.mag * 50000,
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: 1,
        color: "black",
        weight: 1,
      }
    ).bindPopup(
      "<p>Magnitude: " +
        feature.properties.mag +
        "<p><p>Location: " +
        feature.properties.title +
        "<p><p>Depth: " +
        feature.geometry.coordinates[2] +
        "</p>"
    );
    // Add the marker to the quakeMarkers array.
    quakeMarkers.push(quakeMarker);
  }
  // Log the quakeMarkers array to check the markers.
  console.log("Quake markers array:", quakeMarkers);
  // Pass the earthquake data to a createMap() function.
  createMap(L.layerGroup(quakeMarkers));
}

// 3. createMap() takes the earthquake data and incorporates it into the visualization:
function createMap(earthquakes) {
  // Log the earthquakes layer to verify the layer group
  console.log("Creating map with earthquakes:", earthquakes);
  // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  // Create an overlayMaps object to hold the earthquakes layer.
  let overlayMaps = {
    earthquakes: earthquakes,
  };
  // Create the map object with options.
  let myMap = L.map("map", {
    // Position map to show the Asia, Africa, and Australia continents.
    center: [0, 100],
    zoom: 3,
    layers: [street, earthquakes],
  });
  // Set up the legend.
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      magnitudes = [-10, 10, 30, 50, 70, 90],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(magnitudes[i] + 1) +
        '"></i> ' +
        magnitudes[i] +
        (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }

    return div;
  };
  // Adding the legend to the map
  legend.addTo(myMap);
}
