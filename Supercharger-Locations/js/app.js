var startPoint = null;
var endPoint = null;

// Check if the map is already initialized
if (!L.DomUtil.get('map')) {
    // Load the CSV file using Papa Parse
    Papa.parse("/Project_3/Archive/national_parks.csv", {
        download: true,
        header: true,
        complete: function (results) {
            // Extract data from CSV and create markers on the map
            var jsonData = {
                "name,location,lat,long": results.data.map(function (row) {
                    return row["name,location,lat,long"];
                })
            };

            // Initialize the map and add markers
            var myMap = L.map('map', {
                maxZoom: 18
            }).setView([37.0902, -95.7129], 4);

            var markers = L.markerClusterGroup();

            // Extract data from JSON and display markers on the map
            jsonData["name,location,lat,long"].forEach(function (item) {
                var parts = item.split(",");
                var parkName = parts[0];
                var latitude = parseFloat(parts[2].trim());
                var longitude = parseFloat(parts[3].trim());

                // Create a marker and add it to the marker cluster group
                var marker = L.marker([latitude, longitude])
                    .bindPopup(`<b>${parkName}</b><br>Latitude: ${latitude}, Longitude: ${longitude}`);
                markers.addLayer(marker);
            });

            // Add the marker cluster group to the map
            myMap.addLayer(markers);

            // Add the base map layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(myMap);

            // Function to calculate distance between two points
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

                    // Reset points for the next calculation
                    startPoint = null;
                    endPoint = null;
                }
            }

            // Add click event listener to the map
            myMap.on('click', onMapClick);
        }
    });
} else {
    // If the map is already initialized, you can handle it here
    console.log('Map is already initialized');
}
