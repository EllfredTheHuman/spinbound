// =====================================================
// SPINBOUND
// =====================================================


// =====================================================
// GAME STATE
// =====================================================

let money = 100;

let quota = 150;

let spinsLeft = 10;

let round = 1;

let spinning = false;


// =====================================================
// WHEEL STATS
// =====================================================

let winChance = 50;

let winPayoutMultiplier = 1;

let lossMultiplier = 1;


// =====================================================
// UPGRADES
// =====================================================

let upgrades = [];

const MAX_UPGRADES = 5;


// =====================================================
// HTML ELEMENTS
// =====================================================

const moneyDisplay =
    document.getElementById("money");

const quotaDisplay =
    document.getElementById("quota");

const spinsDisplay =
    document.getElementById("spins");

const roundDisplay =
    document.getElementById("round");

const resultDisplay =
    document.getElementById("result");

const spinButton =
    document.getElementById("spinButton");

const wheel =
    document.getElementById("wheel");

const upgradeList =
    document.getElementById("upgradeList");

const upgradeCount =
    document.getElementById("upgradeCount");

const gameOver =
    document.getElementById("gameOver");

const gameOverReason =
    document.getElementById("gameOverReason");

const restartButton =
    document.getElementById("restartButton");


// =====================================================
// UPDATE SCREEN
// =====================================================

function updateScreen() {

    moneyDisplay.textContent =
        "$" + Math.floor(money);


    quotaDisplay.textContent =
        "$" + Math.floor(quota);


    spinsDisplay.textContent =
        spinsLeft;


    roundDisplay.textContent =
        round;


    upgradeCount.textContent =
        upgrades.length + " / " + MAX_UPGRADES;


    // Update upgrade display

    if (upgrades.length === 0) {

        upgradeList.innerHTML =
            '<div class="empty">NO MODIFICATIONS</div>';

        return;
    }


    upgradeList.innerHTML = "";


    upgrades.forEach(function(upgrade) {

        const box =
            document.createElement("div");

        box.className =
            "empty";

        box.textContent =
            upgrade.name;

        upgradeList.appendChild(box);

    });

}


// =====================================================
// SPIN
// =====================================================

spinButton.onclick = function() {

    if (spinning) {
        return;
    }


    if (spinsLeft <= 0) {
        return;
    }


    spinning = true;

    spinButton.disabled = true;


    // One spin consumed

    spinsLeft--;

    updateScreen();


    resultDisplay.textContent =
        "THE WHEEL TURNS...";


    // =================================================
    // DETERMINE RESULT
    // =================================================

    const randomNumber =
        Math.random() * 100;


    const won =
        randomNumber < winChance;


    // =================================================
    // WHEEL ANIMATION
    // =================================================

    const fullSpins =
        5 + Math.floor(Math.random() * 3);


    let landingAngle;


    if (won) {

        landingAngle =
            45 + Math.random() * 120;

    } else {

        landingAngle =
            225 + Math.random() * 120;

    }


    const finalRotation =
        fullSpins * 360 + landingAngle;


    wheel.style.transform =
        "rotate(" + finalRotation + "deg)";


    // =================================================
    // FINISH
    // =================================================

    setTimeout(function() {

        if (won) {

            const baseWin = 50;

            const winnings =
                Math.floor(
                    baseWin *
                    winPayoutMultiplier
                );


            money += winnings;


            resultDisplay.textContent =
                "WIN. +$" + winnings;

        } else {

            const baseLoss = 30;

            const loss =
                Math.floor(
                    baseLoss *
                    lossMultiplier
                );


            money -= loss;


            if (money < 0) {
                money = 0;
            }


            resultDisplay.textContent =
                "LOSE. -$" + loss;
        }


        updateScreen();


        // =================================================
        // QUOTA CHECK
        // =================================================

        if (money >= quota) {

            completeRound();

            return;
        }


        // =================================================
        // SPIN LIMIT CHECK
        // =================================================

        if (spinsLeft <= 0) {

            endGame(
                "THE QUOTA WAS NOT REACHED IN 10 SPINS."
            );

            return;
        }


        spinning = false;

        spinButton.disabled = false;


    }, 2500);

};


// =====================================================
// COMPLETE ROUND
// =====================================================

function completeRound() {

    spinning = false;

    spinButton.disabled = true;


    resultDisplay.textContent =
        "QUOTA REACHED.";


    setTimeout(function() {

        showUpgradeChoices();

    }, 800);

}


// =====================================================
// NEXT ROUND
// =====================================================

function startNextRound() {

    round++;

    // NEW ROUND = 10 SPINS

    spinsLeft = 10;


    // Increase quota

    quota =
        Math.floor(quota * 1.75);


    resultDisplay.textContent =
        "ROUND " + round;


    updateScreen();


    spinning = false;

    spinButton.disabled = false;

}


// =====================================================
// POSSIBLE UPGRADES
// =====================================================

const possibleUpgrades = [

    {
        name: "+5% WIN CHANCE",
        type: "winChance",
        value: 5
    },

    {
        name: "+10% WIN CHANCE",
        type: "winChance",
        value: 10
    },

    {
        name: "+15% WIN PAYOUT",
        type: "winPayout",
        value: 0.15
    },

    {
        name: "+25% WIN PAYOUT",
        type: "winPayout",
        value: 0.25
    },

    {
        name: "-10% LOSS",
        type: "lossReduction",
        value: 0.10
    },

    {
        name: "-20% LOSS",
        type: "lossReduction",
        value: 0.20
    },

    {
        name: "+5% WIN / -5% LOSS",
        type: "balanced",
        value: 5
    },

    {
        name: "+15% WIN / +10% LOSS",
        type: "risky",
        value: 15
    }

];


// =====================================================
// SHOW THREE RANDOM UPGRADES
// =====================================================

function showUpgradeChoices() {

    upgradeList.innerHTML = "";


    const choices = [];


    while (choices.length < 3) {

        const randomIndex =
            Math.floor(
                Math.random() *
                possibleUpgrades.length
            );


        const upgrade =
            possibleUpgrades[randomIndex];


        if (!choices.includes(upgrade)) {

            choices.push(upgrade);

        }

    }


    choices.forEach(function(upgrade) {

        const button =
            document.createElement("button");


        button.textContent =
            upgrade.name;


        button.onclick = function() {

            chooseUpgrade(upgrade);

        };


        upgradeList.appendChild(button);

    });

}


// =====================================================
// CHOOSE UPGRADE
// =====================================================

function chooseUpgrade(upgrade) {

    if (upgrades.length >= MAX_UPGRADES) {

        resultDisplay.textContent =
            "THE WHEEL IS FULL.";

        return;
    }


    upgrades.push(upgrade);


    // =================================================
    // APPLY UPGRADE
    // =================================================

    if (upgrade.type === "winChance") {

        winChance += upgrade.value;


        if (winChance > 95) {

            winChance = 95;

        }

    }


    else if (upgrade.type === "winPayout") {

        winPayoutMultiplier +=
            upgrade.value;

    }


    else if (upgrade.type === "lossReduction") {

        lossMultiplier -=
            upgrade.value;


        if (lossMultiplier < 0.05) {

            lossMultiplier = 0.05;

        }

    }


    else if (upgrade.type === "balanced") {

        winChance += 5;

        lossMultiplier -= 0.05;


        if (winChance > 95) {

            winChance = 95;

        }


        if (lossMultiplier < 0.05) {

            lossMultiplier = 0.05;

        }

    }


    else if (upgrade.type === "risky") {

        winChance += 15;

        lossMultiplier += 0.10;


        if (winChance > 95) {

            winChance = 95;

        }

    }


    updateScreen();


    resultDisplay.textContent =
        "MODIFICATION INSTALLED.";


    setTimeout(function() {

        startNextRound();

    }, 700);

}


// =====================================================
// GAME OVER
// =====================================================

function endGame(reason) {

    spinning = false;

    spinButton.disabled = true;


    gameOverReason.textContent =
        reason;


    gameOver.classList.remove("hidden");

}


// =====================================================
// RESTART
// =====================================================

restartButton.onclick = function() {

    money = 100;

    quota = 150;

    spinsLeft = 10;

    round = 1;


    winChance = 50;

    winPayoutMultiplier = 1;

    lossMultiplier = 1;


    upgrades = [];


    wheel.style.transform =
        "rotate(0deg)";


    resultDisplay.textContent =
        "INSERT COURAGE.";


    gameOver.classList.add("hidden");


    spinButton.disabled = false;


    updateScreen();

};


// =====================================================
// START
// =====================================================

updateScreen();
