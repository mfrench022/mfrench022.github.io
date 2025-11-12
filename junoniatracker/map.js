(function () {


const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width = 1100 - margin.left - margin.right,
   height = 700 - margin.top - margin.bottom;

// Creating the overall SVG container
// that is going into the <div id="chart"> tag
const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//loading multiple files
//this is javascript, not D3, but it is what D3 recommends...
Promise.all([
    d3.json("geo_files/map (1).geojson"),
    d3.csv("data.csv"),
]).then(ready)


//data is loaded
//start drawing
  function ready(data) {

console.log(data[0]) //file0 topofile
console.log(data[1]) //file1 csv long/lat


const countries = data[0]
console.log(countries)

//name that second layer so it's clear what it is.
var museums = data[1];




// PROJECTION
const projection = d3.geoEquirectangular()
  .scale(300000)
  .translate([width / 0.0024626, height / 0.0047476]);

  const pathGenerator = d3.geoPath(projection);


// countries are shapes so we make PATHS
svg.selectAll("path")
  .data(countries.features)
  .join('path')
  .attr("class","country")
  .attr("d",pathGenerator)
  .attr("fill", "#cccccc") //do attr

//SECOND LAYER!!
// lng/lat are dots so we make CIRCLES on top of the shapes
svg.selectAll("circle")
  .data(museums)
  .enter().append("circle")
  .attr("r",4)
   .attr("class","ms-circle")
  .attr("fill", "#cccccc")
  .attr("cx", function(d){
    var coords = projection([d.long,d.lat])
    return coords[0]
  })
    .attr("cy", function(d){
    var coords = projection([d.long,d.lat])
    return coords[1]
  })

// put some text labels on there!
svg.selectAll("text")
  .data(museums)
  .enter().append("text")
  .attr("class","ms-label")
  .attr("x", function(d){
    var coords = projection([d.long,d.lat])
    return coords[0]
  })
    .attr("y", function(d){
    var coords = projection([d.long,d.lat])
    return coords[1]
  })
  .text(d => d.name)
  .attr("dx",5) //offset
  .attr("dy",5)  //offset

}

})()








