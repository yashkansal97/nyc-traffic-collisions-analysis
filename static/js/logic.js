// Create our map
var myMap = L.map("map", {
    center: [40.730610, -73.935242],
    zoom: 10
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch from SQL database
// d3.json('http://127.0.0.1:5000/data').then(function(data) {
d3.json('/data').then(function(data) {
    d3.json('/boroughs').then(function(boroughs){
    
        console.log(data);
        console.log(boroughs);

        // Create a layer for the boroughs polygons
        function boroughPolygons(){
            let features = boroughs['features'];
            let geojsonLayer = L.geoJSON(features,{
            'style': {'color': 'yellow'}
            })
            geojsonLayer.addTo(myMap)
        }
        boroughPolygons()

        // Create a new marker cluster group.
        function createMarkers(){
            let markerClusters = L.markerClusterGroup();
            data.forEach((collision) => {
                if (collision.latitude != null){
                    var markers = L.marker([collision.latitude, collision.longitude], {
                        draggable: false,
                     });

                    markers.bindPopup("Test")
                    markerClusters.addLayer(markers)
                }
            })
            myMap.addLayer(markerClusters);
        }
        createMarkers()
            // Set the data location property to a variable.
            //var location = response.location;

            // // Check for the location property.
            // if (location) {
            // // Add a new marker to the cluster group, and bind a popup.
            // markers.addLayer(L.marker()
            //     .bindPopup());
            // }

    });
});

    // Add our marker cluster layer to the map.
    // myMap.addLayer(markers);


