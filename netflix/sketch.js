const width = 1570;
const marginTop = 30;
const marginRight = 20;
const marginBottom = 50;
const marginLeft = 55;

d3.csv("tv-views-by-genre2.csv", d3.autoType).then(data => {
  const keys = data.columns.slice(1);

  const series = d3.stack()
	.keys(keys)
	.offset(d3.stackOffsetExpand)(data);

  const height = data.length * 60 + marginTop + marginBottom;

  const x = d3.scaleLinear()
	.domain([0, 1])
	.range([marginLeft, width - marginRight]);

  const y = d3.scaleBand()
	.domain(data.map(d => d.year))
	.range([marginTop, height - marginBottom])
	.padding(0.08);

const keyToCss = {
  "Animation": "animation",
  "Documentary": "documentary",
  "Game Show": "gameshow",
  "Reality": "reality",
  "Scripted": "scripted",
  "Sports": "sports",
  "Talk Show": "talkshow",
  "Variety": "variety"
};

const getVar = (name) =>
  getComputedStyle(document.documentElement)
	.getPropertyValue(name)
	.trim();

const palette = keys.map(k => getVar(`--color-${keyToCss[k]}`));

// D3 color scale using CSS-driven colors
const color = d3.scaleOrdinal()
  .domain(keys)
  .range(palette)
  .unknown("#ccc");


  const svg = d3.create("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [0, 0, width, height])
	.attr("style", "max-width:100%;height:auto;");

  svg.append("g")
	.selectAll("g")
	.data(series)
	.join("g")
	  .attr("fill", d => color(d.key))
	
	  
	  .selectAll("rect")
.data(d => d.map(v => ({...v, key: d.key})))
.join("rect")
  .attr("x", d => x(d[0]))
  .attr("y", (d, i) => y(data[i].year))
  .attr("width", d => x(d[1]) - x(d[0]))
  .attr("height", y.bandwidth())

  .on("mousemove", (event, d) => {
  const tooltip = d3.select("#tooltip");
  const year = d.data.year;
  const label = d.key;
  const rawValue = d.data[label];
  const pct = ((d[1] - d[0]) * 100).toFixed(1);

  // Fetch the CSS variable color for this label
  const colorVar = getVar(`--color-${keyToCss[label]}`);

  // Decide if the tooltip text should be white or black
  const [r, g, b] = colorVar
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 150 ? "black" : "white";

  tooltip
    .style("opacity", 1)
    .style("background", colorVar)
    .style("color", textColor)
    .html(
      `<strong>${label}</strong> | ${year}<br><br>` +
      `Views: ${rawValue.toLocaleString()}<br>` +
      `Share: ${pct}%`
    )
    .style("left", `${event.pageX + 15}px`)
    .style("top", `${event.pageY - 28}px`);
})
.on("mouseout", () => {
  d3.select("#tooltip").style("opacity", 0);
});


  svg.append("g")
	.attr("transform", `translate(0,${marginTop})`)
	.call(d3.axisTop(x).ticks(width / 100, "%"))
	.call(g => g.selectAll(".domain").remove());

  svg.append("g")
	.attr("transform", `translate(${marginLeft},0)`)
	.call(d3.axisLeft(y).tickSizeOuter(0))
	.call(g => g.selectAll(".domain").remove());

  document.getElementById("container").appendChild(svg.node());
});
