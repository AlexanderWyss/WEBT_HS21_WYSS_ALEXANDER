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
        }
    },
    methods: {
        onComparisonTypeChange() {
            this.name = "";
        },
        onSelectedComparisonChange() {
            setPopulation(this.name, this.population);
        },
        onNameChange() {
            console.log("namechange");
            if (this.dataOptions.includes(this.name) || this.name.endsWith("_population")) {
                throw new Error();
            }
        }
    }
});