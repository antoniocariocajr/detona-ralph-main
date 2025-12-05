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
        hitPosition:0,
        result:0,
        curretTime:20,
        pointLive:3,
        bestScore:0,
        totalScore:0,
        level:1,
        gameVelocity: 900
    },
    actions:{
        timeId: setInterval(randomSquare,1000),
        countDownTimeId: setInterval(countDown,1000),
    }
}

function randomSquare(){
    state.view.squares.forEach((square)=>{
        square.classList.remove("enemy")
        square.classList.remove("hitEnemy")
    })
    const randomNumber = Math.floor(Math.random()*9)
    const randomSquare = state.view.squares[randomNumber]
    randomSquare.classList.add("enemy")
    state.value.hitPosition = randomSquare.id
}

//function moveEnemy(){
//    state.value.timeId = setInterval(randomSquare, state.value.gameVelocity)
//}

function addListenerHitBox(){
    state.view.squares.forEach((square)=>{
        square.addEventListener("mousedown",()=>{
            if(square.id=== state.value.hitPosition){
                state.value.result++
                state.view.score.textContent = state.value.result
                square.classList.add("hitEnemy")
                state.value.hitPosition = null
                playSound()
            }
        })
    })
}

function countDown(){
    state.value.curretTime--
    state.view.timeLeft.textContent = state.value.curretTime
    if(state.value.curretTime<=0){
        if(state.value.result<10){
        alert("Tente novamente! O seu resultado foi: "+state.value.result)
        liveDown()
        }else{
            levelUp()
        }
        state.value.result = 0
        state.value.curretTime = 20
        state.view.timeLeft.textContent = state.value.curretTime
        state.view.score.textContent = state.value.result
    }
}
function levelUp(){
    state.value.level++
    state.view.level.textContent = state.value.level
    alert("Parabens! Você avançou para o nivel: "+state.value.level)
    state.value.gameVelocity-=50
    clearInterval(state.actions.timeId)  
    state.actions.timeId = setInterval(randomSquare,state.value.gameVelocity)
    updateScore()
}

function liveDown(){
    updateScore()
    state.value.pointLive--
    state.view.lives.textContent = state.value.pointLive + "X"
    if(state.value.pointLive<=0){
        clearInterval(state.actions.countDownTimeId)
        clearInterval(state.actions.timeId)   
        alert("Game Over! O seu melhor resultado foi: "+state.value.bestScore)
    }
}

function updateScore(){
    if(state.value.bestScore<state.value.result) {
        state.value.bestScore=state.value.result
        state.view.bestScore.textContent = state.value.bestScore
    }
    state.value.totalScore +=  state.value.result
    state.view.totalScore.textContent = state.value.totalScore
}

function playSound(){
    let audio = new Audio("./scr/audios/hit.m4a");
    audio.volume = 0.2;
    audio.play();
}

function init(){
 //   moveEnemy()
    addListenerHitBox()
}

init()