var wrap,container;
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
var npc_canvas = document.getElementById('npc-canvas');
var hud_canvas = document.getElementById('hud-canvas');


var score_txt = document.getElementById('score_txt');
var died_txt = document.getElementById('died_txt');
var ending_txt = document.getElementById('ending_txt');
var restart_btn = document.getElementById("restart_btn");
//dev tools
var frameRate_txt = document.getElementById("frameRate_txt");
var frameRate_btn = document.getElementById("frameRate_btn");
var twoPlayer=true;


bg_canvas.width=canvas.width;
bg_canvas.height=canvas.height;

fg_canvas.width=canvas.width;
fg_canvas.height=canvas.height;

player_canvas.width=canvas.width;
player_canvas.height=canvas.height;

enemy_canvas.width=canvas.width;
enemy_canvas.height=canvas.height;

npc_canvas.width=canvas.width;
npc_canvas.height=canvas.height;

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
var ctxNpc = npc_canvas.getContext('2d');



var imageAdded= 0,
    imgLoaded = 0;

var full_health = 100;
var full_lives = 3;
var score = {curr:0};


var nearEdge = {left:false,right:false}

var sprite_x = {playerX:0, enemyX:0, shootX:0, explosionX:0, flashX:[0], npcX:[0], fireX:0, droneX:0, bombX:0};

var spritesheetW = {playerW: player_walk.width, 
                    enemyW:enemiesList[0][0].width,
                    shootW:player_shoot.width,
                    explosionW:explosion.width,
                    flashW:flash.width,
                    npcW:[npcList[0][2].width],
                    droneW:drone.width,
                    bombW:bomb.width}; // sprites width

var counter=0;
var flash_counter=0;
var drone_counter=0;
    
var isSongToEnding=false; 
var collided=false; 
var paused=false;
var muted = false;
var noEnemies = true;
var noEnemiesOverride = false;
var invincibleOverride = false;
var noNpcs = true;
var fireStarted=false;
var fires = [];
var moving_backwards = false; 
var intro=true;

var tlJump = gsap.timeline({paused:true});
tlJump = gsap.timeline({paused:true});

var deathTL = gsap.timeline({paused:true});

var endingTL = gsap.timeline({paused:true});

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



        fire01_img = new Image();
        imageAdded++;
        fire01_img.src = "images/Fire/1.png";
        fire01_img.onload = function(){ imgLoaded++; }
        fire02_img = new Image();
        imageAdded++;
        fire02_img.src = "images/Fire/2.png";
        fire02_img.onload = function(){ imgLoaded++; }
        fire03_img = new Image();
        imageAdded++;
        fire03_img.src = "images/Fire/3.png";
        fire03_img.onload = function(){ imgLoaded++; }
        fire04_img = new Image();
        imageAdded++;
        fire04_img.src = "images/Fire/4.png";
        fire04_img.onload = function(){ imgLoaded++; }


    // player
        init_renderPlayer();


    // enemy
    for(i=0; i<enemiesList.length; i++){
        enemiesList[i].forEach(depictEnemy);
    }

    // npc
    for(i=0; i<npcList.length; i++){
        npcList[i].forEach(depictNpc);
    }
}   



function showGame(){
    
    createjs.Ticker.addEventListener("tick", updateStage);
    createjs.Ticker.framerate = frameRate;
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

function depictNpc(arr){
    const myOptions = Object.assign({}, arr);
    return loadImage(myOptions.url).then(img => {
        imgLoaded++;
        img.id=myOptions.id;
        npcImgs.push(img);
        // console.log(enemyImgs);
    });
};

function init_renderPlayer() {
    // player

        // player idle        

            player_walk_img = new Image();
            imageAdded++;
            player_walk_img.src = player_walk.url;
            player_walk_img.onload = function(){
                imgLoaded++;
            }

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

        flash_img = new Image();
        imageAdded++;
        flash_img.src = flash.url;
        flash_img.onload = function(){
            imgLoaded++;
        }

        drone_img = new Image();
        imageAdded++;
        drone_img.src = drone.url;
        drone_img.onload = function(){
            imgLoaded++;
        }

        bomb_img = new Image();
        imageAdded++;
        bomb_img.src = bomb.url;
        bomb_img.onload = function(){
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

        player_shot_img = new Image();
        imageAdded++;
        player_shot_img.src = player_shot.url;
        player_shot_img.onload = function(){
            imgLoaded++;
        }

        player_shotBack_img = new Image();
        imageAdded++;
        player_shotBack_img.src = player_shotBack.url;
        player_shotBack_img.onload = function(){
            imgLoaded++;
        }

        player_hurtRun_img = new Image();
        imageAdded++;
        player_hurtRun_img.src = player_hurtRun.url;
        player_hurtRun_img.onload = function(){
            imgLoaded++;
        }

        player_hurtRunBack_img = new Image();
        imageAdded++;
        player_hurtRunBack_img.src = player_hurtRunBack.url;
        player_hurtRunBack_img.onload = function(){
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

function gamePause(){
    
    if(!paused && !isPlayer.dead && !endingPlaying){
        paused=true;
        gsap.to(["#paused_txt","#overlay-bg","#start-select"],0,{display:"block"});
        gsap.to(["#paused_txt","#start-select"],.2,{alpha:1});
        gsap.to("#overlay-bg",1,{alpha:1});

        tlEnemyVars.pause();

        pauseMusic(audio_music);

        container.classList.remove("noMouse");
    } else {

        paused=false;
        gsap.to(["#start-select"],0,{alpha:0});
        gsap.to(["#paused_txt","#overlay-bg"],0,{alpha:0,display:"none"});

        tlEnemyVars.play();

        
        container.classList.add("noMouse");
        playMusic(audio_music,true);
    }
}

var jumpBtnDown=false;
function jump() {
    sprite_x.playerX=0;
    jumpBtnDown=true;

    isPlayer.walk=false;
    isPlayer.idleBack=false;
    isPlayer.attack=false;
    isPlayer.jump=true;
    keysWait=true;

    setupJumpTL();
    tlJump.restart();
}

function shoot(){
    if(!isPlayer.hurt){
        isPlayer.attack=false;
        isPlayer.attackBack=false;
        isPlayer.walk=false;
        isPlayer.run=false;
        isPlayer.runBack=false;

        if(moving_backwards) {
            isPlayer.attackBack=true;
        } else {
            isPlayer.attack=true;
        }
        playSFX(audio_shoot);
    }
}

function forwards(){
    if(moving_backwards){
        player.x=player.x+24;
    }

    moving_backwards = false;

    isPlayer.attack=false;
    isPlayer.attackBack=false;
    isPlayer.walk=false;
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
    isPlayer.walk=false;
    isPlayer.run=false;
    isPlayer.runBack=true;

}

function updateStage(){
    // console.log(imgLoaded,imageAdded);
    if(imgLoaded==imageAdded && !collided && !paused){

        
        if(!canvasShowing) { showCanvas(); }
    

        // background 
        if(!isPlayer.dead){

            if(!fireStarted && !doFlash && !do_droneStrike){
                if(!intro){
                    moveBg();
                    moveFg();
                }


                ctxBG.clearRect(0, 0, canvas.width, canvas.height);

                for(i = 0; i<bgsImgs.length; i++) {
                    ctxBG.drawImage(bgsImgs[i], bgsList[i].x, bgsList[i].y, bgsList[i].width, bgsList[i].height);
                    ctxBG.drawImage(bgsImgs[i], (bgsList[i].x+bgsList[i].width), bgsList[i].y, bgsList[i].width, bgsList[i].height);
                }
            }
            
            renderFG();

            

            // background overlay
            ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);
            ctxOverlay.drawImage(bgOverlay_img, bgOverlay.x, bgOverlay.y, bgOverlay.width, bgOverlay.height)
            ctxOverlay.drawImage(bgOverlay_img, (bgOverlay.x+bgOverlay.width), bgOverlay.y, bgOverlay.width, bgOverlay.height)
        }
        
        

        
        renderPlayer();
        renderPlayerUI();

        
        
        if(!noEnemies && !noEnemiesOverride){
            renderEnemy();
        } else {
            ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
        }

        if(!noNpcs && !noEnemiesOverride){
            renderNPCs();
        } else {
            ctxNpc.clearRect(0, 0, canvas.width, canvas.height);
        }


    
        if(do_droneStrike && !fireBurned){
            doDroneStrike();
        }
        if(droneStrike=="striking"){
            drone_counter++;
            ctxPlayer.drawImage(drone_img, sprite_x.droneX, 0, 
                drone.cellW, drone.height,
                drone.x, drone.y,
                drone.cellW, drone.height);

            if(drone_counter>34 && bombDrop=="drop"){
                ctxPlayer.drawImage(bomb_img, sprite_x.bombX, 0, 
                    bomb.cellW, bomb.height,
                    bomb.x, bomb.y,
                    bomb.cellW, bomb.height);
            }

        }

        if(fireStarted && !fireBurned){
            for(i=0; i<=canvas.width/32; i++){
                ctxPlayer.drawImage(fires[i], sprite_x.fireX, 0, 
                    32, 32,
                    (i*32), 256,
                    32, 32);
            }
        }

        if(doFlash){
            for(i=0;i<=flashes.length-1;i++){
                if(flashes[i].go){
                    audio_explosion.play();
                    ctxPlayer.drawImage(flash_img, sprite_x.flashX[i], 0, 
                        flash.cellW, flash.cellW,
                        flashes[i].x, flashes[i].y, 
                        flash.cellW, flash.cellW);
                }
            }
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

        if(!intro){
            moveSpriteSheets();
            checkPlayerPosition();

            updateScore();
        }
        
    }
}

var x_moveAmount_fg = 1.15;
var nearEnding=false;
function moveFg(){
    if(!moving_backwards){
        gameProgression();
        
        x_moveAmount_bg=1;
        fg.x=fg.x-(moveFactor*x_moveAmount_fg);
            
        // move obstacles
        obstacle.forEach(obs => obs.x=obs.x-(moveFactor*x_moveAmount_fg));

    } else {
        if(fg.x>1152) {
            playerDeath("runback");
            fg.x=1150;
        } else {    
            fg.x=fg.x+(moveFactor*x_moveAmount_fg);
            
            // move obstacles
            obstacle.forEach(obs => obs.x=obs.x+(moveFactor*x_moveAmount_fg));

        }
    }
}
var fgIndexSet=false;
function renderFG(){
    if(!fgIndexSet){
        setFgIndex();
    }
    ctxFG.clearRect(0, 0, canvas.width, canvas.height);

    for(i=0; i<buildingsImgs.length; i++){
        ctxBG.drawImage(buildingsImgs[i], buildingsList[i].x, bgBuildings.y, bgBuildings.width, bgBuildings.height);
        ctxBG.drawImage(buildingsImgs[i], (buildingsList[i].x+buildingsList[i].width), bgBuildings.y, bgBuildings.width, bgBuildings.height);
    }

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
        if(fgsImgs[i].id == "06") {
            fgsImgIndex[5] = i;
        }
        if(fgsImgs[i].id == "07") {
            fgsImgIndex[6] = i;
        }
        if(fgsImgs[i].id == "08") {
            fgsImgIndex[7] = i;
        }
        if(fgsImgs[i].id == "09") {
            fgsImgIndex[8] = i;
        }
        if(fgsImgs[i].id == "01") {
            fgsImgIndex[9] = i;
        }
        
    }
}
var attackCount=0;
function moveSpriteSheets(){
    counter++;
    if(counter>20) counter=0;
    if(counter%6==0)
    {
        

        ////// PLAYER SPRITES /////////
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
        ////// END player /////////



        ////// ENEMY SPRITES /////////
        if(!noEnemies){
            if(isEnemy.attack){
                if(whichEnemy=="CyberBike"){
                    sprite_x.enemyX+=192;
                } else {
                    sprite_x.enemyX+=enemy[whichEnemyIndex].width;
                }
                if(sprite_x.enemyX>=spritesheetW.enemyW) {
                    sprite_x.enemyX=0;
                    
                    attackCount++;

                    if(attackCount>=enemy[whichEnemyIndex].shootAmount){
                        attackCount=0;
                        isEnemy.attack=false;
                        isEnemy.run=true;
                        startedAttack=false;
                    }
                    
                }
            } else if(isEnemy.attackBack){
                if(whichEnemy=="CyberBike"){
                    sprite_x.enemyX+=192;
                } else {
                    sprite_x.enemyX+=enemy[whichEnemyIndex].width;
                }
                if(sprite_x.enemyX>=spritesheetW.enemyW) {
                    sprite_x.enemyX=0;

                    attackCount++;

                    if(attackCount>=enemy[whichEnemyIndex].shootAmount){
                        attackCount=0;
                        isEnemy.attackBack=false;
                        isEnemy.runBack=true;
                        startedAttack=false;
                    }
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
        ////// END enemy /////////
    


        ////// NPC SPRITES /////////
        if(!noNpcs){
            for(i=0; i<=npc.length-1; i++){
                if(isNpc[i].walk || isNpc[i].walkBack){
                    spritesheetW.npcW[i]=npcList[0][2].width;
                } else if(isNpc[i].idle || isNpc[i].idleBack){
                    spritesheetW.npcW[i]=npcList[0][0].width;
                }
                if(isNpc[i].hurt || isNpc[i].hurtBack){
                    spritesheetW.npcW[i]=npcList[0][4].width;
                }

                sprite_x.npcX[i]+=npc[0].width;
                if(!isNpc[i].death && !isNpc[i].deathBack){
                    if(sprite_x.npcX[i]>=spritesheetW.npcW[i]) sprite_x.npcX[i]=0;
                } else {
                    if(!isNpc[i].killed) killNpc(i);
                }
            }
        }
        ////// END npc /////////

        // do flash spritesheet movements ///
        if(doFlash){
            flash_counter=flash_counter+0.65;
            flashes[0].go=true;
            if(flash_counter>1){flashes[1].go=true;}
            if(flash_counter>2){flashes[2].go=true;}
            if(flash_counter>3){flashes[3].go=true;}
            if(flash_counter>4){flashes[4].go=true;}
            if(flash_counter>5){flashes[5].go=true;}
            if(flash_counter>6){flashes[6].go=true;}
            if(flash_counter>7){flashes[7].go=true;}
            
            for(i=0;i<=flashes.length-1;i++){

                if(flashes[i].go){
                    sprite_x.flashX[i]+=(flash.cellW);
                    if(sprite_x.flashX[i]>=spritesheetW.flashW) {
                        flashes[i].go=false;
                        flashCount++;
                    }
                }
            }
            if(flashCount>30){
                doFlash=false;
            }
            if(flashCount>15){
                fireStarted=true;
            }
        }
        /////// END flash ////////

        if(droneStrike=="striking"){
            if(drone_counter>3){
                if(sprite_x.droneX<spritesheetW.droneW-drone.cellW) { 
                    sprite_x.droneX+=drone.cellW;
                }
            }
            if(drone_counter>35){
                if(sprite_x.bombX<spritesheetW.bombW-bomb.cellW) { 
                    sprite_x.bombX+=bomb.cellW;
                }
            }
        }

        ////// Fire sprites ////////
        if(fireStarted){
            sprite_x.fireX+=32;
            if(sprite_x.fireX>=192) sprite_x.fireX=0;
        }

    }
    if(counter%2==0){
        sprite_x.shootX+=player.width;
        if(sprite_x.shootX>=spritesheetW.shootW) sprite_x.shootX=0;
    }
}

var doFlash=false;
var numFlashes=8;
function doAflash(){
    if(!doFlash){
        doFlash=true;

        for(i=0;i<numFlashes;i++){
            flashes[i]={x:(576/numFlashes)*i,y:flash.y,go:false}
            sprite_x.flashX[i]=0;
        }
    }
}

var droneStrike="not";
var bombDrop="not";
var do_droneStrike=false;
function doDroneStrike(){
    if(droneStrike=="not"){
        droneStrike="striking";
    } else if(droneStrike=="striking") {
        drone.x+=6;
        if(drone_counter>30){
            bombDrop="drop";
            if(bomb.y<player_ground.floor-bomb.height){
                bomb.x+=0.5;
                bomb.y+=2.5;
            } else {
                bombDrop="done";
            }
        }
    }
    if(drone.x>canvas.width){
        droneStrike="done";
    }

    if(droneStrike=="done"){
        doAflash();
        if(!fireStarted && !fireBurned){
            // initialise fires:
            var whichFire=0;
            // var fires;
            for(i=0; i<=canvas.width/32; i++){
                whichFire++;
                switch(whichFire) {
                    case 1: fires[i] = fire01_img; break;
                    case 2: fires[i] = fire02_img; break;
                    case 3: fires[i] = fire03_img; break;
                    case 4: fires[i] = fire04_img; whichFire=0;  break;
                }
            }
            
            gsap.delayedCall(12, function(){ fireStarted=false; fireBurned=true; moveFactor_enemy=1; do_droneStrike=false;});
        }
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
        if(isPlayer.run || isPlayer.runBack){
            spritesheetW.playerW=player_hurtRun.width;
        }
        if(isPlayer.run){
            ctxPlayer.drawImage(player_hurtRun_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else if(isPlayer.runBack){
            ctxPlayer.drawImage(player_hurtRunBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else {
            spritesheetW.playerW=player_hurt.width;
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
        }
    } else if(isPlayer.shot){ 


        // [todo] - move this elsewhere:
        spritesheetW.playerW=player_shot.width;

        if(!moving_backwards){
            ctxPlayer.drawImage(player_shot_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x-player_shot.offsetX, player.y, 
                player.width, player.height);
        } else {
            ctxPlayer.drawImage(player_shotBack_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x-player_shotBack.offsetX, player.y, 
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

            // make player stop moving while shooting -- dont do this during fire scene
            if(!fireStarted || fireBurned){
                player.x-=moveFactor*x_moveAmount_fg;
            }


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

            if(!fireStarted || fireBurned){
                player.x+=moveFactor*x_moveAmount_fg;
            }


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
        else if(isPlayer.walk && (!fireStarted || fireBurned)){
            spritesheetW.playerW=player_walk.width;

            ctxPlayer.drawImage(player_walk_img, sprite_x.playerX, 0,
                player.width, player.height,
                player.x, player.y, 
                player.width, player.height);
        } else if(isPlayer.walk && (fireStarted && !fireBurned)){
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
    if(player.x>(canvas.width/2)-(player.width/2) && !fireStarted && !doFlash && !do_droneStrike){
        player.x=(canvas.width/2)-(player.width/2);

        /// if we're on fire screen allow player movement
    } else if(player.x>canvas.width-player.hitW && fireStarted && doFlash && do_droneStrike){
        player.x=canvas.width-player.hitW;
    }
// to left:
    if((player.x<=0)){
        player.x=0;
    }

    // DEFINE PLAYER AREA

    let playerR = player.x+player.hitW;
    let playerL = player.x+player.hitX;
    if(moving_backwards) { playerL = player.x+player.hitXB; }
    let playerT = player.y+player.hitY;
    let playerB = playerT+player.hitH;

    isPlayer.shot=false;
    isPlayer.hurt=false;

    if(highlights){
    // [todo] player hit area
        ctxPlayer.beginPath();
        ctxPlayer.rect(playerL, playerT, player.hitW, player.hitH);
        ctxPlayer.fillStyle = "rgba(0,255,0,0.5)";
        ctxPlayer.fill();
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
        ctxEnemy.beginPath();
        ctxEnemy.rect(enemyL, enemyT, enemy[whichEnemyIndex].hitW, enemy[whichEnemyIndex].hitH);
        ctxEnemy.fillStyle = "rgba(255,0,0,0.5)";
        ctxEnemy.fill();
    }


    var npcT = npc_groundY+npc[0].hitY;
    var npcL = [];
    var npcR = [];
    var playerHitsNPC=false;

    for(i=0; i<=npc.length-1; i++){
        npcL[i]=npc[i].x+npc[i].hitX;
        if(isNpc[i].walkBack) { npcL[i] = npc[i].x+npc[i].hitXB; }
        npcR[i] = npc[i].x+npc[i].hitW;

        if(isPlayer.attack || fireStarted || doFlash) {
            if(playerR<npcL[i] && npcL[i]-playerR<player.shootRange
             && playerT+player_shoot.offsetY>=npcT
             || fireStarted || doFlash){
                if(isNpc[i].walk) {
                    isNpc[i].hurt=true;
                }
                else if(isNpc[i].walkBack) {
                    isNpc[i].hurtBack=true;
                }

                score.curr=score.curr+0.01;

                npc[i].health--;
                npc[i].health = npc[i].health < 0 ? 0 : npc[i].health;
                if(npc[i].health==0) {
                    if(isNpc[i].walk && !isNpc[i].death) {
                        sprite_x.npcX[i]=0;
                        isNpc[i].death=true;
                    } else if(isNpc[i].walkBack && !isNpc[i].deathBack) {
                        sprite_x.npcX[i]=0;
                        isNpc[i].deathBack=true;
                    }
                }
            } else {
                isNpc[i].hurt=false;
                isNpc[i].hurtBack=false;
            }
        } else if(isPlayer.attackBack){
            if(playerL>npcR[i] && npcR[i]-playerL>-player.shootRange
            && playerT+player_shoot.offsetY>=npcT){
                if(isNpc[i].walk) {
                    isNpc[i].hurt=true;
                }
                else if(isNpc[i].walkBack) {
                    isNpc[i].hurtBack=true;
                }

                score.curr=score.curr+0.1;

                npc[i].health--;
                npc[i].health = npc[i].health < 0 ? 0 : npc[i].health;
                if(npc[i].health==0) {
                    if(isNpc[i].walk && !isNpc[i].death) {
                        sprite_x.npcX[i]=0;
                        isNpc[i].death=true;
                    } else if(isNpc[i].walkBack && !isNpc[i].deathBack) {
                        sprite_x.npcX[i]=0;
                        isNpc[i].deathBack=true;
                    }
                }
            }
        } else {
            isNpc[i].hurt=false;
            isNpc[i].hurtBack=false;
        }

        if(!isNpc[i].killed){
            if(highlights){
                ctxEnemy.beginPath();
                ctxEnemy.rect(npcL[i], npcT, npc[i].hitW, npc[i].hitH);
                ctxEnemy.fillStyle = "rgba(255,0,0,0.5)";
                ctxEnemy.fill();
            }
        }

        if(!isNpc[i].killed 
        && !isPlayer.invincible
        && playerL < npcL[i] + npc[i].hitW
        && playerL + player.hitW > npcL[i]
        && playerT < npcT + npc[i].hitH
        && playerT + player.hitH > npcT){
            // colliding! 
            playSFX(audio_playerhurt);
            
            isPlayer.hurt=true;
            player.health=player.health-0.01;
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("npc");
            }

            isNpc[i].hitPlayer=true;
            // return
        } else {
            isNpc[i].hitPlayer=false
        }

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
            }


            // new var to handle moveFactor adjustments when player stuck at obs
            isPlayer.atObstacle=true;

            x_moveAmount_bg=0;

// if within obstacle but above it:
        } else if(playerR > obstacleL && playerL < obstacleR && playerB < obstacleT){ 

            x_moveAmount_bg=1;
            
            if(isPlayer.run){
                player.x+=2;
            }
            if(isPlayer.runBack){
                player.x-=2;
            }

            isPlayer.atObstacle=false;

            if(player_ground.y>obstacleT){
                player_ground.y=obstacleT;
            } 

// not within obstacle
        } else {

            isPlayer.atObstacle=false;
            
            if(playerR < obstacleL || playerL > obstacleR){
                player_ground.y=player_ground.floor;
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
        && playerT + player.hitH > enemyT){

        // colliding! 
        playSFX(audio_playerhurt);
        
        isPlayer.hurt=true;
        player.health--;
        player.health = player.health < 0 ? 0 : player.health;
        if(player.health==0) { 
            playerDeath("enemy");
        }
        return
    }


        
    

/////// PLAYER SHOOT HITS: //////////
    if(isPlayer.attack || fireStarted) {
        if(playerR<enemyL && enemyL-playerR<player.shootRange
         && playerT+player_shoot.offsetY>=enemyT
         || fireStarted){
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
        // console.log(enemyR-playerL);
        if(playerL>enemyR && enemyR-playerL>-player.shootRange
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



///// ENEMY SHOOTING HITS PLAYER //////////

    if(isEnemy.attack) {

        if(playerL>enemyR && playerL-enemyR<enemy[whichEnemyIndex].shootRange
         && playerT+player_shoot.offsetY>=enemyT
         && !isPlayer.invincible){

            playSFX(audio_playerhurt);

            isPlayer.shot=true;

            player.health=player.health-enemy[whichEnemyIndex].shootDamage;
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("shoot");
            }
        } else {
            isPlayer.shot=false;
        }

    } else if(isEnemy.attackBack) {
         
        if(playerR<enemyL && enemyL-playerR<=enemy[whichEnemyIndex].shootRange
         && playerT+player_shoot.offsetY>=enemyT
         && !isPlayer.invincible){
            isPlayer.shot=true;

            player.health=player.health-enemy[whichEnemyIndex].shootDamage
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("shoot");
            }
        } else {
            isPlayer.shot=false;
        }
    }

    if(fireStarted && !fireBurned){
        moveFactor_enemy=0;
        if(playerB>280 && !isPlayer.invincible) {
            isPlayer.hurt=true;

            player.health=player.health-0.2
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("fire");
            }
        }
    }


}

function setupJumpTL(){
    tlJump = gsap.timeline({paused:true});
    tlJump.addLabel('up', 0)
        .to(player,{y:"-="+player.jumpH,ease:"power3.out", duration:0.338},"up");
}

var tlEnemyVars = gsap.timeline({paused:true,onComplete:enemyTLplayed,repeatDelay:4,repeat:-1});
function setupEnemyTimeLine() {

    tlEnemyVars.addLabel("reset",0);

    if(isEnemy.runBack){
        tlEnemyVars.to(isEnemy,0,{runBack:true,run:false,attack:false,attackBack:false,hurt:false,hurtBack:false,killed:false,exploding:false},"reset")
    } else {
        tlEnemyVars.to(isEnemy,0,{runBack:false,run:true,attack:false,attackBack:false,hurt:false,hurtBack:false,killed:false,exploding:false},"reset")
    }

    
    tlEnemyVars.addLabel("start",1)
        .addLabel("attack","start+=2")
        .call(enemyAttack,[],"attack");


    tlEnemyVars.restart();
}


function enemyAttack(){
    if(!isEnemy.killed && !isEnemy.hurt && !isEnemy.hurtBack){
        if(isEnemy.runBack){
            isEnemy.attackBack=true;
        } else {
            isEnemy.attack=true;
        }


        

        
        // different SFX sound per enemyIndex:
        if(whichEnemy=="BattleCar"){
            playSFX(audio_heavyshoot);
        }
        if(whichEnemy=="CyberBike"){
            playSFX(audio_blaster);
        }
        
    }
}

function enemyTLplayed(){
    // console.log("enemyTLplayed");
}


var npcIndexFlag=false;
function setNPCIndex(){

    var whichNPC = "Punk";
    
    for(i=0; i<npcImgs.length; i++){
        if(npcImgs[i].id == whichNPC+"-Walk-back") {
            npcImgIndex.walkBack=i;
        }
        if(npcImgs[i].id == whichNPC+"-Hurt-back") {
            npcImgIndex.hurtBack=i;
        }
        if(npcImgs[i].id == whichNPC+"-Hurt") {
            npcImgIndex.hurt=i;
        }
        if(npcImgs[i].id == whichNPC+"-Walk") {
            npcImgIndex.walk=i;
        }
        if(npcImgs[i].id == whichNPC+"-Attack") {
            npcImgIndex.attack=i;
        }
        if(npcImgs[i].id == whichNPC+"-Attack-back") {
            npcImgIndex.attackBack=i;
        }
        if(npcImgs[i].id == whichNPC+"-Death") {
            npcImgIndex.death=i;
        }
        if(npcImgs[i].id == whichNPC+"-Death-back") {
            npcImgIndex.deathBack=i;
        }
    }
    for(i=0; i<=npc.length-1; i++){
        sprite_x.npcX[i]=0;
        moveFactor_npc[i]=1;
        isNpc[i].walk=true;
    }
    
}
var moveFactor_npc=[];
function renderNPCs(){
    if(!npcIndexFlag){
        npcIndexFlag=true;
        setNPCIndex();
    }

    ctxNpc.clearRect(0, 0, canvas.width, canvas.height);
    var ind;
    for(i=0; i<=npc.length-1; i++){

        if(isNpc[i].hurt || isNpc[i].death) {
            moveFactor_npc[i]=-1.5;
        } else if(isNpc[i].hurtBack || isNpc[i].deathBack) {
            moveFactor_npc[i]=.5;
        } else moveFactor_npc[i]=1;

        if(moving_backwards) {
            if(isNpc[i].hurt) {
                moveFactor_npc[i]=0;
            } else if(isNpc[i].hurtBack) {
                moveFactor_npc[i]=0;
            } else moveFactor_npc[i]=1;
        }
        if(do_droneStrike) {
            moveFactor_npc[i]=0;
        }

        if(isNpc[i].walkBack) {
            ind = npcImgIndex.walkBack;

            npc[i].x-=moveFactor_npc[i];

            if(isPlayer.run && !isPlayer.atObstacle) {
                npc[i].x-=moveFactor_npc[i];  
                if(nearEdge.right){
                    npc[i].x-=moveFactor_npc[i];  
                }
            }
            if(moving_backwards) {

                npc[i].x+=moveFactor_npc[i]/2;  
                if(isPlayer.runBack && !isPlayer.atObstacle) {
                    npc[i].x+=moveFactor_npc[i]/3;  
                }
            }
        } else if(isNpc[i].walk) {
            ind = npcImgIndex.walk;


            npc[i].x+=moveFactor_npc[i]/3; 

            if(isPlayer.run && !isPlayer.atObstacle) {
                if(nearEdge.right){
                    npc[i].x-=(moveFactor_npc[i]*1.25);  
                }
            }
            if(moving_backwards) {

                npc[i].x+=moveFactor_npc[i]/2; 
                if(isPlayer.runBack && !isPlayer.atObstacle) {
                    npc[i].x+=moveFactor_npc[i];  
                }
            }
        } 
        if(isNpc[i].hurt) {
            ind = npcImgIndex.hurt;
        }
        if(isNpc[i].hurtBack) {
            ind = npcImgIndex.hurtBack;
        }
        if(isNpc[i].death) {
             ind = npcImgIndex.death;
        }
        if(isNpc[i].deathBack) {
             ind = npcImgIndex.deathBack;
        }

        ctxNpc.drawImage(npcImgs[ind], sprite_x.npcX[i], 0,
            48, 48,
            npc[i].x, npc[i].y, 
            48, 48);


        /////// ENEMY REPEAT OR OFF SCREEN / TURN BACK: //////////
        if(!isNpc[i].killed){
            if((isNpc[i].walk || isNpc[i].hurt) && npc[i].x<-(npc[i].width+3)) {

                // stop enemy going off screen to left:
                npc[i].x=canvas.width;
                if(isNpc[i].hurtBack){
                    isNpc[i].hurtBack=false;
                }
                isNpc[i].walk=false;
                isNpc[i].walkBack=true;
            }
             else if((isNpc[i].walkBack || isNpc[i].attackBack || isNpc[i].hurtBack) && npc[i].x<0){
                if(isNpc[i].hurtBack){
                    isNpc[i].hurtBack=false;
                    isNpc[i].hurt=true;
                } else {
                    isNpc[i].walkBack=false;
                    isNpc[i].walk=true;
                }
            }

            // turnaround npc when at screen front
            if(npc[i].x>canvas.width){
                isNpc[i].walkBack=true;
                isNpc[i].walk=false;
            }
        }
    }
}
    
var moveFactor_enemy = 1;
var whichEnemyIndex=0;
var startedAttack = false;
function renderEnemy(whichEnemy) {
    enemyCellW=enemy.width;
    // init enemy:
    if(!enemyIndexFlag) {

        // only do this once:
        setEnemyIndex();
        
        setupEnemyTimeLine();
    }


    if(isEnemy.killed){
        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

        isEnemy.exploding=false;

        // [todo]-delay this so theres a break between enemies!
        // re-initialise enemy for a new one:
        if(!nearEnding){
            enemyIndexFlag=false;
        } else {
            tlEnemyVars.pause();
        }
        return;
    }

    if(isEnemy.exploding){
    
        playSFX(audio_explosion);

        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

        // play explosion!
        spritesheetW.explosionW=explosion.width;
        ctxEnemy.drawImage(explosion_img, sprite_x.explosionX, 0,
            96, 96,
            enemy[whichEnemyIndex].x-enemy[whichEnemyIndex].explosionOffsetX, enemy[whichEnemyIndex].y-enemy[whichEnemyIndex].explosionOffsetY, 
            96, 96);

        return;
    }

/////// DO ENEMY MOVE FACTOR CLACULATIONS /////


    if(isEnemy.runBack){
        enemy[whichEnemyIndex].x-=moveFactor_enemy; 

        if(isPlayer.run && !isPlayer.atObstacle) {
            enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/2;  
            if(isPlayer.runBack && !isPlayer.atObstacle) {
                enemy[whichEnemyIndex].x+=moveFactor_enemy/3;  
            }
        }
    } else if(isEnemy.run){
        enemy[whichEnemyIndex].x+=moveFactor_enemy/3; 

        if(isPlayer.run && !isPlayer.atObstacle) {
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=(moveFactor_enemy*1.25);  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/2; 
            if(isPlayer.runBack && !isPlayer.atObstacle) {
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
        enemyCellW = enemiesList[whichEnemyIndex][4].cellW;

        if(!startedAttack){
            startedAttack=true;
            sprite_x.enemyX=0;
        }
        spritesheetW.enemyW=enemiesList[whichEnemyIndex][4].width;
        
        //attack
        drawEnemy(enemyImgIndex.attack, sprite_x.enemyX, whichEnemyIndex);
        
    } else if(isEnemy.attackBack){
        enemyCellW = enemiesList[whichEnemyIndex][5].cellW;

        if(!startedAttack){
            startedAttack=true;
            sprite_x.enemyX=0;
        }

        spritesheetW.enemyW=enemiesList[whichEnemyIndex][5].width;
        
        //attackBack
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

    /////// ENEMY REPEAT OR OFF SCREEN / TURN BACK: //////////
    if(!isEnemy.killed){
        
        if((isEnemy.run || isEnemy.attack || isEnemy.hurt) && enemy[whichEnemyIndex].x<-(enemy[whichEnemyIndex].width+3)) {

            // stop enemy going off screen to left:
            enemy[whichEnemyIndex].x=canvas.width;
            if(isEnemy.hurtBack){
                isEnemy.hurtBack=false;
            }
            isEnemy.run=false;
            isEnemy.runBack=true;
        }
         else if((isEnemy.runBack || isEnemy.attackBack || isEnemy.hurtBack) && enemy[whichEnemyIndex].x<0){
            if(isEnemy.hurtBack){
                isEnemy.hurtBack=false;
                isEnemy.hurt=true;
            } else {
                isEnemy.runBack=false;
                isEnemy.run=true;
            }
        }

        // enemy
        if(enemy[whichEnemyIndex].x>canvas.width){
            isEnemy.runBack=true;
            isEnemy.run=false;
        }
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
    

    if((isEnemy.attackBack || isEnemy.attack) && whichEnemy=="CyberBike"){
        if(isEnemy.attackBack){
            ctxEnemy.drawImage(enemyImgs[img], spx, 0,
                enemyCellW, enemy[ind].height,
                (enemy[ind].x-enemyCellW/2), enemy[ind].y, 
                enemyCellW, enemy[ind].height);
        } 
        else if(isEnemy.attack){
            ctxEnemy.drawImage(enemyImgs[img], spx, 0,
                enemyCellW, enemy[ind].height,
                enemy[ind].x, enemy[ind].y, 
                enemyCellW, enemy[ind].height);
        }
    } else {
        ctxEnemy.drawImage(enemyImgs[img], spx, 0,
            enemy[ind].width, enemy[ind].height,
            enemy[ind].x, enemy[ind].y, 
            enemy[ind].width, enemy[ind].height);
    }
}

var enemyIndexFlag = false;
var whichEnemy="";
function setEnemyIndex(chosenEnemy){

    enemyIndexFlag=true;
    enemyImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0, attack:0, attackBack:0}


    // if chosenEnemy -not yet in use - could be used to force certain enemy:
    if(chosenEnemy==undefined){
        if(enemyKillCount>=enemy.length) { enemyKillCount=0; }
        whichEnemyIndex=enemyKillCount;
        
        if(whichEnemyIndex==0) { whichEnemy="CyberBike"; }
        if(whichEnemyIndex==1) { whichEnemy="BattleCar"; }

    // set index manually if passed in to this func:

    } else if(chosenEnemy=="BattleCar") { 
        whichEnemy=="BattleCar";
        whichEnemyIndex = 1;
    } else if(chosenEnemy=="CyberBike") { 
        whichEnemyIndex = 0;
        whichEnemy=="CyberBike";
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

    
    sprite_x.enemyX=0;
}

function killEnemy(whichEnemy){
    isEnemy.exploding=true;
}

function killNpc(whichNpcIndex){
    isNpc[whichNpcIndex].killed=true;

    score.curr=score.curr+10;
        
    gsap.delayedCall(2+whichNpcIndex,function(){

        // console.log('respawn Npc');
        npc[whichNpcIndex].health=npc[whichNpcIndex].fullhealth;
        isNpc[whichNpcIndex].hurt=false;
        isNpc[whichNpcIndex].hurtBack=false;
        isNpc[whichNpcIndex].death=false;
        isNpc[whichNpcIndex].deathBack=false;
        isNpc[whichNpcIndex].walk=false;
        isNpc[whichNpcIndex].walkBack=false;

        sprite_x.npcX[whichNpcIndex]=0;
        isNpc[whichNpcIndex].killed=false;

        moveFactor_npc[whichNpcIndex]=1;

        if(getRandomInt(2)==0){
            isNpc[whichNpcIndex].walk=true;
            npc[whichNpcIndex].x=-48;
        } else {
            isNpc[whichNpcIndex].walkBack=true;
            npc[whichNpcIndex].x=canvas.width;
        }

    });
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

var fireBurned = false;
function gameProgression(){

    //temp
        // noNpcs=false;
        // noEnemies=false;

    // after 1 FGs progssion turn on Enemies:
    if(fg.x<-(fg.width)+canvas.width && noNpcs){
        noNpcs=false;
    }

    // after 2 FGs progssion turn on Enemies:
    if(fg.x<-(fg.width*2)+canvas.width && noEnemies){
        noEnemies=false;
    }

    

    // after 3 FGs progssion turn on fire:
    if(fg.x<-(fg.width*3)-(canvas.width/2)){
        if(droneStrike=="not"){
            do_droneStrike=true;}
    }


    
    // when nearing end of FGs darken BGs ready for outro
    if(fg.x<-((fg.width*(fgsList.length))-(1152*2)-canvas.width) && !nearEnding){
        nearEnding=true;
        gsap.fromTo("#bg-canvas",3,{filter:"brightness(1)"},{filter:"brightness(.5)"});
    }


    // reached end of game:
    if(fg.x<-((fg.width*(fgsList.length))-1152-canvas.width)){
        // 'end'
        // end of foregrounds reached, play ending! 
        startEnding();
    }
}

function startEnding(){
    collided=true;

    createjs.Ticker.removeEventListener("tick", updateStage);
    createjs.Ticker.removeEventListener("tick", checkKeys);

    createjs.Ticker.addEventListener("tick", playEnding);
}


var onlyDieOnce = false;
function playerDeath(death_type){
    if(!onlyDieOnce) {

        playSFX(audio_playerdead,true);

        spritesheetW.playerW=player_dead.width;

        if(!moving_backwards) {
            sprite_x.playerX=0;
        }
        isPlayer.dead=true;
        onlyDieOnce=true;
        player.lives--;

        tlEnemyVars.pause();

        if(death_type=="enemy"){
            if(player.lives>0){
                died_txt.innerHTML="you have fallen, but the quest goes on";
            } else {
                died_txt.innerHTML="you fought valiantly, but you died in battle";
            }
        } else if(death_type=="shoot"){
            if(player.lives>0){
                died_txt.innerHTML="you have fallen, but the quest goes on";
            } else {
                died_txt.innerHTML="you fought valiantly, but you died in battle";
            }
        } else if(death_type=="runback"){
            died_txt.innerHTML="you cannot run away from your destiny";
        } else if(death_type=="fire"){
            died_txt.innerHTML="you have drowned in the flames";
        }
        
        



        if(player.lives==0){

            // player has no more lives - do final died screen


            typeText(died_txt,2,0);
            deathTL = gsap.timeline({paused:true, onComplete:bindRestartButtons});

            deathTL.to(["#overlay-death","#died_txt"],0,{display:"block"},0)
                .to("#died_txt",.2,{alpha:1},">")
                .to("#overlay-death",1,{alpha:1},"<")
                .call(playMusic,[audio_dieMusic],">")
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

    tlEnemyVars.seek(0);
    deathTL.pause();
    deathTL.seek(0);

    score.curr=0;
    player.health=full_health;
    player.lives=full_lives;
    isPlayer.dead=false;
    isPlayer.walk=true;
    collided=false;
    onlyDieOnce=false;

    noNpcs=true;
    noEnemies=true;


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
        enemy[i].health=enemy[i].fullhealth;
    }
    for(i=0; i<=npc.length-1; i++){
        sprite_x.npcX[i]=0;
        moveFactor_npc[i]=1;
        isNpc[i].walk=true;
        npc[i].x=npc[i].initX;
        npc[i].health=npc[i].fullhealth;
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

    fireStarted=false;
    fireBurned=false;
    doFlash=false;
    flash_counter=0;
    do_droneStrike=false;
    droneStrike="not";
    bombDrop="not";
    drone_counter=0;
    drone.x=drone.initX;
    bomb.x=bomb.initX;
    bomb.y=bomb.initY;


    if(nearEnding){
        nearEnding=false;
        gsap.to("#bg-canvas",0,{filter:"brightness(1)"});
    }

    if(endingPlaying){
        endingPlaying=false;
        createjs.Ticker.framerate = frameRate;
        createjs.Ticker.removeEventListener("tick", playEnding);
        
        createjs.Ticker.addEventListener("tick", updateStage);
        createjs.Ticker.addEventListener("tick", checkKeys);

        gsap.to(["#overlay-bg"],0,{alpha:1,display:"none"});

        endingTL.pause();
        endingTL.seek(0);
    }
    
    
    playMusic(audio_music);
}

function continueGame() {
    unbindContinueButtons();
    bindButtons();

    tlEnemyVars.restart();
    deathTL.pause();
    deathTL.seek(0);
    onlyDieOnce=false;
    player.health=full_health;
    isPlayer.dead=false;
    isPlayer.idleBack=true;
    collided=false;
    isPlayer.invincible=true;

    audio_playerhurt.volume=1;

    
    var tlFlashPlayer=gsap.timeline({onComplete:function(){
        if(!invincibleOverride){
            isPlayer.invincible=false;
        }
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
    canvasShowing=true;

    if(zoomIn){
        var scaleTo=2;
        gsap.to("#container",zoomSpeed,{scale:scaleTo});
        while(container.getBoundingClientRect().width>windowwidth){
            scaleTo=scaleTo-0.1;
            gsap.to("#container",0,{scale:scaleTo});
        }
    }
        
    if(devTools){
        wrap.classList.add("devTools");
    }
    gsap.to(score_txt,0,{display:"block",alpha:1});
}


function updateScore(){

    score_txt.innerHTML=(Math.round(score.curr).toWidth(6,'0')); //=> 00000100
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
    invincible_btn.addEventListener("click", toggleInvincible);
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
function toggleInvincible() {
    if(!invincibleOverride) {
        invincibleOverride=true;
        isPlayer.invincible=true;
    } else {
        invincibleOverride=false;
        isPlayer.invincible=false;
    }
}

function toggleEnemies() {
    if(!noEnemiesOverride){
        noEnemiesOverride=true;
    } else {
        noEnemiesOverride=false;
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

function getRandom(max) {
    var num = Math.random() * max
    return Math.round(num * 100) / 100;
;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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

function log(text){
    var logtxt = document.getElementById("log");
    logtxt.value=text+"\n"+logtxt.value;

}


function toggleCursor(off) {
    if(off) {
        container.style.cursor="none";
    } else {
        container.style.cursor="default";
    }
}