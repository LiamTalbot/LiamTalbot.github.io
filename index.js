let uniqueHexColors = ['#FF0099', '#00CC00', '#E6E600', '#6600CC', '#0099FF', '#993399', '#006633', '#CC9900', '#669933', '#FF99CC', '#330099', '#FF6600', '#9900CC', '#666633', '#CCCCFF'];

function initialize() {
    // Wait for Alpine to be ready before initializing
    document.addEventListener('alpine:init', () => {
        // Register an event listener to call the function each time the window is resized.
        window.addEventListener('resize', debounce(resizeCanvasAndRender, 250), false);
        // Draw canvas border for the first time.
        resizeCanvasAndRender();
    });
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
function resizeCanvasAndRender() {    const canvas = document.getElementById('dynamic-timeline');
    if (!canvas) throw new Error('Canvas not found.');
    
    // Get the timeline selection safely through Alpine store instead of direct view model access
    const timelineState = Alpine.store('timelineSelect');
    if (!timelineState || !vm_timelineSelect || !vm_timelineSelect.optionSelected) { 
        canvas.style.display = 'none';
        return;
    }
    
    canvas.style.display = 'block';
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight - 50);
    render(canvas, vm_timelineSelect.optionSelected);
}

function render(canvas, dataJson) {
    const svg = d3.select('#' + canvas.id);
    svg.selectAll('*').remove();
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 20, bottom: 100, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

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
      .tickFormat(d3.format('d')) // Format X-axis labels as years
      .ticks(Math.round(domain[1] - domain[0]));

    const yAxis = d3.axisLeft(yScale);

    // Create a group for the chart and translate it to the appropriate position
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Render X and Y axes
    chart.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`)
      .selectAll('.tick text')
      .attr('class', 'axis-label');

    chart.append('g')
      .call(yAxis)
      .selectAll('.tick text')
      .attr('class', 'span-label');

    var blah3 = chart.append('g').attr('class', 'periods');
    const periodGroups = [];
    dataJson.yAxis.elements.forEach(function(item) {
      const spans = item.spans.toSorted(function(a, b){ return a.priority - b.priority; });
      spans.forEach(function(span) {
        var blah4 = blah3.append('g').attr('class', 'period');
        blah4.selectAll('.period-bar')
          .data([span])
          .enter().append('rect')
          .attr('class', 'period-bar')
          .attr('stroke', d => categories.find(a => a.category === d.category).appearances.find(a => a.priority === d.priority).colour)
          .attr('fill', d => categories.find(a => a.category === d.category).appearances.find(a => a.priority === d.priority).colour)
          .attr('x', d => Math.max(xScale(getScaleValue(d.start) || domain[0]), 1))
          .attr('y', d => yScale(item.text) + ((yScale.bandwidth() / 100 * 5) * (d.priority || 0)))
          .attr('width', d => xScale(getScaleValue(d.end) || domain[1]) - xScale(getScaleValue(d.start) || domain[0]))
          .attr('height', d => yScale.bandwidth() - ((yScale.bandwidth() / 100 * 10) * (d.priority || 0)));
        periodGroups.push(blah4);
      });
    });

    var blah1 = chart.append('g').attr('class', 'events');
    const eventGroups = [];
    dataJson.xAxis.elements.forEach(function(item) {
      const label1 = item.text;
      const spans = item.spans.toSorted(function(a, b){ return a.priority - b.priority; });
      spans.forEach(function(span) {
        var blah2 = blah1.append('g').attr('class', 'event');
        blah2.selectAll('.event-bar')
          .data([span])
          .enter().append('line')
          .attr('class', 'event-bar')
          .attr('stroke', d => categories.find(a => a.category === d.category).appearances.find(a => a.priority === d.priority).colour)
          .attr('x1', d => xScale(getScaleValue(d.start) || domain[0]))
          .attr('y1', 0)
          .attr('x2', d => xScale(getScaleValue(d.start) || domain[0]))
          .attr('y2', 0 + innerHeight);
        blah2.selectAll('.event-text')
          .data([item])
          .enter().append('text')
          .attr('class', 'event-text')
          .attr('x', d => xScale(getScaleValue(d.start) || domain[0]))
          .attr('y', 9 + innerHeight)
          .text(d => { return label1; })
          .attr('transform-origin', d => `${xScale(getScaleValue(d.spans[0].start) || domain[0])} ${9 + innerHeight}`)
          .attr('transform', 'rotate(-45)')
          .style('text-anchor', 'end')
          .style("font-size","12px");
        eventGroups.push(blah2);
      });
    });

    //debugger;
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
  var padding = (maxVal - minVal) / 100 * 1;
  return [ minVal - padding, maxVal + padding ];
}

function isDate(val) {
  return (new Date(val) !== 'Invalid Date' && !isNaN(new Date(val)))
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