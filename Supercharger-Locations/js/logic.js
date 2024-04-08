import { API_KEY } from './config.js';  
var url = 'https://supercharge.info/service/supercharge/allSites'; 
// Create overlay layers 
var npLayer = L.layerGroup(); // Declare npLayer variable  
var NationalParksLayer = L.layerGroup(); // Declare NationalParksLayer variable
var gpsLayer = L.layerGroup(); // Declare gpsLayer variable
var gpsMarkers = []; // Define gpsMarkers array
var npMarkers = []; // Define gpsMarkers array
// Define base layers 
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {     
    attribution: '© OpenStreetMap contributors' 
});  
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {     
    attribution: '© OpenTopoMap contributors' 
});  
// Define baseMaps and overlayMaps 
var baseMaps = {     
    "Street Map": street,     
    "Topographic Map": topo 
};  
// Load National Parks data from CSV
d3.csv('/Project_3]/Archive/national_parks.csv').then(function(data) {
  data.forEach(function(park) {
    var marker = L.marker([park.lat, park.lng]);
    marker.bindPopup(`<b>${park.name}</b><br>${park.location}`);
    npMarkers.push(marker); // Add the marker to npMarkers array
    NationalParksLayer.addLayer(marker); // Add the marker to NationalParksLayer
  });
});
// Fetch data from the API using d3.json 
d3.json(url).then(function(response) {     
   // console.log(response); // Check the response data
    
    if (response && Array.isArray(response)) {
        response.forEach(function(site) {
            //console.log(site.name);
            var latLng = L.latLng(site.gps.latitude, site.gps.longitude);
            var radius = markerSize(site.stallCount);         
            var circleMarker = L.circle(latLng, {             
                stroke: false,             
                fillOpacity: 0.75,             
                color: "red",             
                fillColor: scColor(site.stallCount),             
                radius: radius,
                weight: 0.5,
                opacity: 0.5
            });
            // Bind a popup to the circleMarker
            circleMarker.bindTooltip(`<strong>Place: </strong> ${site.name}<br><strong>Stall Count: </strong>${site.stallCount}`);
            // Add the circleMarker to the gpsMarkers array
            gpsMarkers.push(circleMarker);     
        });

        gpsMarkers.forEach(function(marker) {
            gpsLayer.addLayer(marker); // Add each circleMarker to gpsLayer
        });
        var overlayMaps = {     
            "SuperChargers": gpsLayer, // Use the gpsLayer variable defined inside the d3.json block
            "National Parks": NationalParksLayer // Add NationalParksLayer to overlayMaps after it's assigned
        }; 
        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    } else {
        console.log("Response data is not in the expected format or is empty.");
    }
});  
// Create the map and add Layer Control 
let myMap = L.map("map", {     
    center: [37.09, -95.71],     
    zoom: 5,     
    layers: [topo] // Set the default base layer 
});  
