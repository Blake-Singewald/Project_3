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
            circleMarker.bindTooltip(`<strong>Address: </strong>${site.address.street}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${site.name}
                <strong>, </strong>${site.address.zip}<br><strong>Stall Count: </strong>${site.stallCount}`);
            // Add the circleMarker to the gpsMarkers array
            gpsMarkers.push(circleMarker);     
        });

        gpsMarkers.forEach(function(marker) {
            gpsLayer.addLayer(marker); // Add each circleMarker to gpsLayer
        });
        var overlayMaps = {     
            "SuperChargers": gpsLayer,
            "National Parks": NationalParksLayer
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
    layers: [street, gpsLayer, NationalParksLayer] // Set the default base layers 
});  
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
