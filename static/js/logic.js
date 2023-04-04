
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
            'style': {'color': 'gold'}
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

                    markers.bindPopup(`No. of Persons Injuried: ${collision.number_of_persons_injuried} <br> 
                                    No. of Persons Killed: ${collision.number_of_persons_killed} <br> 
                                    Crash Date: ${moment(collision.crash_date).format("dddd, MMMM Do YYYY")} <br> 
                                    Crash Time: ${collision.crash_time}`)
                    markerClusters.addLayer(markers)
                }
            })
            myMap.addLayer(markerClusters);
        }
        createMarkers()

        // Create bar chart


    });
});


