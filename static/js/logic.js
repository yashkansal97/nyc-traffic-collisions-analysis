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
d3.json('http://localhost:5000/data').then(function(data) {
    
    console.log(data);


    // Create a new marker cluster group.
    //var markers = L.markerClusterGroup();

    // Loop through the data.
    //data.forEach((response) => {
        // Set the data location property to a variable.
        //var location = response.location;

        // // Check for the location property.
        // if (location) {
        // // Add a new marker to the cluster group, and bind a popup.
        // markers.addLayer(L.marker()
        //     .bindPopup());
        // }

    });

    // Add our marker cluster layer to the map.
    // myMap.addLayer(markers);


