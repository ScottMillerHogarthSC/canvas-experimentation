var btnMoveUp, btnMoveForwards, btnMoveBackwards, btnMoveDown, btnJump, btnOption, mobileControls;

    mobileControls = document.getElementById("mobileControls");
    btnMoveUp = document.getElementById("btnMoveUp");
    btnMoveForwards = document.getElementById("btnMoveForwards");
    btnMoveBackwards = document.getElementById("btnMoveBackwards");
    btnMoveDown = document.getElementById("btnMoveDown");
    btnJump = document.getElementById("btnJump");
    btnOption = document.getElementById("btnOption");
    btnStart = document.getElementById("btnStart");
    introContainer = document.getElementById("introContainer");

function bindButtons(){
    if(intro){
        // play music! 
        if(firstpress){
            firstpress=false;
            if(!paused){
                playMusic(audio_music);
            }

        }
        
        intro=false;
        gsap.to(introContainer,0,{display:"none"});
        gsap.to(footer,0,{display:"block",alpha:1});
    }

    container.removeEventListener('click', bindButtons);
    window.removeEventListener('keydown', bindButtons);
    mobileControls.removeEventListener('touchstart', bindButtons);


    createjs.Ticker.addEventListener("tick", checkKeys);

    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

    document.body.addEventListener('keypress', checkKeyPress);
    
    btnMoveUp.addEventListener("touchstart", mobileBtnPressed);
    btnMoveForwards.addEventListener("touchstart", mobileBtnPressed);
    btnMoveBackwards.addEventListener("touchstart", mobileBtnPressed);
    btnMoveDown.addEventListener("touchstart", mobileBtnPressed);
    btnJump.addEventListener("touchstart", mobileBtnPressed);
    btnWheelie.addEventListener("touchstart", mobileBtnPressed);

    btnMoveUp.addEventListener("mousedown", mobileBtnPressed);
    btnMoveForwards.addEventListener("mousedown", mobileBtnPressed);
    btnMoveBackwards.addEventListener("mousedown", mobileBtnPressed);
    btnMoveDown.addEventListener("mousedown", mobileBtnPressed);
    btnJump.addEventListener("mousedown", mobileBtnPressed);
    btnWheelie.addEventListener("mousedown", mobileBtnPressed);

    btnStart.addEventListener('touchend', gamePause);


// mobile buttons released:

    btnMoveUp.addEventListener("touchend", mobileBtnReleased);
    btnMoveForwards.addEventListener("touchend", mobileBtnReleased);
    btnMoveBackwards.addEventListener("touchend", mobileBtnReleased);
    btnMoveDown.addEventListener("touchend", mobileBtnReleased);
    btnJump.addEventListener("touchend", mobileBtnReleased);
    btnWheelie.addEventListener("touchend", mobileBtnReleased);

    btnMoveUp.addEventListener("mouseup", mobileBtnReleased);
    btnMoveForwards.addEventListener("mouseup", mobileBtnReleased);
    btnMoveBackwards.addEventListener("mouseup", mobileBtnReleased);
    btnMoveDown.addEventListener("mouseup", mobileBtnReleased);
    btnJump.addEventListener("mouseup", mobileBtnReleased);
    btnWheelie.addEventListener("mouseup", mobileBtnReleased);

    container.classList.add("noMouse");
}

function unbindButtons(){
    // Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

    document.body.removeEventListener('keypress', checkKeyPress);

    btnMoveUp.removeEventListener("touchstart", mobileBtnPressed);
    btnMoveForwards.removeEventListener("touchstart", mobileBtnPressed);
    btnMoveBackwards.removeEventListener("touchstart", mobileBtnPressed);
    btnMoveDown.removeEventListener("touchstart", mobileBtnPressed);
    btnJump.removeEventListener("touchstart", mobileBtnPressed);
    btnWheelie.removeEventListener("touchstart", mobileBtnPressed);

    btnMoveUp.removeEventListener("mousedown", mobileBtnPressed);
    btnMoveForwards.removeEventListener("mousedown", mobileBtnPressed);
    btnMoveBackwards.removeEventListener("mousedown", mobileBtnPressed);
    btnMoveDown.removeEventListener("mousedown", mobileBtnPressed);
    btnJump.removeEventListener("mousedown", mobileBtnPressed);
    btnWheelie.removeEventListener("mousedown", mobileBtnPressed);

    btnStart.removeEventListener('touchend', gamePause);


// mobile buttons released:

    btnMoveUp.removeEventListener("touchend", mobileBtnReleased);
    btnMoveForwards.removeEventListener("touchend", mobileBtnReleased);
    btnMoveBackwards.removeEventListener("touchend", mobileBtnReleased);
    btnMoveDown.removeEventListener("touchend", mobileBtnReleased);
    btnJump.removeEventListener("touchend", mobileBtnReleased);
    btnWheelie.removeEventListener("touchend", mobileBtnReleased);

    btnMoveUp.removeEventListener("mouseup", mobileBtnReleased);
    btnMoveForwards.removeEventListener("mouseup", mobileBtnReleased);
    btnMoveBackwards.removeEventListener("mouseup", mobileBtnReleased);
    btnMoveDown.removeEventListener("mouseup", mobileBtnReleased);
    btnJump.removeEventListener("mouseup", mobileBtnReleased);
    btnWheelie.removeEventListener("mouseup", mobileBtnReleased);

    container.classList.remove("noMouse");
}

function bindRestartButtons(){
    unbindButtons();

    restart_btn.addEventListener("click", restartGame);
    restart_btn_mobile.addEventListener("touchend", restartGame);
    btnStart.addEventListener("touchend", restartGame);
}

function unbindRestartButtons(){
    restart_btn.removeEventListener("click", restartGame);
    restart_btn_mobile.removeEventListener("touchend", restartGame);
    btnStart.removeEventListener("touchend", restartGame);
}

function bindContinueButtons(){
    unbindButtons();

    continue_btn.addEventListener("click", continueGame);
    continue_btn_mobile.addEventListener("touchend", continueGame);
    window.addEventListener('keydown', continueGame);
}

function unbindContinueButtons(){
    continue_btn.removeEventListener("click", continueGame);
    continue_btn_mobile.removeEventListener("touchend", continueGame);
    window.removeEventListener('keydown', continueGame);
}

var btnsDown = [];
function mobileBtnPressed(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }
    // log(this.id+" pressed");
    if(!btnsDown.includes(this.id)){
        btnsDown.push(this.id);
        log(btnsDown);
    }

    if(this.id=="btnJump") {
        if(!jumpBtnDown){
            jump();
        } else {
            if(!moving_backwards) isPlayer.walk=true;
            else isPlayer.idleBack=true;
        }
        $('#btns').addClass('pressedJump');
    }
    if(this.id=="btnWheelie") {
    	createjs.Ticker.addEventListener("tick", shoot);
        $('#btns').addClass('pressedWheelie');
    }
    if(this.id=="btnMoveForwards") {
    	createjs.Ticker.addEventListener("tick", forwards);
        $('#btnsMove').addClass('forwards');
    }
    if(this.id=="btnMoveBackwards") {
    	createjs.Ticker.addEventListener("tick", backwards);
        $('#btnsMove').addClass('backwards');
    }
}

function mobileBtnReleased(ev) {
    if(ev.cancelable) {
        ev.preventDefault();
    }
    var index = btnsDown.indexOf(this.id);
    if (index > -1) {
        btnsDown.splice(index, 1);
        // log(btnsDown);
    }

    if(this.id=="btnMoveForwards") {
    	createjs.Ticker.removeEventListener("tick", forwards);
        $('#btnsMove').removeClass("forwards");
        $('#introBtn').removeClass('pressedD');
    }
    if(this.id=="btnMoveBackwards") {
    	createjs.Ticker.removeEventListener("tick", backwards);
        $('#btnsMove').removeClass("backwards");
        $('#introBtn').removeClass('pressedA');
    }
    if(this.id=="btnJump") {
    	$('#introBtnK').removeClass('pressed');
        $('#btns').removeClass('pressedJump');
    }
    if(this.id=="btnWheelie") {
    	createjs.Ticker.removeEventListener("tick", shoot);
        $('#btns').removeClass('pressedWheelie');
    }

    // // if(btnsDown.indexOf("btnMoveForwards")>-1){
    // //     log('btnMoveForwards still pressed')
    // //     createjs.Ticker.addEventListener("tick", forwards);
    // // }
    // // if(btnsDown.indexOf("btnMoveBackwards")>-1){
    // //     createjs.Ticker.addEventListener("tick", backwards);
    // // }
    // // if(btnsDown.indexOf("btnWheelie")>-1){
    // //     log('btnWheelie still pressed')
    // //     createjs.Ticker.addEventListener("tick", shoot);
    // // }
    // log("isPlayer.run"+isPlayer.run);
}