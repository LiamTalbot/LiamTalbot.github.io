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
            ctx.fillText(item.text, widthPc(3), heightPc(10 + (10 * index)));
        });
    }
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