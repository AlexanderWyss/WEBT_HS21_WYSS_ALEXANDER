function getCookie(name) {
    return decodeURIComponent(document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');
}

function setPopulationFromCookie() {
    let populationCookie = getCookie("population");
    let populationValues = populationCookie.split(";");
    for (let populationValue of populationValues) {
        if (populationValue && populationValue !== '') {
            let keyValue = populationValue.split(":");
            if (keyValue.length === 2) {
                let key = keyValue[0];
                document.getElementById(key).value = keyValue[1];
            }
        }
    }
}

setPopulationFromCookie();

