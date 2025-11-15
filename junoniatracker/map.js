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

  // Tooltip element (fixed bottom-left; interactive for scroll/links)
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "fixed")
    .style("left", "20px")
    .style("bottom", "20px")
    .style("pointer-events", "none"); // enabled when visible

  // Load data
  Promise.all([
    d3.json("geo_files/map (1).geojson"),
    d3.csv("data.csv", d => ({ ...d, long: +d.long, lat: +d.lat }))
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

    // Build grouped tooltip HTML (uses "Read More" link)
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

    function showTooltipForKey(key) {
      const items = byCoord.get(key) || [];
      tooltip
        .html(htmlForGroup(items))
        .style("opacity", 1)
        .style("pointer-events", "auto"); // allow scroll & link clicks
    }

    function hideTooltip() {
      tooltip
        .style("opacity", 0)
        .style("pointer-events", "none");
    }

    // Convenience to select all circles for a coord key
    function selectGroup(key) {
      return circles.filter(dd => coordKey(dd) === key);
    }

    function unlockAndHide() {
      locked = false;
      lockedKey = null;
      d3.selectAll(".ms-circle")
        .attr("stroke-width", null)
        .classed("locked", false);
      hideTooltip();
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
        showTooltipForKey(key);
      })
      // Tooltip is anchored; mousemove is a no-op
      .on("mousemove", function () { /* no-op */ })
      .on("mouseleave", function (event, d) {
        if (locked) return; // keep visible when locked
        const key = coordKey(d);
        selectGroup(key).attr("stroke-width", null);
        hideTooltip();
      })
      .on("click", function (event, d) {
        event.stopPropagation(); // prevent document-level closer
        const key = coordKey(d);
        const isSame = locked && lockedKey === key;

        if (isSame) {
          unlockAndHide();
        } else {
          locked = true;
          lockedKey = key;

          d3.selectAll(".ms-circle")
            .attr("stroke-width", null)
            .classed("locked", false);

          // Visual cue on ALL circles in the group
          selectGroup(key)
            .attr("stroke-width", 4)
            .classed("locked", true);

          showTooltipForKey(key);
        }
      });

    // === LABEL POSITIONING ===

    const LABEL1_LON = -82.09219243124836;
    const LABEL1_LAT = 26.434876025646844;

    const LABEL2_LON = -82.18853996165424;
    const LABEL2_LAT = 26.52194936113601;

    function positionLabels() {
      const container = document.querySelector(".container");
      const svgEl = document.querySelector("#chart svg");
      const label1 = document.querySelector(".label1");
      const label2 = document.querySelector(".label2");

      if (!container || !svgEl || !label1 || !label2) return;

      // Where is the SVG inside the container?
      const containerRect = container.getBoundingClientRect();
      const svgRect = svgEl.getBoundingClientRect();
      const offsetLeft = svgRect.left - containerRect.left;
      const offsetTop  = svgRect.top  - containerRect.top;

      // Project lon/lat -> SVG coordinates (inside the <g> with margin)
      const [x1, y1] = projection([LABEL1_LON, LABEL1_LAT]);
      const [x2, y2] = projection([LABEL2_LON, LABEL2_LAT]);

      // Label heights for bottom-alignment
      const h1 = label1.offsetHeight;
      const h2 = label2.offsetHeight;

      // Because the <g> is translated by margin,
      // add margin.left / margin.top to the projected coords.
      label1.style.left = (offsetLeft + margin.left + x1) + "px";
      label1.style.top  = (offsetTop  + margin.top  + y1 - h1) + "px";

      label2.style.left = (offsetLeft + margin.left + x2) + "px";
      label2.style.top  = (offsetTop  + margin.top  + y2 - h2) + "px";
    }

    // Initial placement
    positionLabels();
    // Recalculate on resize in case layout shifts
    window.addEventListener("resize", positionLabels);

    // Global click: close locked tooltip when clicking outside circles/tooltip
    document.addEventListener("click", (e) => {
      if (!locked) return;

      const tNode = tooltip.node();
      const clickedInsideTooltip =
        (e.composedPath && e.composedPath().includes(tNode)) ||
        (tNode.contains && tNode.contains(e.target));

      const clickedCircle = e.target.closest && e.target.closest(".ms-circle");

      if (!clickedInsideTooltip && !clickedCircle) {
        unlockAndHide();
      }
    });
  }
})();
