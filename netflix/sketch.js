const width = 928;
const marginTop = 30;
const marginRight = 20;
const marginBottom = 20;
const marginLeft = 42;

d3.csv("tv-views-by-genre.csv", d3.autoType).then(data => {
  const keys = data.columns.slice(1);

  const series = d3.stack()
	.keys(keys)
	.offset(d3.stackOffsetExpand)(data);

  const height = data.length * 25 + marginTop + marginBottom;

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
	.data(d => d)
	.join("rect")
	  .attr("x", d => x(d[0]))
	  .attr("y", (d, i) => y(data[i].year))
	  .attr("width", d => x(d[1]) - x(d[0]))
	  .attr("height", y.bandwidth());

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
