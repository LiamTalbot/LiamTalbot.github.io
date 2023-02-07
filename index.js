let dataJson = loadFile();

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
        console.log(`x-axis : minVal is ${minVal} and maxVal is ${maxVal}`);
        dataJson.yAxis.elements.forEach(function(item) {
            item.timespans.forEach(function(ts) {
                if (ts.start && ts.start < minVal) minVal = ts.start;
                if (ts.end   && ts.end > maxVal)   maxVal = ts.end;
                if (ts.start && ts.start > maxVal) maxVal = ts.start;
            });
        });
        console.log(`y-axis : minVal is ${minVal} and maxVal is ${maxVal}`);

        dataJson.yAxis.elements.forEach(function(item, index) {
            ctx.font = '24px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = "right";
            ctx.fillText(item.text, widthPc(19), heightPc(12 + (9 * index)));
        });

        dataJson.xAxis.elements.forEach(function(item, index) {
            ctx.save();
            wrapText(ctx, item.text, widthPc(23 + (5 * index)), heightPc(81), 260, 25);
            ctx.restore();
        });

        dataJson.yAxis.elements.forEach(function(item, index) {
            var height = heightPc(12 + (9 * index));
            var scale = maxVal - minVal;
            item.timespans.forEach(function(ts) {
                var startScale = ts.start - minVal;
                var startScalePc = startScale / scale * 75;
                var endScale = ts.end - minVal;
                var endScalePc = endScale / scale * 75;

                if(isNaN(startScalePc) || startScalePc < 0) {
                    startScalePc = 0;
                }
                if(startScalePc > 75) {
                    startScalePc = 75;
                }
                if(isNaN(endScalePc) || endScalePc > 75) {
                    endScalePc = 75;
                }
                if(endScalePc < 0) {
                    endScalePc = 0;
                }

                ctx.beginPath();
                ctx.moveTo(widthPc(20 + startScalePc), height);
                ctx.lineTo(widthPc(20 + endScalePc), height);
                ctx.closePath();
                ctx.stroke();
            });
        });
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    context.translate(x, y);
    context.rotate(300 * (Math.PI / 180));
    context.textAlign = "right";
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