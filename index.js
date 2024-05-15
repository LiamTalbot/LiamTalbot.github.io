function loadData() {
    //const dataObjectFromFile = require('./metallica.json');
    //console.log(dataObjectFromFile);
    
    // data defined as a variable in test metallica.js
    return JSON.parse(data);
    //console.log(jsonData.text);
    //fetch('./metallica.json').then((response) => response.json())
    //                    .then((json) => console.log(json));
}
let uniqueHexColors = ["#FF0099", "#00CC00", "#E6E600", "#6600CC", "#0099FF", "#993399", "#006633", "#CC9900", "#669933", "#FF99CC", "#330099", "#FF6600", "#9900CC", "#666633", "#CCCCFF"];

function initialize() {
    // Register an event listener to call the function each time the window is resized.
    window.addEventListener('resize', debounce(resizeCanvasAndRender, 250), false);
    // Draw canvas border for the first time.
    resizeCanvasAndRender();
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
async function resizeCanvasAndRender(resizing) {
    const canvas = document.getElementById("dynamic-timeline");
    if (!canvas) throw new Error("Canvas not found.");
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    render(canvas);
}

function render(canvas) {
    // Set up the SVG container
    const svg = d3.select("#dynamic-timeline");
    svg.selectAll("*").remove();
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 100, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dataJson = loadData();
    const categories = dataJson.categories;
    const domain = getDomain(dataJson);

    // Create scales for X and Y axes
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(dataJson.yAxis.elements.map(d => d.text))
      .range([0, innerHeight])
      .padding(0.2);

    // Create X and Y axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d")); // Format X-axis labels as years

    const yAxis = d3.axisLeft(yScale);

    // Create a group for the chart and translate it to the appropriate position
    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Render X and Y axes
    chart.append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`)
      .selectAll(".tick text")
      .attr("class", "axis-label");

    chart.append("g")
      .call(yAxis)
      .selectAll(".tick text")
      .attr("class", "span-label");

    // Render the y-axis spans
    chart.selectAll(".span")
      .data(dataJson.yAxis.elements)
      .enter().append("rect")
      .attr("class", "span")
      .attr("stroke", d => categories.find(a => a.category === d.spans[0].category).appearances[0].colour)
      .attr("fill", d => categories.find(a => a.category === d.spans[0].category).appearances[0].colour)
      .attr("x", d => xScale(getScaleValue(d.spans[0].start) || domain[0])) // Convert months to fractions of a year
      .attr("y", d => yScale(d.text))
      .attr("width", d => xScale(getScaleValue(d.spans[0].end) || domain[1]) - xScale(getScaleValue(d.spans[0].start) || domain[0]))
      .attr("height", yScale.bandwidth());

    // Render the x-axis events
    chart.selectAll(".event")
        .data(dataJson.xAxis.elements)
        .enter().append("line")
        .attr("class", "event")
        .attr("stroke", d => categories.find(a => a.category === d.spans[0].category).appearances[0].colour)
        .attr("x1", d => xScale(getScaleValue(d.spans[0].start) || domain[0]))
        .attr("y1", 0)
        .attr("x2", d => xScale(getScaleValue(d.spans[0].start) || domain[0]))
        .attr("y2", 0 + innerHeight);
}

function getDomain(dataJson) {
    var minVal = 9999, maxVal = 0;
    dataJson.xAxis.elements.forEach(function(item) {
        item.spans.forEach(function(s) {
            let thisStart = getScaleValue(s.start);
            let thisEnd   = getScaleValue(s.end);
            if (thisStart && thisStart < minVal) minVal = thisStart;
            if (thisEnd   && thisEnd > maxVal)   maxVal = thisEnd;
            if (thisStart && thisStart > maxVal) maxVal = thisStart;
        });
    });
    dataJson.yAxis.elements.forEach(function(item) {
        item.spans.forEach(function(s) {
            let thisStart = getScaleValue(s.start);
            let thisEnd   = getScaleValue(s.end);
            if (thisStart && thisStart < minVal) minVal = thisStart;
            if (thisEnd   && thisEnd > maxVal)   maxVal = thisEnd;
            if (thisStart && thisStart > maxVal) maxVal = thisStart;
        });
    });
    return [ minVal, maxVal ];
}

function isDate(val) {
  return (new Date(val) !== "Invalid Date" && !isNaN(new Date(val)))
}
function isWholeNumber(val) {
  if (typeof val === 'number' && val % 1 === 0) {
    return true;
  } else {
    return false;
  }
}
function getScaleValue(val) {
    if (isWholeNumber(val)) return parseInt(val);
    if (isDate(val)) {
        let theDate = new Date(val);
        let partYear = calculatePercentageThroughYear(theDate);
        return parseFloat(theDate.getFullYear() + partYear);
    }
    return undefined;
}

function calculatePercentageThroughYear(theDate) {
    let daysInYear = 365;
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let totalDaysPassed = 0;

    for (let i = 0; i < theDate.getMonth(); i++) {
        totalDaysPassed += daysInMonth[i];
    }
    totalDaysPassed += theDate.getDay();

    return totalDaysPassed / daysInYear;
}