
var Keyboard = {};
var firstpress = true;

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }

    // play music! 
    if(firstpress){
        firstpress=false;
        if(!noAudio) { 
            audio.play(); 
        }
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

Keyboard.isUp = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};


function checkKeyPress(e){
    // console.log(e.code);

    if(e.code == "KeyM") {
        toggleMuteAudio();
    }
    else if(e.code == "Space") {
        gamePause();
    } else {
        // gamePause();
    }
}


var keysWait = false;
function checkKeys(){ 

    if(!keysWait && !isPlayer.dead && !paused){
    
        if (Keyboard.isDown(Keyboard.RIGHT) && Keyboard.isDown(Keyboard.LEFT)) { 
            return;
        }
        else if (Keyboard.isDown(Keyboard.LEFT)) { 
            backwards();
        }
        else if (Keyboard.isDown(Keyboard.RIGHT)) { 
            forwards();
        }


        if(Keyboard.isDown(Keyboard.DOWN)){
            shoot();
        }

        if(Keyboard.isDown(Keyboard.UP)){
            if(!jumpBtnDown){
                jump();
            } else {
                if(!moving_backwards) isPlayer.walk=true;
                else isPlayer.idleBack=true;
            }
        }
        if(!Keyboard.isDown(Keyboard.UP)){
            jumpBtnDown=false;
        }

        if(!Keyboard.isDown(Keyboard.LEFT) 
            && !Keyboard.isDown(Keyboard.RIGHT) 
            && !Keyboard.isDown(Keyboard.DOWN) 
            && !Keyboard.isDown(Keyboard.UP)) {
            
            isPlayer.runBack=false;
            isPlayer.run=false;
            isPlayer.attackBack=false;
            isPlayer.attack=false;
            isPlayer.jump=false;
            jumpBtnDown=false;


            if(!moving_backwards) isPlayer.walk=true;
            else isPlayer.idleBack=true;

        }
    }
}