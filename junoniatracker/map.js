(function () {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width  = 1100 - margin.left - margin.right;
  const height = 700  - margin.top  - margin.bottom;

  // SVG container
  const svg = d3.select("#chart").append("svg")
      .attr("width",  width  + margin.left + margin.right)
      .attr("height", height + margin.top  + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Tooltip element (on body so we can position with pageX/pageY)
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")

  // Load data
  Promise.all([
    d3.json("geo_files/map (1).geojson"),
    d3.csv("data.csv", d => ({
      ...d,
      long: +d.long,
      lat:  +d.lat
    }))
  ]).then(([countries, museums]) => ready(countries, museums));

  function ready(countries, museums) {
    // --- Projection & path ---
    const projection = d3.geoEquirectangular()
      .scale(300000)
      .translate([width / 0.0024626, height / 0.0047477]);

    const pathGenerator = d3.geoPath(projection);

    // --- Base map ---
    svg.selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("d", pathGenerator);

    // ==== Grouping helpers ====
    const coordKey = d => `${d.long},${d.lat}`;
    const byCoord = d3.group(museums, coordKey); // Map<"long,lat", Array<Row>>

    // State for lock
    let locked = false;
    let lockedKey = null;

    // Build grouped tooltip HTML
   function htmlForGroup(items) {
  const header = `<div class="tt-row"><p><strong>${items.length} entr${items.length === 1 ? "y" : "ies"}</strong> at this location</p></div>`;
  const rows = items.map(d => {
    const linkHTML = d.link
      ? `<div><a class="tt-readmore" href="${d.link}" target="_blank" rel="noopener noreferrer">Read More</a></div>`
      : "";
    return `
      <div class="tt-entry" style="margin-top:6px; border-top: 0.2rem dotted rgb(52, 29, 20); padding-top:6px;">
        <div><p class="header">${d.name || ""}</p></div>
        <div><p><span class="tt-label">Date Found:</span> ${d.date || ""}</p></div>
        <div><p><span class="tt-label">Location Found:</span> ${d.location || ""}</p></div>
        <div><p><span class="tt-label">Shell Age:</span> ${d.age || ""}</p></div>
        <div><p><span class="tt-label">Shell Condition:</span> ${d.whole || ""}</p></div>
        ${linkHTML}
      </div>
    `;
  }).join("");
  return `${header}${rows}`;
}


    function showTooltipForKey(event, key) {
  const items = byCoord.get(key) || [];
  tooltip
    .html(htmlForGroup(items))
    .style("opacity", 1)
    .style("left", "20px")        // left padding from viewport edge
    .style("bottom", "20px")      // bottom padding from viewport edge
    .style("top", null)           // clear any inline top style
    .style("right", null)         // clear any inline right style
    .style("position", "fixed");  // stay fixed on screen
}

    function hideTooltip() {
      tooltip.style("opacity", 0);
    }

    // Convenience to select all circles for a coord key
    function selectGroup(key) {
      return circles.filter(dd => coordKey(dd) === key);
    }

    // --- Circles layer (keep every row for your opacity cue) ---
    const circles = svg.selectAll(".ms-circle")
      .data(museums)
      .join("circle")
      .attr("class", "ms-circle")
      .attr("r", 8)
      .attr("cx", d => projection([d.long, d.lat])[0])
      .attr("cy", d => projection([d.long, d.lat])[1])
      .on("mouseenter", function (event, d) {
        if (locked) return; // don’t override locked tooltip
        const key = coordKey(d);
        selectGroup(key).attr("stroke-width", 4);
        showTooltipForKey(event, key);
      })
      .on("mousemove", function (event) {
        if (locked) return; // don’t move when locked
        moveTooltip(event);
      })
      .on("mouseleave", function (event, d) {
        if (locked) return; // keep visible when locked
        const key = coordKey(d);
        selectGroup(key).attr("stroke-width", null);
        hideTooltip();
      })
      .on("click", function (event, d) {
        const key = coordKey(d);
        const isSame = locked && lockedKey === key;

        if (isSame) {
          // unlock
          locked = false;
          lockedKey = null;
          d3.selectAll(".ms-circle")
            .attr("stroke-width", null)
            .classed("locked", false);
          hideTooltip();
        } else {
          // lock this coordinate group
          locked = true;
          lockedKey = key;

          d3.selectAll(".ms-circle")
            .attr("stroke-width", null)
            .classed("locked", false);

          // Visual cue on ALL circles in the group
          selectGroup(key)
            .attr("stroke-width", 4)
            .classed("locked", true);

          showTooltipForKey(event, key);
          moveTooltip(event);
        }
      });

    // No text labels — removed on purpose
  }
})();
