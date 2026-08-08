// =========================
// SPINBOUND
// =========================

// Game settings
let money = 100;
let quota = 150;
let round = 1;

let spinning = false;

// Starting wheel chance
let winChance = 50;

// Upgrade slots
let upgrades = [];
const MAX_UPGRADES = 5;


// =========================
// ELEMENTS
// =========================

const moneyDisplay = document.getElementById("money");
const quotaDisplay = document.getElementById("quota");
const spinButton = document.getElementById("spinButton");
const resultDisplay = document.getElementById("result");
const upgradeList = document.getElementById("upgradeList");


// =========================
// UPDATE SCREEN
// =========================

function updateScreen() {

    moneyDisplay.textContent = "$" + money;
    quotaDisplay.textContent = "$" + quota;

    if (upgrades.length === 0) {
        upgradeList.innerHTML = "<p>No upgrades yet.</p>";
    } else {
        upgradeList.innerHTML = "";

        upgrades.forEach(function(upgrade) {

            const item = document.createElement("p");

            item.textContent = "• " + upgrade.name;

            upgradeList.appendChild(item);

        });
    }
}


// =========================
// SPIN
// =========================

spinButton.onclick = function() {

    if (spinning) return;

    spinning = true;

    spinButton.disabled = true;

    resultDisplay.textContent = "Spinning...";

    // Small delay so the spin feels like an actual event
    setTimeout(function() {

        const randomNumber = Math.random() * 100;

        if (randomNumber < winChance) {

            // WIN
            const winnings = 50;

            money += winnings;

            resultDisplay.textContent =
                "WIN! +$" + winnings;

        } else {

            // LOSE
            const loss = 30;

            money -= loss;

            resultDisplay.textContent =
                "LOSE! -$" + loss;
        }

        // Prevent money from going below zero
        if (money < 0) {
            money = 0;
        }

        updateScreen();

        checkGameState();

        spinning = false;

        if (money > 0) {
            spinButton.disabled = false;
        }

    }, 1000);
};


// =========================
// CHECK GAME STATE
// =========================

function checkGameState() {

    // GAME OVER
    if (money <= 0) {

        resultDisplay.textContent =
            "GAME OVER! You ran out of money.";

        spinButton.disabled = true;

        return;
    }


    // QUOTA COMPLETE
    if (money >= quota) {

        resultDisplay.textContent =
            "QUOTA COMPLETE!";

        spinButton.disabled = true;

        setTimeout(function() {
            nextRound();
        }, 1500);
    }
}


// =========================
// NEXT ROUND
// =========================

function nextRound() {

    round++;

    // Increase quota
    quota = Math.floor(quota * 1.75);

    resultDisplay.textContent =
        "Round " + round + "! Choose an upgrade.";

    showUpgradeChoices();
}


// =========================
// UPGRADE CHOICES
// =========================

const possibleUpgrades = [

    {
        name: "+5% WIN chance",
        type: "winChance",
        value: 5
    },

    {
        name: "+10% WIN chance",
        type: "winChance",
        value: 10
    },

    {
        name: "+15% WIN payout",
        type: "winPayout",
        value: 15
    },

    {
        name: "-10% LOSS",
        type: "lossReduction",
        value: 10
    },

    {
        name: "-20% LOSS",
        type: "lossReduction",
        value: 20
    },

    {
        name: "+25% WIN payout",
        type: "winPayout",
        value: 25
    }

];


// =========================
// SHOW 3 RANDOM UPGRADES
// =========================

function showUpgradeChoices() {

    upgradeList.innerHTML = "";

    const choices = [];

    while (choices.length < 3) {

        const randomUpgrade =
            possibleUpgrades[
                Math.floor(Math.random() * possibleUpgrades.length)
            ];

        if (!choices.includes(randomUpgrade)) {
            choices.push(randomUpgrade);
        }
    }


    choices.forEach(function(upgrade) {

        const button = document.createElement("button");

        button.textContent = upgrade.name;

        button.onclick = function() {

            chooseUpgrade(upgrade);

        };

        upgradeList.appendChild(button);

    });
}


// =========================
// CHOOSE UPGRADE
// =========================

function chooseUpgrade(upgrade) {

    if (upgrades.length >= MAX_UPGRADES) {

        resultDisplay.textContent =
            "Your wheel is full!";

        return;
    }

    upgrades.push(upgrade);


    // Apply upgrade
    if (upgrade.type === "winChance") {

        winChance += upgrade.value;

        // Don't allow 100%+ win chance
        if (winChance > 95) {
            winChance = 95;
        }
    }


    updateScreen();

    resultDisplay.textContent =
        "Upgrade added!";

    spinButton.disabled = false;

    // Clear upgrade buttons
    upgradeList.innerHTML =
        "<p>Upgrade equipped! " +
        upgrades.length +
        "/5</p>";
}


// =========================
// START GAME
// =========================

updateScreen();
