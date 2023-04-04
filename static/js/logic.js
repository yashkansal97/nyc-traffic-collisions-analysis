
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

                    markers.bindPopup(`No. of Persons Injuried: ${collision.number_of_persons_injured} <br> 
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
        let borough_names = ['STATEN ISLAND', 'BROOKLYN', 'QUEENS', 'BRONX', 'MANHATTAN'];

        function boroughCount(borough_name){
            let count = 0;

            data.forEach((collision) => {
                if (collision.borough == borough_name){
                    count += 1;
                };
            });
            return count;
        };

        let countStaten = boroughCount("STATEN ISLAND");
        let countBrooklyn = boroughCount("BROOKLYN");
        let countQueens = boroughCount("QUEENS");
        let countBronx = boroughCount("BRONX");
        let countManhattan = boroughCount("MANHATTAN");

        let countArray = [countStaten, countBrooklyn, countQueens, countBronx, countManhattan]

        console.log(countArray)

        var barData = [{
            type: 'bar',
            x: borough_names,
            y: countArray
          }];
        var barLayout = {
            title: "Borough Injuries",
            yaxis: {title: "Number of People Injured in Feb 2023"}};
          Plotly.newPlot("bar", barData, barLayout);

        // Create line chart
        var injuries = []
        data.forEach((collision) => {
            if (collision.crash_time && collision.number_of_persons_injured) {
                injuries.push({
                    time: collision.crash_time,
                    ppl_injuried: collision.number_of_persons_injured
                })
            }
        });
        function injuryCount(injuries, hour) {
            var count = 0;
            for (var i = 0; i < injuries.length; i++) {
                var time = injuries[i].time;
                if (time == hour){
                    count += 1;
                }
            }
            return count;
        };
        var injuryHourCount = []
        for (var i = 0; i < 24; i++) {
            injuryHourCount[i] = injuryCount(injuries, i)
        }
        var trace_l =[{
            x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            y: injuryHourCount,
            type: "line"
        }]
        var line_layout = {
            title: "Injuries at Each Hour of the Day",
            xaxis: {title: "Hour"},
            yaxis: {title: "Number of People Injured"}
        };
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("line", trace_l, line_layout);  
    });
});


