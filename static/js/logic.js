// Creating map object
var myMap = L.map("map", {
  center: [-10.0522, 118.2437],
  zoom: 2
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
//var geoData = "static/data/merge_countries_internetspeed.geojson";
var geoData = "static/data/merge_countries_combined_internet.geojson";            

var geojson;

var dv = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];
var cs = ['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b'];
var colorscale = dv;

d3.json(geoData).then(function(data) {
  console.log('data ',data)
 // Create a new choropleth layer
 geojson = L.choropleth(data, {

   // Define what  property in the features to use
   valueProperty: "rank",
   
   //Set color scale diverging or color blind safe
   //scale: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'],  
   scale :  ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'],
   
   
   // Number of breaks in step range
   steps: 15,

   // q for quartile, e for equidistant, k for k-means
   mode: "q",
   style: {
     // Border color
     color: "#fff",
     weight: 1,
     fillOpacity: 0.8
   },

   // Binding a pop-up to each layer
   onEachFeature: function(feature, layer) {
     layer.bindPopup( feature.properties.country + " Rank:" + feature.properties.rank + "<br>" +
     "Income per person US$: " + Math.round(feature.properties.incomeperperson,0) + "<br>" + "Internet user rate per 100 people: " + Math.round(feature.properties.internetusage,0) + "<br>" +
     "DownloadSpeed_MBPS: " + feature.properties.download_speed_MBPS + "<br>" + "Urbanrate: " + feature.properties.urbanrate)      
   }
 }).addTo(myMap);

 // Set up the legend
 var legend = L.control({ position: "topright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var limits = geojson.options.limits;
   var colors = geojson.options.colors;
   var labels = [];

   // Add min & max
   //console.log('limits ',limits);
   var legendInfo = "<h1>Country Internet Speed Rankings</h1>" +
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + "192" + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };
 // Adding legend to the map
 legend.addTo(myMap);
});