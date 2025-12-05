const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        bestScore: document.querySelector("#best-score"),
        totalScore: document.querySelector("#total-score"),
        level: document.querySelector("#level"),
    },
    value: {
        hitPosition: 0,
        result: 0,
        currentTime: 20,
        pointLive: 3,
        bestScore: 0,
        totalScore: 0,
        level: 1,
        gameVelocity: 900
    },
    actions: {
        timeId: null, // Initial null
        countDownTimeId: null // Initial null
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy")
        square.classList.remove("hitEnemy")
    })
    const randomNumber = Math.floor(Math.random() * 9)
    const randomSquare = state.view.squares[randomNumber]
    randomSquare.classList.add("enemy")
    state.value.hitPosition = randomSquare.id
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.value.hitPosition) {
                state.value.result++
                state.view.score.textContent = state.value.result
                square.classList.add("hitEnemy")
                state.value.hitPosition = null
                playSound()
            }
        })
    })
}

function countDown() {
    state.value.currentTime--
    state.view.timeLeft.textContent = state.value.currentTime
    if (state.value.currentTime <= 0) {
        clearInterval(state.actions.countDownTimeId)
        clearInterval(state.actions.timeId)
        if (state.value.result < 10) {
            // Game Over
            showModal("Game Over!", "Your score: " + state.value.result, "Restart");
        } else {
            // Level Up (Wait, original logic reset time and level up immediately without stopping much, but let's pause?)
            // The original code reset result to 0 and time to 20 immediately after alert.
            // We will show modal for "Level Up" then user clicks "Next Level"
            showModal("Level Up!", "Congratulations! You advanced to level " + (state.value.level + 1), "Next Level", true);
        }
    }
}

function bindModalEvents() {
    const modalBtn = document.querySelector("#modal-btn");
    modalBtn.addEventListener("click", () => {
        closeModal();
        if (modalBtn.dataset.action === "restart") {
            resetGame();
        } else if (modalBtn.dataset.action === "nextLevel") {
            levelUpAction();
        } else {
            // Start Game
            startGame();
        }
    });
}

function showModal(title, message, btnText, isLevelUp = false) {
    const modal = document.querySelector("#modal");
    const modalTitle = document.querySelector("#modal-title");
    const modalMessage = document.querySelector("#modal-message");
    const modalBtn = document.querySelector("#modal-btn");

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalBtn.textContent = btnText;
    modal.classList.add("visible");

    if (isLevelUp) {
        modalBtn.dataset.action = "nextLevel";
    } else if (title.includes("Game Over")) {
        modalBtn.dataset.action = "restart";
    } else {
        modalBtn.dataset.action = "start";
    }
}

function closeModal() {
    const modal = document.querySelector("#modal");
    modal.classList.remove("visible");
}

function startGame() {
    state.value.currentTime = 20;
    state.view.timeLeft.textContent = state.value.currentTime;
    state.value.result = 0;
    state.view.score.textContent = state.value.result;
    state.actions.timeId = setInterval(randomSquare, state.value.gameVelocity);
    state.actions.countDownTimeId = setInterval(countDown, 1000);
}

function resetGame() {
    state.value.pointLive = 3;
    state.view.lives.textContent = "3x";
    state.value.level = 1;
    state.view.level.textContent = state.value.level;
    state.value.gameVelocity = 900;
    startGame();
}

function levelUpAction() {
    state.value.level++
    state.view.level.textContent = state.value.level
    state.value.gameVelocity -= 50
    state.value.result = 0; // Reset score for new level
    state.view.score.textContent = state.value.result

    startGame();
}

function liveDown() {
    updateScore()
    state.value.pointLive--
    state.view.lives.textContent = state.value.pointLive + "X"
    if (state.value.pointLive <= 0) {
        clearInterval(state.actions.countDownTimeId)
        clearInterval(state.actions.timeId)
        showModal("Game Over!", "Your best score was: " + state.value.bestScore, "Restart");
    }
}

function updateScore() {
    if (state.value.bestScore < state.value.result) {
        state.value.bestScore = state.value.result
        state.view.bestScore.textContent = state.value.bestScore
    }
    state.value.totalScore += state.value.result
    state.view.totalScore.textContent = state.value.totalScore
}

function playSound() {
    let audio = new Audio("./src/audios/hit.m4a");
    audio.volume = 0.2;
    audio.currentTime = 0; // Rewind to start
    audio.play();
}

function init() {
    bindModalEvents();
    addListenerHitBox();
    // Show Start Screen
    showModal("Welcome!", "Ready to smash Ralph?", "Start Game");
}

init()