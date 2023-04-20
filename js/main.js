var wrap,container,audio,audio_shoot,noAudio=false;
var body = document.body,
html = document.documentElement;
var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
html.clientHeight, html.scrollHeight, html.offsetHeight );

var mobile = false;

var windowwidth;

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isFirefox=false;
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
    isFirefox=true;
}

var bg_canvas = document.getElementById('bg-canvas');
var bgOverlay_canvas = document.getElementById('bgOverlay-canvas');
var fg_canvas = document.getElementById('fg-canvas');
var player_canvas = document.getElementById('player-canvas');
var enemy_canvas = document.getElementById('enemy-canvas');
var hud_canvas = document.getElementById('hud-canvas');
var score_txt = document.getElementById('score_txt');
var died_txt = document.getElementById('died_txt');
var restart_btn = document.getElementById("restart_btn");
//dev tools
var frameRate_txt = document.getElementById("frameRate_txt");
var frameRate_btn = document.getElementById("frameRate_btn");


bg_canvas.width=canvas.width;
bg_canvas.height=canvas.height;

fg_canvas.width=canvas.width;
fg_canvas.height=canvas.height;

player_canvas.width=canvas.width;
player_canvas.height=canvas.height;

enemy_canvas.width=canvas.width;
enemy_canvas.height=canvas.height;

bgOverlay_canvas.width=canvas.width;
bgOverlay_canvas.height=canvas.height;

hud_canvas.width=canvas.width;
hud_canvas.height=canvas.height;

var ctxBG = bg_canvas.getContext('2d');
var ctxOverlay = bgOverlay_canvas.getContext('2d');
var ctxFG = fg_canvas.getContext('2d');

var ctxPlayer = player_canvas.getContext('2d');
var ctxHud = hud_canvas.getContext('2d');
var ctxEnemy = enemy_canvas.getContext('2d');

var imageAdded= 0,
    imgLoaded = 0;

var full_health = 100;
var full_lives = 3;
var score = {curr:0};


var nearEdge = {left:false,right:false}

var sprite_x = {playerX:0, enemyX:0, shootX:0, explosionX:0};

var spritesheetW = {playerW: player_idle.width, enemyW:enemiesList[0][0].width, shootW:player_shoot.width, explosionW:explosion.width }; // sprites width

var counter=0;
    
var isSongToEnding=false; 
var collided=false; 
var paused=false;
var muted = false;
var noEnemies = false;
var moving_backwards = false; 

var tlJump = gsap.timeline({paused:true});
tlJump = gsap.timeline({paused:true});

var deathTL = gsap.timeline({paused:true});

// dev Tools
var devTools = false;
var highlights=false;
var frameRate = 100;
var zoomIn = false;
var zoomSpeed = 1;


function initCanvasAnim(){

    // pre load all images:
    
    // background 
        bgsList.forEach(depictBgs);


    // buildings 
        buildingsList.forEach(depictBuildings);
        

    // lamps + road
        fgsList.forEach(depictForegrounds);

    // overlay

        bgOverlay_img = new Image();
        imageAdded++;
        bgOverlay_img.src = bgOverlay.url;
        bgOverlay_img.onload = function(){
            ctxOverlay.drawImage(bgOverlay_img, bgOverlay.x, bgOverlay.y, bgOverlay.width, bgOverlay.height);
            imgLoaded++;
        }


    // player
        init_renderPlayer();


    // enemy
    for(i=0; i<enemiesList.length; i++){
        enemiesList[i].forEach(depictEnemy);
    }
    


    
    

    createjs.Ticker.addEventListener("tick", updateStage);
    createjs.Ticker.addEventListener("tick", checkKeys);
    createjs.Ticker.framerate = frameRate;
    // createjs.Ticker.framerate = 26;



    bindButtons();
}


// load image for 
const loadImage = url => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        imageAdded++;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`load ${url} fail`));
        img.src = url;
    });
};
const depictBuildings = options => {
    const myOptions = Object.assign({}, options);
    return loadImage(myOptions.url).then(img => {
        imgLoaded++;
        buildingsImgs.push(img);
    });
};

const depictBgs = options => {
    const myOptions = Object.assign({}, options);
    return loadImage(myOptions.url).then(img => {
        imgLoaded++;
        bgsImgs.push(img);
    });
};

const depictForegrounds = options => {
    const myOptions = Object.assign({}, options);
    return loadImage(myOptions.url).then(img => {
        imgLoaded++;
        img.id=myOptions.id;
        fgsImgs.push(img);
    });
};

function depictEnemy(arr){
    const myOptions = Object.assign({}, arr);
    return loadImage(myOptions.url).then(img => {
        imgLoaded++;
        img.id=myOptions.id;
        enemyImgs.push(img);
        // console.log(enemyImgs);
    });
};


function init_renderPlayer() {
    // player

        // player idle        

            player_idle_img = new Image();
            imageAdded++;
            player_idle_img.src = player_idle.url;
            player_idle_img.onload = function(){
                imgLoaded++;
            }

            player_idleBack_img = new Image();
            imageAdded++;
            player_idleBack_img.src = player_idleBack.url;
            player_idleBack_img.onload = function(){
                imgLoaded++;
            }

        // player run

            player_run_img = new Image();
            imageAdded++;
            player_run_img.src = player_run.url;
            player_run_img.onload = function(){
                imgLoaded++;
            }

            player_runBack_img = new Image();
            imageAdded++;
            player_runBack_img.src = player_runBack.url;
            player_runBack_img.onload = function(){
                imgLoaded++;
            }

    // player attack

        player_attack_img = new Image();
        imageAdded++;
        player_attack_img.src = player_attack.url;
        player_attack_img.onload = function(){
            imgLoaded++;
        }

        player_attackBack_img = new Image();
        imageAdded++;
        player_attackBack_img.src = player_attackBack.url;
        player_attackBack_img.onload = function(){
            imgLoaded++;
        }

    // shoot

        player_shoot_img = new Image();
        imageAdded++;
        player_shoot_img.src = player_shoot.url;
        player_shoot_img.onload = function(){
            imgLoaded++;
        }

        player_shootBack_img = new Image();
        imageAdded++;
        player_shootBack_img.src = player_shootBack.url;
        player_shootBack_img.onload = function(){
            imgLoaded++;
        }

    // explosion 

        explosion_img = new Image();
        imageAdded++;
        explosion_img.src = explosion.url;
        explosion_img.onload = function(){
            imgLoaded++;
        }



    // player hurt

        player_hurt_img = new Image();
        imageAdded++;
        player_hurt_img.src = player_hurt.url;
        player_hurt_img.onload = function(){
            imgLoaded++;
        }

        player_hurtBack_img = new Image();
        imageAdded++;
        player_hurtBack_img.src = player_hurtBack.url;
        player_hurtBack_img.onload = function(){
            imgLoaded++;
        }

    // player dead

        player_dead_img = new Image();
        imageAdded++;
        player_dead_img.src = player_dead.url;
        player_dead_img.onload = function(){
            imgLoaded++;
        }

        player_deadBack_img = new Image();
        imageAdded++;
        player_deadBack_img.src = player_deadBack.url;
        player_deadBack_img.onload = function(){
            imgLoaded++;
        }

    // player jump
    
        player_jump_img = new Image();
        imageAdded++;
        player_jump_img.src = player_jump.url;
        player_jump_img.onload = function(){
            imgLoaded++;
        }

        player_jumpBack_img = new Image();
        imageAdded++;
        player_jumpBack_img.src = player_jumpBack.url;
        player_jumpBack_img.onload = function(){
            imgLoaded++;
        }
}


function checkKeyPress(e){
    // console.log(e.code);

    if(e.code == "KeyM") {
        if(!muted){
            audio.volume=0;
            audio_shoot.volume=0;
            muted=true;
        } else {
            audio.volume=1;
            audio_shoot.volume=.4;
            muted=false;
        }
    }
    else if(e.code == "Space") {
        gamePause();
    } else {
        gamePause();
    }
}

function gamePause(){
    
    if(!paused && !isPlayer.dead){
        paused=true;
        gsap.to(["#paused","#overlay-bg","#start-select"],0,{display:"block"})
        gsap.to(["#paused","#start-select"],.2,{alpha:1})
        gsap.to("#overlay-bg",1,{alpha:1})

        audio.pause();
    } else {

        paused=false;
        gsap.to(["#start-select"],0,{alpha:0})
        gsap.to(["#paused","#overlay-bg"],0,{alpha:0,display:"none"})

        if(!isPlayingAudio) audio.play();
    }
}

var keysWait = false;
function checkKeys(){ 

    if(!keysWait && !isPlayer.dead){
    
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
                if(!moving_backwards) isPlayer.idle=true;
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


            if(!moving_backwards) isPlayer.idle=true;
            else isPlayer.idleBack=true;

        }
    }

    
    

}

var jumpBtnDown=false;
function jump() {
    isPlayer.idle=false;
    isPlayer.idleBack=false;
    isPlayer.attack=false;
    isPlayer.jump=true;
    keysWait=true;
    jumpBtnDown=true;

    setupJumpTL();
    tlJump.restart();
}

function shoot(){
    isPlayer.attack=false;
    isPlayer.attackBack=false;
    isPlayer.idle=false;
    isPlayer.run=false;
    isPlayer.runBack=false;

    if(moving_backwards) {
        isPlayer.attackBack=true;
    } else {
        isPlayer.attack=true;
    }
    if(!noAudio){
        audio_shoot.play();
    }

}

function forwards(){
    if(moving_backwards){
        //[todo]- turning around moves back a bit??
        player.x=player.x+24;
    }

    moving_backwards = false;

    isPlayer.attack=false;
    isPlayer.attackBack=false;
    isPlayer.idle=false;
    isPlayer.runBack=false;
    isPlayer.run=true;
}
function backwards() {
    
    if(!moving_backwards){
        player.x=player.x-player.hitXB;
    }
    moving_backwards = true;

    isPlayer.attack=false;
    isPlayer.attackBack=false;
    isPlayer.idle=false;
    isPlayer.run=false;
    isPlayer.runBack=true;

}

function updateStage(){
    // console.log(imgLoaded,imageAdded);
    if(imgLoaded==imageAdded && !collided && !paused){

        
        if(!canvasShowing) { showCanvas(); }
    

        // background 
        if(!isPlayer.dead){
            moveBg();
            moveFg();

            ctxBG.clearRect(0, 0, canvas.width, canvas.height);

            for(i = 0; i<bgsImgs.length; i++) {
                ctxBG.drawImage(bgsImgs[i], bgsList[i].x, bgsList[i].y, bgsList[i].width, bgsList[i].height);
                ctxBG.drawImage(bgsImgs[i], (bgsList[i].x+bgsList[i].width), bgsList[i].y, bgsList[i].width, bgsList[i].height);
            }
            
            for(i=0; i<buildingsImgs.length; i++){
                ctxBG.drawImage(buildingsImgs[i], buildingsList[i].x, bgBuildings.y, bgBuildings.width, bgBuildings.height);
                ctxBG.drawImage(buildingsImgs[i], (buildingsList[i].x+buildingsList[i].width), bgBuildings.y, bgBuildings.width, bgBuildings.height);
            }
            
            renderFG();

            

            // background overlay
            ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);
            ctxOverlay.drawImage(bgOverlay_img, bgOverlay.x, bgOverlay.y, bgOverlay.width, bgOverlay.height)
            ctxOverlay.drawImage(bgOverlay_img, (bgOverlay.x+bgOverlay.width), bgOverlay.y, bgOverlay.width, bgOverlay.height)
        }
        
        

        
        renderPlayer();
        renderPlayerUI();

        
        if(!noEnemies){
            renderEnemy();
        } else {
            ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
        }


        
        



        if(nearEdge.left){
            // ctxPlayer.beginPath();
            // ctxPlayer.rect(0, 0, 1, canvas.height);
            // ctxPlayer.fillStyle = "red";
            // ctxPlayer.fill();
        } else {
            

        }
        if(nearEdge.right){
            // ctxPlayer.beginPath();
            // ctxPlayer.rect(canvas.width-1, 0, canvas.width, canvas.height);
            // ctxPlayer.fillStyle = "red";
            // ctxPlayer.fill();
        } else {
            
        }

        
        moveSpriteSheets();
        
        checkPlayerPosition();

        updateScore();
        
    }
}

var x_moveAmount_fg = 1.15;
function moveFg(){
    if(!moving_backwards){
        
        if(fg.x<-((fg.width*(fgsList.length))-1152-canvas.width)){
            
            console.log('end');

            // [todo] - end of foregrounds reached, play ending! 
            collided=true;

        } else {
            x_moveAmount_bg=1;
            fg.x=fg.x-(moveFactor*x_moveAmount_fg);
            
            // move obstacles
            for(i=0; i<obstacle.length; i++){
                obstacle[i].x=obstacle[i].x-(moveFactor*x_moveAmount_fg);
            }
        }

    } else {
        if(fg.x>1152) {
            playerDeath("runback");

        } else {
            fg.x=fg.x+(moveFactor*x_moveAmount_fg);
            
            // move obstacles
            for(i=0; i<obstacle.length; i++){
                obstacle[i].x=obstacle[i].x+(moveFactor*x_moveAmount_fg);
            }    
        }
        
        
    }
}
var fgIndexSet=false;
function renderFG(){
    if(!fgIndexSet){
        setFgIndex();
    }
    ctxFG.clearRect(0, 0, canvas.width, canvas.height);

    for(i = 0; i<fgsImgs.length; i++) {
        ctxFG.drawImage(fgsImgs[fgsImgIndex[i]], (fg.x+fgsList[i].x), fg.y, fg.width, fg.height);
    }
}

function setFgIndex(){
    fgIndexSet=true;
    for(i=0; i<fgsImgs.length; i++){
        if(fgsImgs[i].id == "01") {
            fgsImgIndex[0] = i;
        } 
        if(fgsImgs[i].id == "02") {
            fgsImgIndex[1] = i;
        }
        if(fgsImgs[i].id == "03") {
            fgsImgIndex[2] = i;
        }
        if(fgsImgs[i].id == "04") {
            fgsImgIndex[3] = i;
        }
        if(fgsImgs[i].id == "05") {
            fgsImgIndex[4] = i;
        }
        
    }
}

function moveSpriteSheets(){
    counter++;
    if(counter>999) counter=0;
    if(counter%6==0){
        

        if(isPlayer.dead){
            
            sprite_x.playerX+=player.width;
            
            if(sprite_x.playerX>=spritesheetW.playerW || sprite_x.playerX<=0) {
                // only play this anim once!
                collided=true;
            }   
        } else {
            sprite_x.playerX+=player.width;
        }

        
         // if player is in middle of a jump anim:
        if(keysWait){
            if(sprite_x.playerX>=spritesheetW.playerW) {
                sprite_x.playerX=0;
            }
        } else {
            if(sprite_x.playerX>=spritesheetW.playerW) sprite_x.playerX=0;
        }



        if(isEnemy.attack){
            sprite_x.enemyX+=enemy[whichEnemyIndex].width;
            if(sprite_x.enemyX>=spritesheetW.enemyW) {
                isEnemy.attack=false;
                isEnemy.run=true;
                startedAttack=false;

                sprite_x.enemyX=0;
            }
        } 
        else {
            sprite_x.enemyX+=enemy[whichEnemyIndex].width;
            if(sprite_x.enemyX>=spritesheetW.enemyW) sprite_x.enemyX=0;
        }


        if(isEnemy.exploding){
            sprite_x.explosionX+=(96);
            if(sprite_x.explosionX>=spritesheetW.explosionW) {
                // only play this anim once!
                isEnemy.exploding=false;
                isEnemy.killed=true;
                sprite_x.explosionX=0;
                
                enemyKillCount++;
                gsap.to(score,1,{curr:"+="+enemy[whichEnemyIndex].killValue});

            }
        }        
    }
    if(counter%2==0){
        sprite_x.shootX+=player.width;
        if(sprite_x.shootX>=spritesheetW.shootW) sprite_x.shootX=0;
    }
}

function renderPlayerUI() {
    ctxHud.clearRect(0, 0, canvas.width, canvas.height);
    ctxHud.beginPath();
    ctxHud.rect(10, 10, 70, 10);
    ctxHud.fillStyle = "#fff";
    ctxHud.fill();

    ctxHud.beginPath();
    var healthBarW=Math.floor((player.health/full_health)*68);

    ctxHud.rect(11, 11, healthBarW, 8);
    if(isPlayer.hurt) {
        ctxHud.fillStyle = "red";
    } else {
        ctxHud.fillStyle = "green";
    }
    ctxHud.fill();

    for(i = player.lives; i > 0; i--) {
        ctxHud.drawImage(player_idleBack_img, 0, 0,
            player.width, player.height,
            60+(i*15), 0, 
            player.width/2, player.height/2);
    }
}



function renderPlayer() {
    ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);

    // [todo] - moving_backwards:
    
    if(!moving_backwards){
        player.hitX=0;
    } else {
        player.hitX=-16;
    }



    if(isPlayer.dead){ 

        // ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);
        if(!moving_backwards){
            ctxPlayer.drawImage(player_dead_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else {
            ctxPlayer.drawImage(player_deadBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        }
    } else if(isPlayer.hurt){ 


        // [todo] - move this elsewhere:
        spritesheetW.playerW=player_hurt.width;

        // ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);
        if(!moving_backwards){
            ctxPlayer.drawImage(player_hurt_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else {
            ctxPlayer.drawImage(player_hurtBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        }
    } else if(isPlayer.jump){ 

        // [todo] - move this elsewhere:
        spritesheetW.playerW=player_jump.width;

        // ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);
        if(moving_backwards){
            // player.x-=2;

            ctxPlayer.drawImage(player_jumpBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);

        } else {
            // player.x+=2;

            ctxPlayer.drawImage(player_jump_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        }
    } else {
        if(isPlayer.run){
            spritesheetW.playerW=player_run.width;
        
            ctxPlayer.drawImage(player_run_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } 


        else if(isPlayer.runBack){
            spritesheetW.playerW=player_runBack.width;
            
            ctxPlayer.drawImage(player_runBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);


        } else if(isPlayer.attack) {

            // make player stop moving while shooting
            player.x-=moveFactor*x_moveAmount_fg;


            spritesheetW.playerW=player_attack.width;

            ctxPlayer.drawImage(player_attack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);


            // do gun flash
            spritesheetW.shootW=player_shoot.width;
            ctxPlayer.drawImage(player_shoot_img, sprite_x.shootX, 0,
                player.width, player.height,
                player.x+player.width-player_shoot.offsetX, player.y-player_shoot.offsetY, 
                player.width, player.height);
        }
        else if(isPlayer.attackBack) {

            // make player stop moving while shooting
            player.x+=moveFactor*x_moveAmount_fg;


            spritesheetW.playerW=player_attackBack.width;

            ctxPlayer.drawImage(player_attackBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);

            // do gun flash back
            spritesheetW.shootW=player_shoot.width;
            ctxPlayer.drawImage(player_shootBack_img, sprite_x.shootX, 0,
                player.width, player.height,
                player.x+player.width-player_shootBack.offsetX, player.y-player_shootBack.offsetY, 
                player.width, player.height);
        }
        else if(isPlayer.idle){
            spritesheetW.playerW=player_idle.width;

            ctxPlayer.drawImage(player_idle_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else if(isPlayer.idleBack){
            spritesheetW.playerW=player_idleBack.width;

            ctxPlayer.drawImage(player_idleBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        }
    }

}

var curr_obs=0;
function checkPlayerPosition() {

    
    
// player is near edges of screen
    if(player.x>((canvas.width/2)-(player.width/2))-1){
        nearEdge.right=true;
    } else {
        nearEdge.right=false;
    }

    if((player.x<=0)){
        nearEdge.left=true;
    } else {
        nearEdge.left=false;
    }


// dont let player run off screen
// to right:
    if(player.x>(canvas.width/2)-(player.width/2)){
        player.x=(canvas.width/2)-(player.width/2);
    }
// to left:
    if((player.x<=0)){
        player.x=0;
    }

    

 
    if(highlights){
        
        for(i=0; i<obstacle.length; i++){
            ctxFG.beginPath();
            ctxFG.rect(obstacle[i].x, obstacle[i].y, obstacle[i].w, obstacle[i].h);
            ctxFG.fillStyle = "rgba(255,255,0,.5)";
            ctxFG.fill();
        }
        
    }

    /////// ENEMY COLLISIONS: //////////

    var enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitX;
    if(isEnemy.runBack) { enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB; }
    var enemyR = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitW;
    var enemyT = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY;
    var enemyB = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitH;
    var enemyH = enemy[whichEnemyIndex].hitH;

    if(highlights){
    // [todo] enemy hit area
        ctxEnemy.beginPath();
        ctxEnemy.rect(enemyL, enemyT, enemy[whichEnemyIndex].hitW, enemy[whichEnemyIndex].hitH);
        ctxEnemy.fillStyle = "rgba(255,0,0,0.5)";
        ctxEnemy.fill();
    }




/////// ENEMY HITS OBSTACLE /////////
    
    if(isEnemy.run){
        for(i=0; i<obstacle.length-1; i++){
            let e_obstacleR = obstacle[i].x+obstacle[i].w; 
            let e_obstacleL = obstacle[i].x;

            if(e_obstacleL < enemyR){
                isEnemy.runBack=true;
                isEnemy.run=false;

                // console.log('enemy block collide')
            }
        }

            // if(obstacleL < enemyR && enemyL < obstacleR && isEnemy.run){
            //     isEnemy.run=false;
            //     isEnemy.runBack=true;
            // }
    }    
    


// DEFINE PLAYER AREA

    let playerR = player.x+player.hitW;
    let playerL = player.x+player.hitX;
    if(moving_backwards) { playerL = player.x+player.hitXB; }
    let playerT = player.y+player.hitY;
    let playerB = playerT+player.hitH;

    if(highlights){
    // [todo] player hit area
        ctxPlayer.beginPath();
        ctxPlayer.rect(playerL, playerT, player.hitW, player.hitH);
        ctxPlayer.fillStyle = "rgba(0,255,0,0.5)";
        ctxPlayer.fill();
    }

    curr_obs=0;
    let obstacleR = obstacle[curr_obs].x+obstacle[curr_obs].w;
    let obstacleL = obstacle[curr_obs].x;
    let obstacleT = obstacle[curr_obs].y;
    let obstacleB = obstacle[curr_obs].y+obstacle[curr_obs].h;

    while (obstacleR < playerL && curr_obs<=(obstacle.length-2)){
        curr_obs++;

        obstacleR = obstacle[curr_obs].x+obstacle[curr_obs].w; 
        obstacleL = obstacle[curr_obs].x;
        obstacleT = obstacle[curr_obs].y;
        obstacleB = obstacle[curr_obs].y+obstacle[curr_obs].h;
    }


/////// OBSTACLES + PLATFORMS: //////////

// if within obstacle but lower than its ground level:
        if(playerR > obstacleL && playerL < obstacleR && playerB > obstacleT && playerT < obstacleT){
            
            if(playerR > obstacleL && playerL < obstacleL){
                player.x=obstacleL-player.hitW;

                // [todo]- player gets stuck next to tall block! 
            }
            if(playerL < obstacleR && playerR > obstacleR){
                // player.x=obstacleR-player.hitXB;
            }
            x_moveAmount_bg=0;


            // slow down enemy speed here- we're running but not moving:
            moveFactor_enemy=.5;

            // but if we running backwards into obj enemy speed needs to be normal:
            if(moving_backwards && (isEnemy.runBack || isEnemy.attackBack || isEnemy.hurtBack)){
                moveFactor_enemy=4;
            }
            

// if within obstacle but above it:
        } else if(playerR > obstacleL && playerL < obstacleR && playerB < obstacleT){ 

            x_moveAmount_bg=1;
            moveFactor_enemy=1;
            
            if(isPlayer.run){
                player.x+=2;
            }
            if(isPlayer.runBack){
                player.x-=2;
            }

            
            if(player_ground.y>obstacleT){
                player_ground.y=obstacleT;
            } 

// not within obstacle
        } else {

            moveFactor_enemy=1;

            if(!tlJump.isActive()){
                if(playerR < obstacleL || playerL > obstacleR){
                    player_ground.y=player_ground.floor;
                }
            }


            x_moveAmount_bg=1;
            if(isPlayer.run){
                player.x+=2;
            }
            if(isPlayer.runBack){
                player.x-=2;
            }
        }

        if(playerB<player_ground.y) {
            isPlayer.jump=true;
            keysWait=true; 

            player.y++;
            player.y++;
            player.y++;
            player.y++;
            
        } else {
            keysWait=false; 
            isPlayer.jump=false;
        }
    
        if(playerB>player_ground.y){
            player.y=player_ground.y-player.hitH-player.hitY;
        }
    // console.log(curr_obs);


/////// ENEMY HITS PLAYER /////////
    if(!isEnemy.killed 
        && !isPlayer.invincible
        && playerL < enemyL + enemy[whichEnemyIndex].hitW
        && playerL + player.hitW > enemyL
        && playerT < enemyT + enemy[whichEnemyIndex].hitH
        && playerT + player.hitH > enemyT ){

        // colliding! 
        isPlayer.hurt=true;
        player.health--;
        player.health = player.health < 0 ? 0 : player.health;
        if(player.health==0) { 
            playerDeath("enemy");
        }
    } else {

        isPlayer.hurt=false;
    }


        
    

/////// PLAYER SHOOT HITS: //////////
    if(isPlayer.attack) {
        if(playerR<enemyL 
         && playerT+player_shoot.offsetY>=enemyT){
            if(isEnemy.run) isEnemy.hurt=true;
            else if(isEnemy.runBack) isEnemy.hurtBack=true;

            score.curr=score.curr+0.05;

            enemy[whichEnemyIndex].health--;
            enemy[whichEnemyIndex].health = enemy[whichEnemyIndex].health < 0 ? 0 : enemy[whichEnemyIndex].health;
            if(enemy[whichEnemyIndex].health==0) {
                killEnemy();
            }
        } else {
            isEnemy.hurt=false;
            isEnemy.hurtBack=false;
        }

    } else if(isPlayer.attackBack) {
        if(playerL>enemyR 
         && playerT+player_shoot.offsetY>=enemyT){
            if(isEnemy.run) isEnemy.hurt=true;
            else if(isEnemy.runBack) isEnemy.hurtBack=true;

            score.curr=score.curr+0.05; 

            enemy[whichEnemyIndex].health--;
            enemy[whichEnemyIndex].health = enemy[whichEnemyIndex].health < 0 ? 0 : enemy[whichEnemyIndex].health;
            if(enemy[whichEnemyIndex].health==0) {
                killEnemy();
            }
        } else {
            isEnemy.hurt=false;
            isEnemy.hurtBack=false;
        }
    } else {
        isEnemy.hurt=false;
        isEnemy.hurtBack=false; 
    }

    

/////// ENEMY REPEAT OR OFF SCREEN / TURN BACK: //////////
    if(!isEnemy.killed && !isEnemy.attack){
        

        if(isEnemy.run && enemy[whichEnemyIndex].x<-(enemy[whichEnemyIndex].hitW+3)) {

                // stop enemy going off screen to left:
                enemy[whichEnemyIndex].x=-(enemy[whichEnemyIndex].hitW+3);

                // enemy[whichEnemyIndex].x=canvas.width;
                // isEnemy.runBack=true;
                // isEnemy.run=false;
                //[todo] - enemy off screen so far- kill them
                // enemy[whichEnemyIndex].x=0;
                // killEnemy();
        }
         else if(isEnemy.runBack && enemy[whichEnemyIndex].x<0){
            // if(isEnemy.run && enemy[whichEnemyIndex].x<=-((enemy[whichEnemyIndex].width*2)+1)) {
             // else {
                isEnemy.runBack=false;
                isEnemy.run=true;
            // }
        }

        // enemy
        if(enemy[whichEnemyIndex].x>canvas.width){
            isEnemy.runBack=true;
            isEnemy.run=false;
        }
    }
}

function setupJumpTL(){
    tlJump = gsap.timeline({paused:true});
    tlJump.addLabel('up', 0)
        .to(player,{y:"-="+player.jumpH,ease:"power3.out", duration:0.338},"up");
}

    
var moveFactor_enemy = 1;
var whichEnemyIndex=0;
var startedAttack = false;
function renderEnemy(whichEnemy) {
    
    // init enemy:
    if(!enemyIndexFlag) {

        // only do this once:
        setEnemyIndex();

    }


    if(isEnemy.killed){
        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);


        // [todo]-delay this so theres a break between enemies!
        // re-initialise enemy for a new one:
        enemyIndexFlag=false;
        return;
    }

    if(isEnemy.exploding){
        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
        // play explosion!
        spritesheetW.explosionW=explosion.width;
        ctxEnemy.drawImage(explosion_img, sprite_x.explosionX, 0,
            96, 96,
            enemy[whichEnemyIndex].x-enemy[whichEnemyIndex].explosionOffsetX, enemy[whichEnemyIndex].y-enemy[whichEnemyIndex].explosionOffsetY, 
            96, 96);

        return;
    }





                // DO ENEMY MOVE FACTOR CLACULATIONS


    if(isEnemy.runBack){
        enemy[whichEnemyIndex].x-=moveFactor_enemy; 

        if(isPlayer.run) {
            enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/2;  
            if(isPlayer.runBack) {
                enemy[whichEnemyIndex].x+=moveFactor_enemy/3;  
            }
        }
    } else if(isEnemy.run){
        enemy[whichEnemyIndex].x+=moveFactor_enemy/3; 

        if(isPlayer.run) {
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=(moveFactor_enemy*1.25);  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/2; 
            if(isPlayer.runBack) {
                enemy[whichEnemyIndex].x+=moveFactor_enemy;  
            }
        }
    }

    if(isEnemy.hurtBack){
        // hurtback
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][7].width;
        drawEnemy(enemyImgIndex.hurtBack, sprite_x.enemyX, whichEnemyIndex)

    } else if(isEnemy.hurt){
        // hurt
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][6].width;
        drawEnemy(enemyImgIndex.hurt, sprite_x.enemyX, whichEnemyIndex)

    } else if(isEnemy.attack) {
        if(!startedAttack){
            startedAttack=true;
            sprite_x.enemyX=0;
        }
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][4].width;    
        //attack
        drawEnemy(enemyImgIndex.attack, sprite_x.enemyX, whichEnemyIndex);
        
    } else if(isEnemy.attackBack){
        //attackBack
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][5].width;
        drawEnemy(enemyImgIndex.attackBack, sprite_x.enemyX, whichEnemyIndex);
    } else if(isEnemy.runBack) {
        // walkBack
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][3].width;
        drawEnemy(enemyImgIndex.walkBack, sprite_x.enemyX, whichEnemyIndex);

    } else if(isEnemy.run) {
        //walk
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][2].width;
        drawEnemy(enemyImgIndex.walk, sprite_x.enemyX, whichEnemyIndex);

    }


    renderEnemyUI();
    
}

function renderEnemyUI(){
    // [todo] draw enemy health
    var enemyBarX = enemy[whichEnemyIndex].x+10;
    var enemyBarY = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY-25;
    var enemyBarW = enemy[whichEnemyIndex].hitW-20
    if(isEnemy.runBack){
        enemyBarX = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB+10;
    }

    ctxEnemy.beginPath();
    ctxEnemy.rect(enemyBarX, enemyBarY, enemyBarW, 5);
    ctxEnemy.fillStyle = "rgba(255,255,255,0.5)";
    ctxEnemy.fill();

    var enemyhealthBarW=Math.floor((enemy[whichEnemyIndex].health/enemy[whichEnemyIndex].fullhealth)*enemyBarW);


    ctxEnemy.beginPath();
    ctxEnemy.rect(enemyBarX+1, enemyBarY+1, enemyhealthBarW, 3);
    if(isEnemy.hurt) {
        ctxEnemy.fillStyle = "rgba(255,0,0,0.7)";
    } else {
        ctxEnemy.fillStyle = "rgba(0,255,0,0.5)";
    }
    ctxEnemy.fill();
}


// drawEnemy(enemyImgs[enemyImgIndex.hurtBack], sprite_x.enemyX)
function drawEnemy(img, spx, ind){
    ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
    ctxEnemy.drawImage(enemyImgs[img], spx, 0,
        enemy[ind].width, enemy[ind].height,
        enemy[ind].x, enemy[ind].y, 
        enemy[ind].width, enemy[ind].height);
}

var enemyIndexFlag = false;
function setEnemyIndex(whichEnemy){

    enemyIndexFlag=true;
    enemyImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0, attack:0, attackBack:0}

    if(whichEnemy==undefined){
        if(enemyKillCount>=enemy.length) { enemyKillCount=0; }
        whichEnemyIndex=enemyKillCount;
        
        if(whichEnemyIndex==0) { whichEnemy="CyberBike"; }
        if(whichEnemyIndex==1) { whichEnemy="BattleCar"; }

// set index manually if passed in to this func:
    } else if(whichEnemy=="BattleCar") { 
        whichEnemyIndex = 1;
    } else if(whichEnemy=="CyberBike") { 
        whichEnemyIndex = 0;
    }





    for(i=0; i<enemyImgs.length; i++){
        if(enemyImgs[i].id == whichEnemy+"-Walk-back") {
            enemyImgIndex.walkBack=i;
        }
        if(enemyImgs[i].id == whichEnemy+"-Hurt-back") {
            enemyImgIndex.hurtBack=i;
        }
        if(enemyImgs[i].id == whichEnemy+"-Hurt") {
            enemyImgIndex.hurt=i;
        }
        if(enemyImgs[i].id == whichEnemy+"-Walk") {
            enemyImgIndex.walk=i;
        }
        if(enemyImgs[i].id == whichEnemy+"-Attack") {
            enemyImgIndex.attack=i;
        }
        if(enemyImgs[i].id == whichEnemy+"-Attack-back") {
            enemyImgIndex.attackBack=i;
        }
    }


    // reset Enemy Vars:

    enemy[whichEnemyIndex].health=enemy[whichEnemyIndex].fullhealth;
    enemy[whichEnemyIndex].x=canvas.width;

    isEnemy.runBack=true;

    isEnemy.run=false;
    isEnemy.attack=false;
    isEnemy.attackBack=false;
    isEnemy.hurt=false;
    isEnemy.hurtBack=false;
    isEnemy.killed=false;
    isEnemy.exploding=false;
    sprite_x.enemyX=0;
}

function killEnemy(whichEnemy){
    isEnemy.exploding=true;
}


var moveFactor = .5;
var x_moveAmount_bg = 1;
function moveBg(){
    
    if(!moving_backwards){
        if(isPlayer.run){
            moveFactor = x_moveAmount_bg;
            if(nearEdge.right) {

                // [todo] - SPEED CHANGED TO AVOID SLOW DOWN WHEN AT MIDDLE POINT 
                // moveFactor = x_moveAmount_bg*1.5;


                moveFactor = x_moveAmount_bg*2;

            }
        } else {moveFactor = x_moveAmount_bg*.5;}

        bgOverlay.x=bgOverlay.x-(moveFactor);

        for(i=bgsList.length-1; i>0; i--){
            bgsList[i].x=bgsList[i].x-((moveFactor*i)*.1);

            if(bgsList[i].x<-canvas.width) bgsList[i].x = 0;
        }

        for(i=0; i<buildingsImgs.length; i++) {
            buildingsList[i].x=buildingsList[i].x-(moveFactor);
            if(buildingsList[i].x<-((bgBuildings.width*buildingsImgs.length)-canvas.width)) buildingsList[i].x = canvas.width;
        }

    } else if(moving_backwards){
        
        if(isPlayer.runBack){
            moveFactor = x_moveAmount_bg;
        } else {moveFactor = 0;}
    
        bgOverlay.x=bgOverlay.x-(moveFactor);

        for(i=bgsList.length-1; i>0; i--){
            bgsList[i].x=bgsList[i].x+((moveFactor*i)*.1);
        }

        for(i=0; i<buildingsImgs.length; i++) {
            if(buildingsList[0].x<bgBuildings.width){
                buildingsList[i].x=buildingsList[i].x+(moveFactor);
            }
        }
    }

    if(bgOverlay.x<-bgOverlay.width) bgOverlay.x = 0;
    if(bgOverlay.x>bgOverlay.width) bgOverlay.x = canvas.width;
    
    

}


var progress=0;
function moveAhead() {
    // console.log("moveAhead");

    // progress++;
    player.x=-96;
    
}

function moveBack(){
    // console.log("moveBack");

    // progress--;
    // player.x=canvas.width;
}


var onlyDieOnce = false;
function playerDeath(death_type){
    if(!onlyDieOnce) {

        spritesheetW.playerW=player_dead.width;

        if(!moving_backwards) {
            sprite_x.playerX=0;
        }
        isPlayer.dead=true;
        onlyDieOnce=true;
        player.lives--;


        if(death_type=="enemy"){
            if(player.lives>0){
                died_txt.innerHTML="you have fallen, but the quest goes on";
            } else {
                died_txt.innerHTML="you fought valiantly, but you died in battle";
            }
        } else if(death_type=="runback"){
            died_txt.innerHTML="you cannot run away from your destiny";
        }
        
        



        if(player.lives==0){

            // player has no more lives:

            typeText(died_txt,2,0);
            deathTL = gsap.timeline({paused:true, onComplete:bindRestartButtons});

            deathTL.to(["#overlay-death","#died_txt"],0,{display:"block"},0)
                .to("#died_txt",.2,{alpha:1},">")
                .to("#overlay-death",1,{alpha:1},"<")
            .fromTo(".game-canvas", 3, {filter:"brightness(1)"}, {filter:"brightness(0.2)"},">")
                .to([restart_btn,restart_btn_mobile], 0, {display:"block"},">")
                .to([restart_btn,restart_btn_mobile], 1, {alpha:1},"<")
                .to(["#start-select"],0,{display:"block"},"<")
                .to(["#start-select"],.2,{alpha:1},"<");



        } else if(player.lives!=0){

            // player died but more lives

            typeText(died_txt,.7,0);
            deathTL = gsap.timeline({paused:true, onComplete:bindContinueButtons})

            deathTL.to(["#overlay-death","#died_txt"],0,{display:"block"},0)
                .to("#died_txt",.2,{alpha:1},">")
                .to("#overlay-death",1,{alpha:1},"<")
                .fromTo(".game-canvas", 1, {filter:"brightness(1)"}, {filter:"brightness(0.5)"},"<.25")
                .to([continue_btn,continue_btn_mobile], 0, {display:"block"},"<.25")
                .to([continue_btn,continue_btn_mobile], .3, {alpha:1},"<")
                .to(["#start-select"],0,{display:"block"},"<")
                .to(["#start-select"],.2,{alpha:1},"<"); 
        }



        deathTL.play();
        
    }
}

function restartGame(){

    unbindRestartButtons();
    bindButtons();

    deathTL.pause();
    deathTL.seek(0);

    score.curr=0;
    player.health=full_health;
    player.lives=full_lives;
    isPlayer.dead=false;
    isPlayer.idle=true;
    collided=false;
    onlyDieOnce=false;


    // reset enemies:
    isEnemy.exploding=false;
    isEnemy.killed=false;
    isEnemy.hurt=false;
    isEnemy.hurtBack=false;
    isEnemy.run=false;
    isEnemy.attack=false;
    isEnemy.attackBack=false;
    isEnemy.runBack=true;
    for (i = enemy.length - 1; i >= 0; i--) {
        enemy[i].x=canvas.width;
    }
    enemyKillCount=0;


    // reset all gameplay values so game resets fully
    bgOverlay=-570;
    for(i=0; i<buildingsList.length-1; i++){
        buildingsList[i].x=(bgBuildings.width*i)-bgBuildings.width;
    }
    fg.x=0;
    player.x=0
    for(i=0; i<obstacle.length; i++){
        obstacle[i].x=obstacle[i].initX;
    }
}

function continueGame() {
    unbindContinueButtons();
    bindButtons();

    deathTL.pause();
    deathTL.seek(0);
    onlyDieOnce=false;
    player.health=full_health;
    isPlayer.dead=false;
    isPlayer.idleBack=true;
    collided=false;
    isPlayer.invincible=true;

    
    var tlFlashPlayer=gsap.timeline({onComplete:function(){
        isPlayer.invincible=false;
    }});
    tlFlashPlayer.to(player_canvas,.1,{alpha:.4},0)
                 .to(player_canvas,.1,{alpha:1},">.15")
                 .to(player_canvas,.1,{alpha:.4},">.15")
                 .to(player_canvas,.1,{alpha:1},">.15")
                 .to(player_canvas,.1,{alpha:.4},">.15")
                 .to(player_canvas,.1,{alpha:1},">.15")
                 .to(player_canvas,.1,{alpha:.4},">.15")
                 .to(player_canvas,.1,{alpha:1},">.15")
                 .to(player_canvas,.1,{alpha:.4},">.15")
                 .to(player_canvas,.1,{alpha:1},">.15")
                 .to(player_canvas,.1,{alpha:.4},">.15")
                 .to(player_canvas,.1,{alpha:1},">.15")
}

function mobileBtnDoNothing(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }
}

var canvasShowing=false;
function showCanvas(){
    document.getElementById("loadingContent").style.display="none";
    container.style.display = "block";
    footer.style.display = "block";
    canvasShowing=true;

    if(zoomIn){
        gsap.to("#container",zoomSpeed,{scale:1.6 }) 
    }
        
    if(devTools){
        wrap.classList.add("devTools");
    }
    gsap.to(score_txt,0,{display:"block",alpha:1});
}


function updateScore(){

    score_txt.innerHTML=(Math.round(score.curr).toWidth(8,'0')); //=> 00000100
}

Number.prototype.toWidth = function(n,chr) {
    chr = chr || ' ';
    var len = String(parseFloat(this)).length;
    function multiply(str,nn){
        var s = str;
        while (--nn>0){
            str+=s;
        }
        return str;
    }
    n = n<len ? 0 : Math.abs(len-n);
    return (n>1 && n ? multiply(chr,n) : n<1 ? '' : chr)+this;
};




function typeText(whichEle, thisLength, charSpeed){
    // typewriter text
    var mySplitText = new SplitText(whichEle, {type:"words,chars"}),
        numChars = mySplitText.chars.length,
        characterTime = (thisLength/(numChars+6));
        gsap.set(whichEle,{autoAlpha:1});
        gsap.set(mySplitText.chars, {autoAlpha:0});
        for(var i = 0; i < numChars; i++){
            gsap.to(mySplitText.chars[i], charSpeed, {autoAlpha:1, delay:(i * characterTime),ease:Linear.easeNone});
        }
}


/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// DEV TOOLS ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
function setupDevTools() {
    frameRate_btn.addEventListener("click", setFrameRate);
    highlights_btn.addEventListener("click", toggleHighlights);
    noEnemies_btn.addEventListener("click", toggleEnemies);
    zoomIn_btn.addEventListener("click", zoomInContainer);
    die_btn.addEventListener("click", playerDeath);
}
function setFrameRate(){
    frameRate = frameRate_txt.value;
    createjs.Ticker.framerate = frameRate;
}
function toggleHighlights() {
    if(!highlights) {
        highlights=true;
    } else {
        highlights=false;
    }
}
function toggleEnemies() {
    if(!noEnemies){
        noEnemies=true;
    } else {
        noEnemies=false;

    }
}
function zoomInContainer(){
    if(!zoomIn){
        zoomIn=true;
        gsap.to("#container",zoomSpeed,{scale:1.6}) 
    } else {
        zoomIn=false;
        gsap.to("#container",zoomSpeed,{scale:1}) 
    }
}

/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// FULL WIDTH ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
function getWindowSize(){
    windowheight = window.innerHeight;
    windowwidth = window.innerWidth;
    body = document.body;
    html = document.documentElement;

    pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
    html.clientHeight, html.scrollHeight, html.offsetHeight );
}
function resizeWindow(){
    getWindowSize();
    
    
    gsap.set(wrap,{width:windowwidth,height:windowheight});
    
}



function toggleCursor(off) {
    if(off) {
        container.style.cursor="none";
    } else {
        container.style.cursor="default";
    }
}