function loadData() {
    //const dataObjectFromFile = require('./metallica.json');
    //console.log(dataObjectFromFile);
    
    
    return JSON.parse(data);
    //console.log(jsonData.text);
    //fetch('./metallica.json').then((response) => response.json())
    //                    .then((json) => console.log(json));
}
let uniqueHexColors = ["#FF0099", "#00CC00", "#E6E600", "#6600CC", "#0099FF", "#993399", "#006633", "#CC9900", "#669933", "#FF99CC", "#330099", "#FF6600", "#9900CC", "#666633", "#CCCCFF"];

function initialize() {
    // Register an event listener to call the function each time the window is resized.
    window.addEventListener('resize', resizeCanvasAndRender, false);
    // Draw canvas border for the first time.
    resizeCanvasAndRender();
}
// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvasAndRender() {
    const canvas = document.getElementById("dynamic-timeline");
    if (!canvas) throw new Error("Canvas not found.");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    render(canvas);
}

function render(canvas) {
    if (!canvas.getContext) throw new Error("No canvas with 2D context found.");
    const ctx = canvas.getContext("2d");

    renderTheAxes(ctx);

    var dataJson = loadData();
    
    var minVal = 9999, maxVal = 0;
    dataJson.xAxis.elements.forEach(function(item) {
        item.timespans.forEach(function(ts) {
            let thisStart = getScaleValue(ts.start);
            let thisEnd   = getScaleValue(ts.end);
            if (thisStart && thisStart < minVal) minVal = thisStart;
            if (thisEnd   && thisEnd > maxVal)   maxVal = thisEnd;
            if (thisStart && thisStart > maxVal) maxVal = thisStart;
        });
    });
    dataJson.yAxis.elements.forEach(function(item) {
        item.timespans.forEach(function(ts) {
            let thisStart = getScaleValue(ts.start);
            let thisEnd   = getScaleValue(ts.end);
            if (thisStart && thisStart < minVal) minVal = thisStart;
            if (thisEnd   && thisEnd > maxVal)   maxVal = thisEnd;
            if (thisStart && thisStart > maxVal) maxVal = thisStart;
        });
    });

    renderTheXAxisScale(ctx, dataJson.xAxis.scaleJump, minVal, maxVal, dataJson.xAxis.scales);
    renderTheYAxisElements(ctx, dataJson.yAxis.elements, minVal, maxVal);
    renderTheXAxisElements(ctx, dataJson.xAxis.elements, minVal, maxVal);
}

// x is 20 to 95, y is 5 to 80
function renderTheAxes(ctx) {
    ctx.beginPath();
    ctx.moveTo(widthPc(20), heightPc(5));
    ctx.lineTo(widthPc(20), heightPc(80));
    ctx.moveTo(widthPc(20), heightPc(80));
    ctx.lineTo(widthPc(95), heightPc(80));
    ctx.closePath();
    ctx.stroke();
}
function renderTheXAxisScale(ctx, scaleJump, minVal, maxVal, scales) {
    if (!isNaN(scaleJump)) {
        var scale  = maxVal - minVal;
        for (let i = 0; i <= scale; i = i + scaleJump) {
            var startScale   = 0 + i;
            var startScalePc = startScale / scale * 75;

            if (isNaN(startScalePc) || startScalePc < 0) break;
            if (startScale > maxVal || startScalePc > 75) break;

            ctx.beginPath();
            ctx.strokeStyle = "#BBB";
            ctx.moveTo(widthPc(20 + startScalePc), heightPc(80));
            ctx.lineTo(widthPc(20 + startScalePc), heightPc(80) + 10);
            ctx.closePath();
            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = "#BBB";
            ctx.textAlign = "center";
            ctx.fillText((minVal + i).toString(), widthPc(20 + startScalePc), heightPc(80) + 20);
        }
    } else if (scales != null && scales.length > 0) {
        scales.forEach(function(item, index) {
//                ctx.beginPath();
//                ctx.strokeStyle = "#444";
//                ctx.moveTo(widthPc(20 + i), heightPc(80));
//                ctx.lineTo(widthPc(20 + i), heightPc(80) + 20);
//                ctx.closePath();
//                ctx.stroke();
//
//                ctx.font = '6px Arial';
//                ctx.fillStyle = "#444";
//                ctx.textAlign = "center";
//                ctx.fillText((minVal + i).toString(), widthPc(20 + i), heightPc(80) + 20);
        });
    }
}
function renderTheYAxisElements(ctx, elements, minVal, maxVal) {
    elements.forEach(function(item, index) {
        var scale  = maxVal - minVal;
        item.timespans.forEach(function(ts) {
            let thisStart = getScaleValue(ts.start);
            let thisEnd   = getScaleValue(ts.end);
            var startScale   = thisStart - minVal;
            var startScalePc = startScale / scale * 75;
            var endScale     = thisEnd - minVal;
            var endScalePc   = endScale / scale * 75;

            if (isNaN(startScalePc) || startScalePc < 0) startScalePc = 0;
            if (startScalePc > 75)                       startScalePc = 75;
            if (isNaN(endScalePc) || endScalePc > 75)    endScalePc   = 75;
            if (endScalePc < 0)                          endScalePc   = 0;

            renderYAxisElement(ctx, index, startScalePc, endScalePc, ts.priority | 0);
        });

        ctx.save();
        wrapText(ctx, item.text, widthPc(20), heightPc(12 + (9 * index)), 260, 25, 0, index);
        ctx.restore();
    });    
}
function renderYAxisElement(ctx, index, startScalePc, endScalePc, priority) {
    var priorityOffset = (3 * priority);
    var height = heightPc(12 + (9 * index));
    ctx.fillStyle = uniqueHexColors[index + priority];
    ctx.fillRect(widthPc(20 + startScalePc), height - 20 + priorityOffset, widthPc(20 + endScalePc) - widthPc(20 + startScalePc), 20 - (priorityOffset * 2));
}
function renderTheXAxisElements(ctx, elements, minVal, maxVal) {
    elements.forEach(function(item, index) {
        var startHeight = heightPc(5);
        var endHeight   = heightPc(80);
        var minWidth    = 9999;

        var scale = maxVal - minVal;
        item.timespans.forEach(function(ts) {
            let thisStart = getScaleValue(ts.start);
            let thisEnd   = getScaleValue(ts.end);
            var startScale   = thisStart - minVal;
            var startScalePc = startScale / scale * 75;
            var endScale     = thisEnd - minVal;
            var endScalePc   = endScale / scale * 75;

            if (isNaN(startScalePc) || startScalePc < 0) startScalePc = 0;
            if (startScalePc > 75)                       startScalePc = 75;
            if (endScalePc > 75)                         endScalePc   = 75;
            if (endScalePc < 0)                          endScalePc   = 0;

            ctx.beginPath();
            ctx.strokeStyle = uniqueHexColors[index];
            ctx.moveTo(widthPc(20 + startScalePc), startHeight);
            ctx.lineTo(widthPc(20 + startScalePc), endHeight);
            if (!isNaN(endScalePc)) {
                ctx.moveTo(widthPc(20 + endScalePc), startHeight);
                ctx.lineTo(widthPc(20 + endScalePc), endHeight);
            }
            ctx.closePath();
            ctx.stroke();

            if (startScalePc < minWidth) minWidth = startScalePc;
        });

        ctx.save();
        wrapText(ctx, item.text, widthPc(20 + minWidth), heightPc(80) + 25, 260, 25, 320, index);
        ctx.restore();
    });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, rotation, index) {
    ctx.translate(x, y);
    ctx.rotate(rotation * (Math.PI / 180));
    ctx.font = '16px Arial';
    ctx.textAlign = "right";
    ctx.fillStyle = uniqueHexColors[index];
    x = 0;
    y = 0;
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function heightPc(pc) { return window.innerHeight / 100 * pc; }
function widthPc(pc)  { return window.innerWidth  / 100 * pc; }

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