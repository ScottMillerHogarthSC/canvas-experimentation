
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
        writeToSidePanel("mute");
    }
    else if(e.code == "Space") {
        gamePause();
        writeToSidePanel("pause");
    } else if(e.code == "KeyZ") {
        zoomInContainer();
        writeToSidePanel("zoom");
    } else {
        writeToSidePanel(e.key);
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
            if(player.weapon==1){
                shoot();
            } else if(player.weapon==2){
                if(!shootBtnDown) {
                    shoot();
                }
            }
        }
        if(!Keyboard.isDown(Keyboard.DOWN)){
            shootBtnDown=false;
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
            && !Keyboard.isDown(Keyboard.UP) 
            && btnsDown.indexOf("btnMoveForwards")==-1
            && btnsDown.indexOf("btnMoveBackwards")==-1 
            && btnsDown.indexOf("btnShoot")==-1) {
            
            isPlayer.runBack=false;
            isPlayer.run=false;
            isPlayer.attackBack=false;
            isPlayer.attack=false;
            isPlayer.jump=false;
            isPlayer.idle=false;
            jumpBtnDown=false;
            shootBtnDown=false;


            if(!moving_backwards) isPlayer.walk=true;
            else isPlayer.idleBack=true;

        }
    }
}

var panel1 = document.getElementById("sidePanel1");
var panel2 = document.getElementById("sidePanel2");
var panel1H = panel1.clientHeight;

var isFirst = true;
var lastTxt = "";
var txtCount = 0;
function writeToSidePanel(thisText){
    if(isFirst){
        isFirst=false;
        panel1.value=thisText;
    } else {
        if(lastTxt==thisText){
            txtCount++;
        } else {
            txtCount=0;
        }
        lastTxt = thisText;
        if(txtCount<1){
            panel1.value+=thisText+" | ";
        }
    }
    if(panel1H < panel1.scrollHeight){
       panel1.scrollTop = panel1.scrollHeight;
    }
}