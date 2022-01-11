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

    public function __construct(int $beggars, int $peasants, int $citizen, int $patrician, int $noblemen, int $nomads, int $envoys)
    {
        $this->beggars = $beggars;
        $this->peasants = $peasants;
        $this->citizens = $citizen;
        $this->patricians = $patrician;
        $this->noblemen = $noblemen;
        $this->nomads = $nomads;
        $this->envoys = $envoys;
    }
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
    return new Population(validateInt($_POST['beggars']), validateInt($_POST['peasants']), validateInt($_POST['citizens']),
        validateInt($_POST['patricians']), validateInt($_POST['noblemen']), validateInt($_POST['nomads']), validateInt($_POST['envoys']));
}

$population = readPopulationFromRequest();
$needs = calculateNeeds($population);
echo "<ul>";
foreach ($needs as $key => $value) {
    echo "<li>" . $needsTranslation[$key] . ": " . number_format($value, 2) . "</li>";
}
echo "</ul>"
?>
<a href=".">Home</a>