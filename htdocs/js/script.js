const canvas = document.getElementById('function-canvas');
const canvasSize = 600;
canvas.width = canvasSize;
canvas.height = canvasSize;
const c = canvas.getContext('2d');
const fontSize = 10;
c.font = fontSize + 'px Arial';
const maxFuncXY = 10;
const padding = 20;

function getXYForValue(value) {
    const in_min = maxFuncXY * -1;
    const in_max = maxFuncXY;
    const out_min = padding;
    const out_max = canvasSize - padding;
    // map range to other range
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function drawLine(xStart, yStart, xEnd, yEnd) {
    c.moveTo(xStart, yStart)
    c.lineTo(xEnd, yEnd);
    c.stroke();
}

function drawAxes() {
    const maxXY = getXYForValue(maxFuncXY);
    const minXY = getXYForValue(maxFuncXY * -1);
    const centerXY = getXYForValue(0);
    c.fillText('X', padding / 2, centerXY);
    drawLine(minXY, centerXY, maxXY, centerXY);

    const startValueStepXY = centerXY - 5;
    const endValueStepXY = centerXY + 5;
    for (let i = maxFuncXY * -1; i <= maxFuncXY; i++) {
        let xValue = getXYForValue(i);
        drawLine(xValue, startValueStepXY, xValue, endValueStepXY);
        if (i !== 0) {
            c.fillText(i.toString(), xValue - fontSize / 2, endValueStepXY + fontSize);
        }
    }

    c.fillText('Y', centerXY, padding / 2);
    drawLine(centerXY, minXY, centerXY, maxXY);
    for (let i = maxFuncXY * -1; i <= maxFuncXY; i++) {
        let yValue = getXYForValue(i);
        drawLine(startValueStepXY, yValue, endValueStepXY, yValue);
        if (i !== 0) {
            c.fillText(i.toString(), endValueStepXY, yValue + fontSize / 2);
        }
    }
    c.fillText('0', centerXY + fontSize / 2, centerXY + fontSize);
}

function displayFunction(func) {
    drawAxes();
}

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault();
    displayFunction(document.getElementById('func').value);
});

drawAxes();