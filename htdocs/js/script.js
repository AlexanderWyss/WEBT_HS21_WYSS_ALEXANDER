function getCookie(name) {
    return decodeURIComponent(document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');
}

function getDataOptions() {
    let cookies = document.cookie.split(";");
    let dataOptions = [];
    for (const cookie of cookies) {
        let pair = cookie.split("=");
        let name = decodeURIComponent(pair[0]);
        if (name.endsWith("_population")) {
            dataOptions.push(name.substring(0, name.length - 11).trim());
        }
    }
    return dataOptions;
}

function setPopulation(name, population) {
    let populationCookie = getCookie(name + "_population");
    let populationValues = populationCookie.split(";");
    for (let populationValue of populationValues) {
        if (populationValue && populationValue !== '') {
            let keyValue = populationValue.split(":");
            if (keyValue.length === 2) {
                population[keyValue[0]] = keyValue[1];
            }
        }
    }
}

let canvasWidth;
let canvasHeight;

function resizeCanvas(canvas) {
    const containerWidth = document.getElementById("canvas-section").clientWidth - 32;
    canvasWidth = containerWidth < 800 ? containerWidth : 800;
    canvasHeight = 600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function getCanvas() {
    return document.getElementById("canvas");
}

function getCanvasContext(canvas) {
    let context = canvas.getContext("2d");
    context.font = 10 + 'px Arial';
    return context;
}

function clearCanvas(c) {
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    c.beginPath();
}

function run() {
    const canvas = getCanvas();
    const canvasContext = getCanvasContext(canvas);
    new Vue({
        el: '#form',
        data: {
            comparisonType: "none",
            name: "",
            dataOptions: getDataOptions(),
            population: {
                beggars: 0,
                peasants: 0,
                citizens: 0,
                patricians: 0,
                noblemen: 0,
                nomads: 0,
                envoys: 0
            },
            error: null
        },
        methods: {
            onComparisonTypeChange() {
                this.name = "";
            },
            onSelectedComparisonChange() {
                setPopulation(this.name, this.population);
                this.onPopulationChange();
            },
            onNameChange() {
                this.name = this.name.trim();
            },
            validate(e) {
                if (this.comparisonType === 'new') {
                    if (this.dataOptions.includes(this.name)) {
                        this.error = "Name existiert bereits.";
                        e.preventDefault();
                        return;
                    } else if (this.name.endsWith("_population")) {
                        this.error = "Name darf nicht mit _population enden.";
                        e.preventDefault()
                        return;
                    }
                }
                this.error = null;
            },
            reset() {
                this.comparisonType = 'none';
                this.name = "";
                for (const populationKey in this.population) {
                    this.population[populationKey] = 0;
                }
                this.onPopulationChange();
            },
            onPopulationChange() {
                clearCanvas(canvasContext);
                resizeCanvas(canvas);

                let maxPopulation = Math.max(...Object.values(this.population));
                if (maxPopulation === 0) {
                    maxPopulation = canvasHeight;
                }

                // bars
                let populationKeys = Object.keys(this.population);
                let spacePerBar = canvasWidth / populationKeys.length;
                const padding = spacePerBar * 0.2;
                const barWidth = spacePerBar - padding;
                for (let i = 0; i < populationKeys.length; i++) {
                    let populationKey = populationKeys[i];
                    let populationValue = this.population[populationKey];

                    const height = canvasHeight / maxPopulation * populationValue;
                    let x = (i * (barWidth + padding)) + padding;
                    let y = canvasHeight - height;
                    canvasContext.fillStyle = "#009688";
                    canvasContext.fillRect(x, y, barWidth, height);

                    const imageSize = barWidth * 0.75;
                    const imagePadding = (barWidth - imageSize) / 2;
                    const image = new Image(imageSize, imageSize);
                    image.onload = () => {
                        canvasContext.drawImage(image, x + imagePadding, y + imagePadding, imageSize, imageSize);
                    }
                    image.src = "img/" + populationKey + ".png";

                    canvasContext.fillStyle = "#000000";
                    canvasContext.fillText(populationValue.toString(),
                        x + imagePadding, y + (2 * imagePadding) + imageSize);
                }

                // axes
                canvasContext.fillStyle = "#000000";
                canvasContext.moveTo(0, 0);
                canvasContext.lineTo(0, canvasHeight);
                canvasContext.stroke();
                for (let i = 0; i <= 10; i++) {
                    const y = canvasHeight - ((canvasHeight / 10) * i);
                    canvasContext.moveTo(0, y);
                    canvasContext.lineTo(padding / 2, y);
                    canvasContext.stroke();
                    canvasContext.fillText(((maxPopulation / 10) * i).toFixed(0),
                        padding / 2 + 1, i === 0 ? y : (i === 10 ? y + 10 : y + 5));
                }
            }
        },
        beforeMount() {
            this.onPopulationChange();
            window.onresize = this.onPopulationChange;
        }
    });
}