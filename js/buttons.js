var btnMoveUp, btnMoveForwards, btnMoveBackwards, btnMoveDown, btnJump, btnOption, mobileControls;

    mobileControls = document.getElementById("mobileControls");
    btnMoveUp = document.getElementById("btnMoveUp");
    btnMoveForwards = document.getElementById("btnMoveForwards");
    btnMoveBackwards = document.getElementById("btnMoveBackwards");
    btnMoveDown = document.getElementById("btnMoveDown");
    btnJump = document.getElementById("btnJump");
    btnOption = document.getElementById("btnOption");
    btnStart = document.getElementById("btnStart");

function bindButtons(){
    
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
}

function mobileBtnPressed(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }
    if(this.id=="btnJump") {
    	// createjs.Ticker.addEventListener("tick", jump);
        jump();
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
    	// createjs.Ticker.removeEventListener("tick", jump);
        $('#introBtnK').removeClass('pressed');
        $('#btns').removeClass('pressedJump');
    }
    if(this.id=="btnWheelie") {
    	createjs.Ticker.removeEventListener("tick", shoot);
        $('#btns').removeClass('pressedWheelie');
    }
    
}