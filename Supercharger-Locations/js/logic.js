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
d3.csv('/Project_3/Archive/national_parks.csv').then(function(data) {
  data.forEach(function(park) {
    var marker = L.marker([park.lat, park.lng]);
    marker.bindPopup(`<b>${park.name}</b><br>${park.location}`);
    marker.addTo(myMap);
    npMarkers.push(marker); // Add the marker to npMarkers array
      marker.bindPopup(`<b>${park.name}</b><br>${park.location}`);
      marker.addTo(myMap);
  });
//  NationalParksLayer = L.layerGroup(npMarkers);
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

        gpsLayer = L.layerGroup(gpsMarkers);
        gpsLayer.addTo(myMap);
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

// function createMap(supercharge) {
//     var centerCoordinates = [30.0902, 0];
//     var mapZoom = 2.2;
//     var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: 'mapbox/satellite-v9',
//         accessToken: API_KEY
//     });
//     var greyscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: 'mapbox/light-v10',
//         accessToken: API_KEY
//     }); 
//     var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: 'mapbox/outdoors-v11',
//         accessToken: API_KEY
//     });
//     var baseMaps = {
//         'Satellite': satellite,
//         'Greyscale': greyscale,
//         'Outdoors': outdoors
//     };
//     var overlayMaps = {
//         'Super Chargers': supercharge
//     };
//     var myMap = L.map('map', {
//         center: centerCoordinates,
//         zoom: mapZoom,
//         layers: [satellite, supercharge]
//     });
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(myMap); 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var stall_count = [1, 6, 9, 12, 24, 36];
        var labels = [];
        var legendInfo = "<h3>Stall Count</h3>";
        div.innerHTML = legendInfo;
        for (var i = 0; i < stall_count.length; i++) {
            labels.push('<li style="background-color:' + scColor(stall_count[i] + 1) + '"> <span>' + stall_count[i] + (stall_count[i + 1] ? '&ndash;' + stall_count[i + 1] + '' : '+') + '</span></li>');
        }
        div.innerHTML += '<ul>' + labels.join('') + '</ul>';
        
        return div;
    };
    legend.addTo(myMap);

    function markerSize(stall_count) {
        // Multiply the stall count by 200 to make the radius 200 times bigger
        return stall_count * 200;
    }
function scColor(stall_count) {
    if (stall_count <= 6) {
        return '#a7fb09'
    } else if (stall_count <= 9) {
        return '#dcf900'
    } else if (stall_count <= 12) {
        return '#f6de1a'
    } else if (stall_count <= 16) {
        return '#f69a1a'
    } else if (stall_count <= 20) {
        return '#f66a1a'
    } else if (stall_count <= 24) {
        return '#f63a1a'
    } else if (stall_count <= 28) {
        return '#f60a1a'
    } else if (stall_count <= 32) {
        return '#f6005a'
    } else if (stall_count <= 36) {
        return '#f6008a'
    } else { return '#800080' } 
}
