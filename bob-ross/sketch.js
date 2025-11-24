
const data = [
	{ name: "Red", apples: 0, oranges: 0,  bananas: 1 },
	{ name: "Orange", apples: 1, oranges: 1,  bananas: 0 },
	{ name: "Yellow", apples: 1, oranges: 1, bananas: 0 },
	{ name: "Green", apples: 3, oranges: 3,  bananas: 4 },
	{ name: "Blue", apples: 1, oranges: 2, bananas: 3 },
	{ name: "Pink", apples: 2, oranges: 1, bananas: 1 },
	{ name: "Purple", apples: 0, oranges: 3, bananas: 1 },
	{ name: "Brown", apples: 0, oranges: 1, bananas: 2 },
	{ name: "Grey", apples: 2, oranges: 1, bananas: 0 },
	{ name: "Black", apples: 0, oranges: 0, bananas: 1 },
	{ name: "White", apples: 3, oranges: 0, bananas: 0 }
];


// ----- Config -----
const width = 500;
const height = Math.min(500, width / 2);
const outerRadius = height / 2 - 10;
const innerRadius = outerRadius * 0.75;

// Metric definitions
// id = data property, label = UI text
const metrics = [
  { id: "apples",  label: "Series 1" },
  { id: "oranges", label: "Series 2" },
  { id: "bananas", label: "Series 3" }
];

const defaultMetric = "apples";

// ----- SVG setup -----
const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", [-width / 2, -height / 2, width, height]);

// Arc generator
const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius);

// Pie layout
const pie = d3.pie()
  .sort(null)
  .value(d => d[defaultMetric]);

// ----- Draw slices -----
const path = svg
  .datum(data)
  .selectAll("path")
  .data(pie)
  .join("path")
  .attr("class", d => `slice-${d.data.name}`)   // <── CSS-based slice class
  .attr("d", arc)
  .each(function(d) {
    this._current = d; // store initial angles
  });

// ----- Optional slice labels -----
const labelArc = d3.arc()
  .innerRadius(innerRadius * 0.5)
  .outerRadius(outerRadius * 0.95);

const labels = svg
  .datum(data)
  .selectAll("text")
  .data(pie)
  .join("text")
  .attr("class", "slice-label") 
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("transform", d => `translate(${labelArc.centroid(d)})`)
  .text(d => d.data.name);

// ----- Update function -----
function change(metricId) {
  // Guard against invalid toggle values
  if (!metrics.some(m => m.id === metricId)) return;

  // Update pie value accessor
  pie.value(d => d[metricId]);

  // Compute new arcs
  const pieData = pie(data);

  // Update slices with transition
  path
    .data(pieData)
    .transition()
    .duration(750)
    .attrTween("d", arcTween);

  // Update label positions
  labels
    .data(pieData)
    .transition()
    .duration(750)
    .attr("transform", d => `translate(${labelArc.centroid(d)})`)
	.style("opacity", d => d.value === 0 ? 0 : 1);
}

// ----- Arc tweening for smooth transitions -----
function arcTween(a) {
  const i = d3.interpolate(this._current, a);
  this._current = i(0);
  return t => arc(i(t));
}

// ----- Controls (radio buttons) -----
const form = d3.select("#controls")
  .append("form");

const controls = form
  .selectAll("label")
  .data(metrics)
  .join("label")
  .style("margin-right", "1rem")
  .style("cursor", "pointer");

controls
  .append("input")
  .attr("type", "radio")
  .attr("name", "metric")
  .attr("value", d => d.id)
  .property("checked", d => d.id === defaultMetric)
  .on("change", (event, d) => change(d.id));

controls
  .append("span")
  .text(d => " " + d.label);

// Initialize explicitly
change(defaultMetric);