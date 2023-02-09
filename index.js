let dataJson = loadFile();
let uniqueHexColors = ["#FF0099", "#00CC00", "#E6E600", "#6600CC", "#0099FF", "#993399", "#006633", "#CC9900", "#669933", "#FF99CC", "#330099", "#FF6600", "#9900CC", "#666633", "#CCCCFF"];

function draw() {
    // Start listening to resize events and draw canvas.
    initialize();
}

function redraw() {
    const canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.beginPath(); // x is 20 to 95, y is 5 to 80
        ctx.moveTo(widthPc(20), heightPc(5));
        ctx.lineTo(widthPc(20), heightPc(80));
        ctx.moveTo(widthPc(20), heightPc(80));
        ctx.lineTo(widthPc(95), heightPc(80));
        ctx.closePath();
        ctx.stroke();
        
        var minVal = 9999, maxVal = 0;
        dataJson.xAxis.elements.forEach(function(item) {
            item.timespans.forEach(function(ts) {
                if (ts.start && ts.start < minVal) minVal = ts.start;
                if (ts.end   && ts.end > maxVal)   maxVal = ts.end;
                if (ts.start && ts.start > maxVal) maxVal = ts.start;
            });
        });
        dataJson.yAxis.elements.forEach(function(item) {
            item.timespans.forEach(function(ts) {
                if (ts.start && ts.start < minVal) minVal = ts.start;
                if (ts.end   && ts.end > maxVal)   maxVal = ts.end;
                if (ts.start && ts.start > maxVal) maxVal = ts.start;
            });
        });

        if (!isNaN(dataJson.xAxis.scaleJump)) {
            var scale  = maxVal - minVal;
            for (let i = 0; i <= scale; i = i + dataJson.xAxis.scaleJump) {
                var startScale   = 0 + i;
                var startScalePc = startScale / scale * 75;

                if (isNaN(startScalePc) || startScalePc < 0) break;
                if (startScale > maxVal || startScalePc > 75) break;

                ctx.beginPath();
                ctx.strokeStyle = "#999";
                ctx.moveTo(widthPc(20 + startScalePc), heightPc(80));
                ctx.lineTo(widthPc(20 + startScalePc), heightPc(80) + 20);
                ctx.closePath();
                ctx.stroke();

                ctx.font = '12px Arial';
                ctx.fillStyle = "#999";
                ctx.textAlign = "center";
                ctx.fillText((minVal + i).toString(), widthPc(20 + startScalePc), heightPc(80) + 30);
            }
        } else if (dataJson.xAxis.scales != null && dataJson.xAxis.scales.length > 0) {
            dataJson.xAxis.scales.forEach(function(item, index) {
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

        dataJson.yAxis.elements.forEach(function(item, index) {
            var height = heightPc(12 + (9 * index));
            var scale  = maxVal - minVal;
            item.timespans.forEach(function(ts) {
                var startScale   = ts.start - minVal;
                var startScalePc = startScale / scale * 75;
                var endScale     = ts.end - minVal;
                var endScalePc   = endScale / scale * 75;

                if (isNaN(startScalePc) || startScalePc < 0) startScalePc = 0;
                if (startScalePc > 75)                       startScalePc = 75;
                if (isNaN(endScalePc) || endScalePc > 75)    endScalePc   = 75;
                if (endScalePc < 0)                          endScalePc   = 0;

                ctx.beginPath();
                ctx.strokeStyle = uniqueHexColors[index];
                ctx.moveTo(widthPc(20 + startScalePc), height);
                ctx.lineTo(widthPc(20 + endScalePc),   height);
                ctx.closePath();
                ctx.stroke();
            });

            ctx.font = '24px Arial';
            ctx.fillStyle = uniqueHexColors[index];
            ctx.textAlign = "right";
            ctx.fillText(item.text, widthPc(19), heightPc(12 + (9 * index)));
        });

        dataJson.xAxis.elements.forEach(function(item, index) {
            var startHeight = heightPc(5);
            var endHeight = heightPc(80);
            //var minWidth = widthPc(75);
            //var maxWidth = widthPc(0);
            var scale = maxVal - minVal;
            item.timespans.forEach(function(ts) {
                var startScale   = ts.start - minVal;
                var startScalePc = startScale / scale * 75;
                var endScale     = ts.end - minVal;
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
                //if (startScalePc < minWidth)                       startScalePc = minWidth;
                //if (!isNaN(endScalePc) && endScalePc < maxWidth)   endScalePc = maxWidth;
                /////if (isNaN(endScalePc) && endScalePc < maxWidth)   endScalePc = maxWidth;
            });
            
            ctx.save();
            wrapText(ctx, item.text, widthPc(23 + (5 * index)), heightPc(81), 260, 25, index);
            ctx.restore();
        });
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight, index) {
    context.translate(x, y);
    context.rotate(300 * (Math.PI / 180));
    context.textAlign = "right";
    context.fillStyle = uniqueHexColors[index];
    x = 0;
    y = 0;
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function loadFile() {
    //const dataObjectFromFile = require('./metallica.json');
    //console.log(dataObjectFromFile);
    
    
    return JSON.parse(data);
    //console.log(jsonData.text);
    //fetch('./metallica.json').then((response) => response.json())
    //                    .then((json) => console.log(json));
}

function initialize() {
    // Register an event listener to call the resizeCanvas() function 
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.
    resizeCanvas();
}
// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
    const htmlCanvas = document.getElementById("tutorial");
    htmlCanvas.width = window.innerWidth;
    htmlCanvas.height = window.innerHeight;
    redraw(htmlCanvas);
}

function heightPc(pc) { return window.innerHeight / 100 * pc; }
function widthPc(pc)  { return window.innerWidth  / 100 * pc; }