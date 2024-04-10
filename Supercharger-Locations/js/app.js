// Define variables for start and end points
var startPoint = null;
var endPoint = null;

// Your JavaScript code goes here
// Load the CSV file using Papa Parse
Papa.parse("/Project_3/Archive/national_parks.csv", {
    download: true,
    header: true,
    complete: function (results) {
        // Parse complete, log the data to the console
        //console.log("Parsed CSV data:", results.data);

        // Iterate through the data and log park information
        var jsonData = {
            "name,location,lat,long": results.data.map(function (row) {
                return row["name,location,lat,long"]
            })
        }
        //console.log(jsonData)
        createmap(jsonData)
    }
});



function createmap(jsonData){
// Initialize the map
var myMap = L.map('map', {
    maxZoom: 18
}).setView([37.0902, -95.7129], 4);

var markers = L.markerClusterGroup();

// Extract data from JSON and display markers on the map
jsonData["name,location,lat,long"].forEach(function (item) {
    var parts = item.split(",");
    //console.log(parts)
    var parkName = parts[0];
    var latitude = parseFloat(parts[2].trim());
    var longitude = parseFloat(parts[3].trim());

    // Create a marker and add it to the map
    var marker = L.marker([latitude, longitude])
        .bindPopup(`<b>${parkName}</b><br>Latitude: ${latitude}, Longitude: ${longitude},`);
    markers.addLayer(marker);
});

// var parks = [
//     { name: 'Grand Canyon National Park', location: 'Arizona', coordinates: [36.2679, -112.3535], image: 'grandcanyon.jpg' },
//     { name: 'Yellowstone National Park', location: 'Wyoming', coordinates: [44.4280, -110.5885], image: 'yellowstone.jpg' },
//     { name: 'Yosemite National Park', location: 'California', coordinates: [37.8651, -119.5383], image: 'yosemite.jpg' },
//     { name: 'Zion National Park', location: 'Utah', coordinates: [37.2982, -113.0263], image: 'zion.jpg' },
//     // Add more parks here
// ];

// parks.forEach(function(park) {
//     // Create a marker and add it to the map
//     var marker = L.marker(park.coordinates)
//         .bindPopup(`<b>${park.name}</b><br>Location: ${park.location}<br><img src="${park.image}" width="200" height="150">`);
//     markers.addLayer(marker);
    
//     // Set icon for each marker
//     marker.setIcon(L.icon({
//         iconUrl: 'marker.png', // Replace 'marker.png' with the path to your marker image
//         iconSize: [32, 32], // Set the size of the image
//         iconAnchor: [16, 16],
//     }));
// });


myMap.addLayer(markers);
// Add the base map layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(myMap);


// Function to calculate distance between two points
function calculateDistance(point1, point2) {
    return point1.distanceTo(point2) / 1000; // Distance in kilometers
}

// Function to calculate distance between two points in miles
function calculateDistance(point1, point2) {
    var distanceKm = point1.distanceTo(point2) / 1000; // Distance in kilometers
    var distanceMiles = distanceKm * 0.621371; // Convert kilometers to miles
    return distanceMiles;
}

// Function to handle click events on the map
function onMapClick(e) {
    if (!startPoint) {
        startPoint = e.latlng;
        alert("Start point set!");
    } else if (!endPoint) {
        endPoint = e.latlng;
        alert("End point set!");

        // Calculate distance between two points
        var distance = calculateDistance(startPoint, endPoint);
        alert("Distance between points: " + distance.toFixed(2) + " miles");

        // Reset points for next calculation
        startPoint = null;
        endPoint = null;
        }
    }

// Add click event listener to the map
myMap.on('click', onMapClick);

}
