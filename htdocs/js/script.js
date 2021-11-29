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

function isNumber(value) {
    return /^\d+$/.test(value);
}

function toJSFunctionText(func) {
    func = func.replaceAll(/\s/g, '')
    // x 0-9 - * ^ + / ( )
    if (func.length > 0 && /^[x\d+\-*\/^(\)√]+$/.test(func)) {
        let i = 1;
        const split = [func[0]];
        while (i < func.length) {
            if (isNumber(func[i]) && isNumber(split[split.length - 1])) {
                split[split.length - 1] += func[i]
                i++;
            } else if (func[i] === '(') {
                let innerCount = 0;
                let inner = '';
                do {
                    if (func[i] === '(') {
                        innerCount++;
                    } else if (func[i] === ')') {
                        innerCount--;
                    }
                    inner += func[i];
                    i++;
                } while (innerCount !== 0)
                split.push(toJSFunctionText(inner));
            } else {
                split.push(func[i]);
                i++;
            }
        }
        i = 0;
        while (i < split.length) {
            if (split[i] === '^') {
                split[i - 1] = `Math.pow(${split[i - 1]}, ${split[i + 1]})`;
                split.splice(i, 2);
                i += 2;
            } else if (split[i] === '√') {
                split[i - 1] = `Math.pow(${split[i + 1]}, 1/${split[i - 1]})`;
                split.splice(i, 2);
                i += 2;
            } else if (i + 1 < split.length && isNumber(split[i]) && split[i + 1] === 'x') {
                split[i] = `(${split[i]}*${split[i + 1]})`
                split.splice(i + 1, 1);
            } else {
                i++;
            }
        }
        return split.join('');
    } else {
        throw new Error('Invalid function.');
    }
}

function toJSFunction(func) {
    let funcText = toJSFunctionText(func);
    console.debug(funcText);
    return (x) => {
        return eval(funcText.replaceAll('x', x));
    }
}

function displayFunction(func) {
    clearCanvas();
    drawAxes();
    const jsFunc = toJSFunction(func);
    c.beginPath();
    for (let x = maxFuncXY * -1; x <= maxFuncXY; x += 0.1) {
        const y = jsFunc(x);
        c.lineTo(getXForValue(x), getYForValue(y));
    }
    c.stroke();
}

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault();
    displayFunction(document.getElementById('func').value);
});

drawAxes();