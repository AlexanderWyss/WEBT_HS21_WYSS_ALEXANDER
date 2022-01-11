<?php

class Population
{
    public int $beggars;
    public int $peasants;
    public int $citizens;
    public int $patricians;
    public int $noblemen;
    public int $nomads;
    public int $envoys;
}

class Needs
{
    public float $fish;
    public float $spice;
    public float $bread;
    public float $meat;
    public float $cider;
    public float $beer;
    public float $wine;
    public float $linen;
    public float $leather;
    public float $fur;
    public float $robe;
    public float $books;
    public float $candle;
    public float $glasses;
    public float $dates;
    public float $milk;
    public float $carpets;
    public float $coffee;
    public float $pearls;
    public float $perfume;
    public float $marzipan;
}

$needsTranslation = [
    "fish" => "Fisch",
    "spice" => "Gewürz",
    "bread" => "Brot",
    "meat" => "Fleisch",
    "cider" => "Most",
    "beer" => "Bier",
    "wine" => "Wein",
    "linen" => "Linen",
    "leather" => "Leder",
    "fur" => "Fell",
    "robe" => "Roben",
    "books" => "Bücher",
    "candle" => "Kerzen",
    "glasses" => "Brillen",
    "dates" => "Datteln",
    "milk" => "Milch",
    "carpets" => "Teppich",
    "coffee" => "Kaffee",
    "pearls" => "Perlen",
    "perfume" => "Parfüm",
    "marzipan" => "Marzipan"
];

function calculateNeeds(Population $population): Needs
{
    $needs = new Needs();
    $needs->fish =
        $population->beggars / 285 +
        $population->peasants / 200 +
        $population->citizens / 500 +
        $population->patricians / 909 +
        $population->noblemen / 1250;
    $needs->spice =
        $population->citizens / 500 +
        $population->patricians / 909 +
        $population->noblemen / 1250;
    $needs->bread =
        $population->patricians / 727 +
        $population->noblemen / 1025;
    $needs->meat =
        $population->noblemen / 1136;
    $needs->cider =
        $population->beggars / 500 +
        $population->peasants / 340 +
        $population->citizens / 340 +
        $population->patricians / 652 +
        $population->noblemen / 1153;
    $needs->beer =
        ($population->patricians > 510 ? ($population->patricians / 625) : 0) +
        $population->noblemen / 1071;
    $needs->wine =
        ($population->noblemen > 1500 ? ($population->noblemen / 1000) : 0);
    $needs->linen =
        $population->citizens / 476 +
        $population->patricians / 1052 +
        $population->noblemen / 2500;
    $needs->leather =
        ($population->patricians > 690 ? ($population->patricians / 1428) : 0) +
        $population->noblemen / 2500;
    $needs->fur =
        ($population->noblemen > 950 ? ($population->noblemen / 1562) : 0);
    $needs->robe =
        ($population->noblemen > 4000 ? ($population->noblemen / 2112) : 0);
    $needs->books =
        ($population->patricians > 940 ? ($population->patricians / 1875) : 0) +
        $population->noblemen / 3333;
    $needs->candle =
        $population->noblemen > 3000
            ? $population->patricians / 2500 +
            $population->noblemen / 3333
            : 0;
    $needs->glasses =
        ($population->noblemen > 2200 ? ($population->noblemen / 1709) : 0);
    $needs->dates =
        $population->nomads / 450 +
        $population->envoys / 600;
    $needs->milk =
        ($population->nomads > 145 ? ($population->nomads / 436) : 0) +
        $population->envoys / 666;
    $needs->carpets =
        ($population->nomads > 295 ? ($population->nomads / 909) : 0) +
        $population->envoys / 1500;
    $needs->coffee =
        $population->envoys / 1000;
    $needs->pearls =
        ($population->envoys > 1040 ? ($population->envoys / 751) : 0);
    $needs->perfume =
        ($population->envoys > 2600 ? ($population->envoys / 1250) : 0);
    $needs->marzipan =
        ($population->envoys > 4360 ? ($population->envoys / 2453) : 0);
    return $needs;
}

function populationToString(Population $population): string
{
    $stringValue = "";
    foreach ($population as $key => $value) {
        $stringValue .= $key . ":" . $value . ";";
    }
    return $stringValue;
}

function stringToPopulation(string $populationString): Population
{
    $populationValues = explode(";", $populationString);
    $population = new Population();
    foreach ($populationValues as $populationValue) {
        if (!empty($populationValue)) {
            $keyValue = explode(":", $populationValue);
            if (count($keyValue) == 2) {
                $key = $keyValue[0];
                $population->$key = validateInt($keyValue[1]);
            }
        }
    }
    return $population;
}

function validateInt(string $value): int
{
    if (is_numeric($value)) {
        $intValue = (int)$value;
        if ($intValue >= 0) {
            return $intValue;
        }
    }
    if (empty($value)) {
        return 0;
    }
    throw new InvalidArgumentException();
}

function readPopulationFromRequest(): Population
{
    $population = new Population();
    $population->beggars = validateInt($_POST['beggars']);
    $population->peasants = validateInt($_POST['peasants']);
    $population->citizens = validateInt($_POST['citizens']);
    $population->patricians = validateInt($_POST['patricians']);
    $population->noblemen = validateInt($_POST['noblemen']);
    $population->nomads = validateInt($_POST['nomads']);
    $population->envoys = validateInt($_POST['envoys']);
    return $population;
}

function readComparisonTypeFromRequest(): string
{
    if (isset($_POST["comparisonType"])) {
        $comparisonType = $_POST["comparisonType"];
        if (in_array($comparisonType, ["new", "compare", "none"])) {
            return $comparisonType;
        }
    }
    throw new InvalidArgumentException();
}

function readNameTypeFromRequest(): string
{
    if (isset($_POST["name"])) {
        $name = trim($_POST["name"]);
        if (!empty($name)) {
            return $name;
        }
    }
    throw new InvalidArgumentException();
}

$population = readPopulationFromRequest();
$needs = calculateNeeds($population);

$comparisonType = readComparisonTypeFromRequest();
if ($comparisonType == 'new' || $comparisonType == 'compare') {
    $name = readNameTypeFromRequest();
    if ($comparisonType == 'compare') {
        $previousNeeds = calculateNeeds(stringToPopulation($_COOKIE[$name . "_population"]));
    }
    setcookie($name . "_population", populationToString($population), time() + 60 * 60 * 24 * 30);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Anno 1404</title>
    <meta name="description" content="Anno 1404 Bedürfnisrechner">
    <meta name="author" content="Alexander Wyss">

    <link rel="icon" href="img/favicon.ico">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="css/style.css?v=1.0">
</head>
<body>
<header class="w3-container">
    <h3>Anno 1404 Bedürfnisrechner</h3>
</header>
<section>
    <article>
        <ul>
            <?php
            foreach ($needs as $key => $value) {
                echo "<li>" . $needsTranslation[$key] . ": " . number_format($value, 2);
                if (isset($previousNeeds)) {
                    $needsDiff = $value - $previousNeeds->$key;
                    echo " <small>" . ($needsDiff >= 0 ? '+' : '') . number_format($needsDiff, 2) . "</small>";
                }
                echo "</li>";
            }
            ?>
        </ul>
    </article>
    <a href=".">Zurück</a>
</section>
<footer><small>&copy; Copyright 2021, Alexander Wyss</small></footer>
</body>
</html>
