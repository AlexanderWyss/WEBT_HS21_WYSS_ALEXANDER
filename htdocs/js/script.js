const canvas = document.getElementById('function-canvas');
const canvasSize = 600;
canvas.width = canvasSize;
canvas.height = canvasSize;
const c = canvas.getContext('2d');
const fontSize = 10;
c.font = fontSize + 'px Arial';
const maxFuncXY = 10;
const padding = 20;


function mapRange(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getXForValue(value) {
    return mapRange(value, maxFuncXY * -1, maxFuncXY, padding, canvasSize - padding);
}

function getYForValue(value) {
    return mapRange(value, maxFuncXY * -1, maxFuncXY, canvasSize - padding, padding);
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    c.moveTo(xStart, yStart)
    c.lineTo(xEnd, yEnd);
    c.stroke();
}

function drawAxes() {
    const maxXY = getXForValue(maxFuncXY);
    const minXY = getXForValue(maxFuncXY * -1);
    const centerXY = getXForValue(0);
    c.fillText('X', padding / 2, centerXY);
    drawLine(minXY, centerXY, maxXY, centerXY);

    const startValueStepXY = centerXY - 5;
    const endValueStepXY = centerXY + 5;
    for (let x = maxFuncXY * -1; x <= maxFuncXY; x++) {
        let xValue = getXForValue(x);
        drawLine(xValue, startValueStepXY, xValue, endValueStepXY);
        if (x !== 0) {
            c.fillText(x.toString(), xValue - fontSize / 2, endValueStepXY + fontSize);
        }
    }

    c.fillText('Y', centerXY, padding / 2);
    drawLine(centerXY, minXY, centerXY, maxXY);
    for (let y = maxFuncXY * -1; y <= maxFuncXY; y++) {
        let yValue = getYForValue(y);
        drawLine(startValueStepXY, yValue, endValueStepXY, yValue);
        if (y !== 0) {
            c.fillText(y.toString(), endValueStepXY, yValue + fontSize / 2);
        }
    }
    c.fillText('0', centerXY + fontSize / 2, centerXY + fontSize);
}

function clearCanvas() {
    c.clearRect(0, 0, canvasSize, canvasSize);
    c.beginPath();
}

function displayFunction(func) {
    clearCanvas();
    drawAxes();
    c.beginPath();
    for (let x = maxFuncXY * -1; x <= maxFuncXY; x += 0.1) {
        const y = eval(func.replaceAll('x', x));
        c.lineTo(getXForValue(x), getYForValue(y));
    }
    c.stroke();
}

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault();
    displayFunction(document.getElementById('func').value);
});

drawAxes();