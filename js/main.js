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

var sprite_x = {playerX:0, enemyX:0, shootX:0, explosionX:0, npcX:[0]};

var spritesheetW = {playerW: player_idle.width, 
                    enemyW:enemiesList[0][0].width,
                    shootW:player_shoot.width,
                    explosionW:explosion.width,
                    npcW:[npcList[0][2].width]  }; // sprites width

var counter=0;
    
var isSongToEnding=false; 
var collided=false; 
var paused=false;
var muted = false;
var noEnemies = true;
var noEnemiesOverride=false;
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

    // npc
    for(i=0; i<npcList.length; i++){
        npcList[i].forEach(depictNpc);
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

function gamePause(){
    
    if(!paused && !isPlayer.dead){
        paused=true;
        gsap.to(["#paused_txt","#overlay-bg","#start-select"],0,{display:"block"});
        gsap.to(["#paused_txt","#start-select"],.2,{alpha:1});
        gsap.to("#overlay-bg",1,{alpha:1});

        tlEnemyVars.pause();

        audio.pause();
    } else {

        paused=false;
        gsap.to(["#start-select"],0,{alpha:0});
        gsap.to(["#paused_txt","#overlay-bg"],0,{alpha:0,display:"none"});

        tlEnemyVars.play();

        if(!isPlayingAudio && !muted) audio.play();
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
        playSFX(audio_shoot);
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

        
        
        if(!noEnemies && !noEnemiesOverride){
            renderEnemy();

            
        } else {
            ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
        }
        renderNPCs();




        
        



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
var nearEnding=false;
function moveFg(){
    if(!moving_backwards){

        // console.log(fg.x,-(fg.width*2));
        if(fg.x<-(fg.width*2)+canvas.width && noEnemies){
            noEnemies=false;
        }
        

        if(fg.x<-((fg.width*(fgsList.length))-(1152*2)-canvas.width) && !nearEnding){
            nearEnding=true;
            gsap.fromTo("#bg-canvas",3,{filter:"brightness(1)"},{filter:"brightness(.5)"});
        }

        if(fg.x<-((fg.width*(fgsList.length))-1152-canvas.width)){
               
            // 'end'
            // end of foregrounds reached, play ending! 
            collided=true;



            createjs.Ticker.removeEventListener("tick", updateStage);
            createjs.Ticker.removeEventListener("tick", checkKeys);

            // keysWait=true;

            createjs.Ticker.addEventListener("tick", playEnding);

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
    if(counter>999) counter=0;
    if(counter%6==0){
        

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
////// END enemy /////////
    


////// NPC SPRITES /////////
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
////// END npc /////////



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

        if(isPlayer.attack) {
            if(playerR<npcL[i] && npcL[i]-playerR<player.shootRange
             && playerT+player_shoot.offsetY>=npcT){
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
                playerDeath("enemy");
            }
            return
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
                if(isPlayer.runBack){
                    moveFactor_enemy=4;
                }
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

            // if(!tlJump.isActive()){
                if(playerR < obstacleL || playerL > obstacleR){
                    player_ground.y=player_ground.floor;
                }
            // }


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

    isPlayer.hurt=false;
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
    if(isPlayer.attack) {
        if(playerR<enemyL && enemyL-playerR<player.shootRange
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

            isPlayer.hurt=true;

            player.health=player.health-0.2;
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("shoot");
            }
        } else {
            isPlayer.hurt=false;
        }

    } else if(isEnemy.attackBack) {
         
        if(playerR<enemyL && enemyL-playerR<=enemy[whichEnemyIndex].shootRange
         && playerT+player_shoot.offsetY>=enemyT
         && !isPlayer.invincible){
            isPlayer.hurt=true;

            player.health=player.health-0.2
            player.health = player.health < 0 ? 0 : player.health;
            if(player.health==0) { 
                playerDeath("shoot");
            }
        } else {
            isPlayer.hurt=false;
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


        

        if(!noAudio){
            // different SFX sound per enemyIndex:
            if(whichEnemy=="BattleCar"){
                playSFX(audio_shoot);
            }
            if(whichEnemy=="CyberBike"){
                playSFX(audio_blaster);
            }
        }
    }
}

function enemyTLplayed(){
    // console.log("enemyTLplayed");
}


var npcIndexFlag=false;
function setNPCIndex(){

    npcIndexFlag=true;
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
    }
    isNpc[0].walk=true;
    isNpc[1].walkBack=true;
    isNpc[2].walkBack=true;
    isNpc[3].walkBack=true;
    
}
var moveFactor_npc=[];
function renderNPCs(){
    if(!npcIndexFlag){
        npcIndexFlag=true;
        setNPCIndex();
    }

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


        if(isNpc[i].walkBack) {
            ind = npcImgIndex.walkBack;

            npc[i].x-=moveFactor_npc[i];

            if(isPlayer.run) {
                npc[i].x-=moveFactor_npc[i];  
                if(nearEdge.right){
                    npc[i].x-=moveFactor_npc[i];  
                }
            }
            if(moving_backwards) {

                npc[i].x+=moveFactor_npc[i]/2;  
                if(isPlayer.runBack) {
                    npc[i].x+=moveFactor_npc[i]/3;  
                }
            }
        } else if(isNpc[i].walk) {
            ind = npcImgIndex.walk;


            npc[i].x+=moveFactor_npc[i]/3; 

            if(isPlayer.run) {
                if(nearEdge.right){
                    npc[i].x-=(moveFactor_npc[i]*1.25);  
                }
            }
            if(moving_backwards) {

                npc[i].x+=moveFactor_npc[i]/2; 
                if(isPlayer.runBack) {
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


        ctxEnemy.drawImage(npcImgs[ind], sprite_x.npcX[i], 0,
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
                isNpc[i].walkBack=true

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

            // enemy
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
    if(!enemyIndexFlag && !nearEnding) {

        // only do this once:
        setEnemyIndex();
        
        setupEnemyTimeLine();
    }


    if(isEnemy.killed){
        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

        // [todo]-delay this so theres a break between enemies!
        // re-initialise enemy for a new one:
        enemyIndexFlag=false;
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
            isEnemy.runBack=true

        }
         else if((isEnemy.runBack || isEnemy.attackBack || isEnemy.hurtBack) && enemy[whichEnemyIndex].x<0){
         // else if((isEnemy.runBack || isEnemy.attackBack || isEnemy.hurtBack) && enemy[whichEnemyIndex].x<-(enemy[whichEnemyIndex].width)){
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
        // console.log('killNpc');

    gsap.delayedCall(2,function(){

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
            npc[whichNpcIndex].x=0;
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

    tlEnemyVars.restart();
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



function toggleCursor(off) {
    if(off) {
        container.style.cursor="none";
    } else {
        container.style.cursor="default";
    }
}