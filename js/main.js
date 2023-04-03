var wrap,container;
var body = document.body,
html = document.documentElement;
var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
html.clientHeight, html.scrollHeight, html.offsetHeight );

var windowwidth;

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isFirefox=false;
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
    isFirefox=true;
}


// var tlIntroScreen = gsap.timeline();





var bg_canvas = document.getElementById('bg-canvas');
var bgOverlay_canvas = document.getElementById('bgOverlay-canvas');
var fg_canvas = document.getElementById('fg-canvas');
var player_canvas = document.getElementById('player-canvas');
var enemy_canvas = document.getElementById('enemy-canvas');


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

var ctxBG = bg_canvas.getContext('2d');
var ctxOverlay = bgOverlay_canvas.getContext('2d');
var ctxFG = fg_canvas.getContext('2d');

var ctxPlayer = player_canvas.getContext('2d');
var ctxEnemy = enemy_canvas.getContext('2d');

var imageAdded= 0,
    imgLoaded = 0;

var health = 1000;



var nearEdge = {left:false,right:false}

var sprite_x = {playerX:0, enemyX:0, shootX:0, explosionX:0};

var spritesheetW = {playerW: player_idle.width, enemyW:enemiesList[0][0].width, shootW:shoot.width, explosionW:explosion.width }; // sprites width

var counter=0;
    
var isSongToEnding=false; 
var collided=false; 
var paused=false;
var moving_backwards = false; 

var tlJump = gsap.timeline({paused:true,onComplete:function(){keysWait=false; isPlayer.jump=false}});



var frameRate = 100;


function initCanvasAnim(){

    // pre load all images:
    
    // background 
        bgsList.forEach(depictBgs);


    // buildings 
        buildingsList.forEach(depictBuildings);
        

    // lamps + road

        fg_img = new Image();
        imageAdded++;
        fg_img.src = fg.url;
        fg_img.onload = function(){
            ctxBG.drawImage(fg_img, fg.x, fg.y, fg.width, fg.height);
            imgLoaded++;
        }

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

        shoot_img = new Image();
        imageAdded++;
        shoot_img.src = shoot.url;
        shoot_img.onload = function(){
            imgLoaded++;
        }

        shootBack_img = new Image();
        imageAdded++;
        shootBack_img.src = shootBack.url;
        shootBack_img.onload = function(){
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

        tlJump.to(player,.9,{y:player_groundY-enemy[whichEnemyIndex].hitH-5,ease:"power3.out"},0).to(player,.8,{y:player_groundY,ease:"sine.in"},"<.7")
        tlJump.duration(.6);

}


function checkKeyPress(e){
    if(e.code == "Space" && !paused) {
        paused=true;
    } else {
        paused=false;
    }
}

var keysWait = false;
function checkKeys(){ 

    if(!keysWait){
    
        if (Keyboard.isDown(Keyboard.RIGHT) && Keyboard.isDown(Keyboard.LEFT)) { 
            if(moving_backwards){
                moving_backwards = false;
                isPlayer.runBack=false;
                isPlayer.idle=false;
                isPlayer.run=true;
                // keysWait=true;
            } else {
                moving_backwards = true;
                isPlayer.idle=false;
                isPlayer.run=false;
                isPlayer.runBack=true;
                // keysWait=true;
            }
        }
        else if (Keyboard.isDown(Keyboard.LEFT)) { 
            moving_backwards = true;

            isPlayer.idle=false;
            isPlayer.run=false;
            isPlayer.runBack=true;
        }
        else if (Keyboard.isDown(Keyboard.RIGHT)) { 
            moving_backwards = false;

            isPlayer.idle=false;
            isPlayer.runBack=false;
            isPlayer.run=true;

        }


        if(Keyboard.isDown(Keyboard.DOWN)){
            isPlayer.idle=false;
            isPlayer.runBack=false;
            isPlayer.run=false;
            if(moving_backwards) {
                isPlayer.attackBack=true;
            } else {
                isPlayer.attack=true;
            }
        }

        if(Keyboard.isDown(Keyboard.UP)){
            isPlayer.idle=false;
            isPlayer.idleBack=false;
            isPlayer.jump=true;
            keysWait=true;
            tlJump.seek(0).play();
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


            if(!moving_backwards) isPlayer.idle=true;
            else isPlayer.idleBack=true;

            
        }
    }

}
function updateStage(){
    // console.log(imgLoaded,imageAdded);
    if(imgLoaded==imageAdded && !collided && !paused){

        
        
        showCanvas();
    

        // background 

        moveBg();

        ctxBG.clearRect(0, 0, canvas.width, canvas.height);

        for(i = 0; i<bgsImgs.length; i++) {
            ctxBG.drawImage(bgsImgs[i], bgsList[i].x, bgsList[i].y, bgsList[i].width, bgsList[i].height);
            ctxBG.drawImage(bgsImgs[i], (bgsList[i].x+bgsList[i].width), bgsList[i].y, bgsList[i].width, bgsList[i].height);
        }
        
        for(i=0; i<buildingsImgs.length; i++){
            ctxBG.drawImage(buildingsImgs[i], buildingsList[i].x, bgBuildings.y, bgBuildings.width, bgBuildings.height);
            ctxBG.drawImage(buildingsImgs[i], (buildingsList[i].x+buildingsList[i].width), bgBuildings.y, bgBuildings.width, bgBuildings.height);
        }
        
        ctxBG.drawImage(fg_img, fg.x, fg.y, fg.width, fg.height);
        ctxBG.drawImage(fg_img, (fg.x+fg.width), fg.y, fg.width, fg.height);
        ctxBG.drawImage(fg_img, (fg.x-fg.width), fg.y, fg.width, fg.height);

        

        // background overlay
        ctxOverlay.clearRect(0, 0, canvas.width, canvas.height);
        ctxOverlay.drawImage(bgOverlay_img, bgOverlay.x, bgOverlay.y, bgOverlay.width, bgOverlay.height)
        ctxOverlay.drawImage(bgOverlay_img, (bgOverlay.x+bgOverlay.width), bgOverlay.y, bgOverlay.width, bgOverlay.height)
        
        
        

        
        renderPlayer();

        
        if(!enemyIndexFlag) {
            setEnemyIndex("CyberBike");
        } else {
            if(!isEnemy.killed){
                // if(enemyKillCount==0) renderEnemy("BattleCar");
                if(enemyKillCount==0) renderEnemy("CyberBike");
                else if(enemyKillCount==1) renderEnemy("BattleCar");
                else if(enemyKillCount==2) renderEnemy("CyberBike");
                if(enemyKillCount>2) enemyKillCount=0;

                console.log(enemyKillCount);
            } else {
                ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

                setEnemyIndex("BattleCar");

                enemy[whichEnemyIndex].health=200;
                enemy[whichEnemyIndex].x=canvas.width;
                isEnemy.run=false;
                isEnemy.runBack=true;
                isEnemy.killed=false;
                enemyKillCount++;
            }
        }


        renderUI();
        

        if(nearEdge.left){
            ctxPlayer.beginPath();
            ctxPlayer.rect(0, 0, 1, canvas.height);
            ctxPlayer.fillStyle = "red";
            ctxPlayer.fill();
        } else {
            

        }
        if(nearEdge.right){
            ctxPlayer.beginPath();
            ctxPlayer.rect(canvas.width-1, 0, canvas.width, canvas.height);
            ctxPlayer.fillStyle = "red";
            ctxPlayer.fill();
        } else {
            
        }

        
        moveSpriteSheets();
        
        checkPlayerPosition();
    }
}

function moveSpriteSheets(){
    counter++;
    if(counter>999) counter=0;
    if(counter%6==0){
        sprite_x.playerX+=player.width;
        
         // if player is in middle of a jump anim:
        if(keysWait){
            if(sprite_x.playerX>=spritesheetW.playerW) {
                sprite_x.playerX=0;
                // keysWait=false;
            }
        } else {
            if(sprite_x.playerX>=spritesheetW.playerW) sprite_x.playerX=0;
        }



        sprite_x.enemyX+=enemy[whichEnemyIndex].width;
        if(sprite_x.enemyX>=spritesheetW.enemyW) sprite_x.enemyX=0;
        

        if(isEnemy.exploding){
            sprite_x.explosionX+=(96);
            if(sprite_x.explosionX>=spritesheetW.explosionW) {
                // only play this anim once!
                isEnemy.exploding=false;
                isEnemy.killed=true;
                sprite_x.explosionX=0;
            }
        }
        
    }
    if(counter%2==0){
        sprite_x.shootX+=player.width;
        if(sprite_x.shootX>=spritesheetW.shootW) sprite_x.shootX=0;
    }
}

function renderUI() {
    ctxPlayer.beginPath();
    ctxPlayer.rect(10, 10, 70, 10);
    ctxPlayer.fillStyle = "#fff";
    ctxPlayer.fill();

    ctxPlayer.beginPath();
    var healthBarW=Math.floor((health/1000)*68);

    ctxPlayer.rect(11, 11, healthBarW, 8);
    if(isPlayer.hurt) {
        ctxPlayer.fillStyle = "red";
    } else {
        ctxPlayer.fillStyle = "green";
    }
    ctxPlayer.fill();
}



function renderPlayer() {
    ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);

    // [todo] - movingbackwards:
    
    if(!moving_backwards){
        player.hitX=0;
        // ctxPlayer.beginPath();
        //     ctxPlayer.rect(player.x+player.hitX, player.y+player.hitY, player.hitW, player.hitH);
        //     ctxPlayer.fillStyle = "blue";
        //     ctxPlayer.fill();
    } else {
        player.hitX=-16;
        // ctxPlayer.beginPath();
        //     ctxPlayer.rect(player.x-player.hitX, player.y+player.hitY, player.hitW, player.hitH);
        //     ctxPlayer.fillStyle = "blue";
        //     ctxPlayer.fill();
    }

    
    if(isPlayer.run){
        player.x+=2;
    } 
    if(isPlayer.runBack){
        player.x-=2;

        // if(player.x>=-26) { player.x-=5; }
    }

    if(isPlayer.hurt){ 

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
            spritesheetW.shootW=shoot.width;
            ctxPlayer.drawImage(shoot_img, sprite_x.shootX, 0,
                player.width, player.height,
                player.x+player.width-shoot.offsetX, player.y-shoot.offsetY, 
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
            spritesheetW.shootW=shoot.width;
            ctxPlayer.drawImage(shootBack_img, sprite_x.shootX, 0,
                player.width, player.height,
                player.x+player.width-shootBack.offsetX, player.y-shootBack.offsetY, 
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

function checkPlayerPosition() {
    if(player.x>(canvas.width-150+(player.width/2))){
        nearEdge.right=true;
    } else {
        nearEdge.right=false;
    }

    if((player.x<=0)){
        nearEdge.left=true;
    } else {
        nearEdge.left=false;
    }

    if(player.x>(canvas.width-player.width)){
        player.x=(canvas.width-player.width);
    }

    if((player.x<=0)){
        player.x=0;
    }

 



// collisions:

    
    var playerR = player.x+player.hitW;
    var playerL = player.x+player.hitX;
    var playerT = player.y+player.hitY;
    var playerB = player.y+player.hitH;


    var enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitX;
    if(isEnemy.runBack) { enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB; }
    var enemyR = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitW;
    var enemyT = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY;
    var enemyB = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitH;
    
    if(playerR>=enemyL 
        && playerL<=enemyR
         && playerT>=enemyT 
         && !isEnemy.killed){

        // colliding! 
        isPlayer.hurt=true;
        health--;
        health = health < 0 ? 0 : health;
        if(health==0) collided=true;
    } else {
        isPlayer.hurt=false;
    }


    // if enemy is being hit by shoot:
    if(isPlayer.attack) {
        if(playerR<enemyL 
         && playerT>=enemyT){
            isEnemy.hurt=true;
            enemy[whichEnemyIndex].health--;
            enemy[whichEnemyIndex].health = enemy[whichEnemyIndex].health < 0 ? 0 : enemy[whichEnemyIndex].health;
            if(enemy[whichEnemyIndex].health==0) {
                killEnemy("CyberBike");
            }
        } else {
            isEnemy.hurt=false;
        }

    } else if(isPlayer.attackBack) {
        if(playerL>enemyR 
         && playerT>=enemyT){
            isEnemy.hurt=true;
            enemy[whichEnemyIndex].health--;
            enemy[whichEnemyIndex].health = enemy[whichEnemyIndex].health < 0 ? 0 : enemy[whichEnemyIndex].health;
            if(enemy[whichEnemyIndex].health==0) {
                killEnemy("CyberBike");
            }
        } else {
            isEnemy.hurt=false;
        }
    } else {
        isEnemy.hurt=false;
    }

    // enemy repeat 
    if(!isEnemy.killed){
        
        if(enemy[whichEnemyIndex].x<=-97){
            isEnemy.runBack=false;
            isEnemy.run=true;
        }
        if(enemy[whichEnemyIndex].x>canvas.width){
            isEnemy.runBack=true;
            isEnemy.run=false;
        }
    }
}

var moveFactor_enemy = 1;
var whichEnemyIndex=0;
function renderEnemy(whichEnemy) {
    
    ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

    if(isEnemy.killed){
        return;
    }

    

    if(!isEnemy.runBack){
        ctxEnemy.beginPath();
            ctxEnemy.rect(enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitX, enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY, enemy[whichEnemyIndex].hitW, enemy[whichEnemyIndex].hitH);
            ctxEnemy.fillStyle = "blue";
            ctxEnemy.fill();
    } else {

        ctxEnemy.beginPath();
            ctxEnemy.rect(enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB, enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY, enemy[whichEnemyIndex].hitW, enemy[whichEnemyIndex].hitH);
            ctxEnemy.fillStyle = "blue";
            ctxEnemy.fill();
    }

    if(isEnemy.runBack){
        enemy[whichEnemyIndex].x-=moveFactor_enemy; 

        if(isPlayer.run) {
            enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=moveFactor_enemy;  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/1.5;  
            if(isPlayer.runBack) {
                enemy[whichEnemyIndex].x+=moveFactor_enemy/3;  
            }
        }
        

        if(!isEnemy.exploding){
            if(!isEnemy.hurt){
                spritesheetW.enemyW=enemiesList[whichEnemyIndex][3].width;
                ctxEnemy.drawImage(enemyImgs[enemyImgIndex.walkBack], sprite_x.enemyX, 0,
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height,
                    enemy[whichEnemyIndex].x, enemy[whichEnemyIndex].y, 
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height);
            } else {
                spritesheetW.enemyW=enemiesList[whichEnemyIndex][7].width;
                ctxEnemy.drawImage(enemyImgs[enemyImgIndex.hurtBack], sprite_x.enemyX, 0,
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height,
                    enemy[whichEnemyIndex].x, enemy[whichEnemyIndex].y, 
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height);
            }
        }
    }
    
    if(isEnemy.run){
        enemy[whichEnemyIndex].x+=moveFactor_enemy/3; 

        if(isPlayer.run) {
            if(nearEdge.right){
                enemy[whichEnemyIndex].x-=(moveFactor_enemy*1.5);  
            }
        }
        if(moving_backwards) {

            enemy[whichEnemyIndex].x+=moveFactor_enemy/2; 
            if(isPlayer.runBack) {
                enemy[whichEnemyIndex].x+=moveFactor_enemy;  
            }
        }

        if(!isEnemy.exploding){
            if(!isEnemy.hurt){
                spritesheetW.enemyW=enemiesList[whichEnemyIndex][2].width;
                ctxEnemy.drawImage(enemyImgs[enemyImgIndex.walk], sprite_x.enemyX, 0,
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height,
                    enemy[whichEnemyIndex].x, enemy[whichEnemyIndex].y, 
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height);
            } else {
                spritesheetW.enemyW=enemiesList[whichEnemyIndex][6].width;
                ctxEnemy.drawImage(enemyImgs[enemyImgIndex.hurt], sprite_x.enemyX, 0,
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height,
                    enemy[whichEnemyIndex].x, enemy[whichEnemyIndex].y, 
                    enemy[whichEnemyIndex].width, enemy[whichEnemyIndex].height);
            }
        }
    }



    // [todo] draw enemy health
    var enemyBarX = enemy[whichEnemyIndex].x+10;
    var enemyBarY = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY-25;
    var enemyBarW = enemy[whichEnemyIndex].width-56;
    if(isEnemy.runBack){
        enemyBarX = enemy .x+enemy[whichEnemyIndex].hitXB+10;
        enemyBarY = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY-25;
        enemyBarW = enemy[whichEnemyIndex].width-enemy[whichEnemyIndex].hitXB-20;
    }

    if(!isEnemy.exploding){

        ctxEnemy.beginPath();
        ctxEnemy.rect(enemyBarX, enemyBarY, enemyBarW, 5);
        ctxEnemy.fillStyle = "rgba(255,255,255,0.5)";
        ctxEnemy.fill();

        var enemyhealthBarW=Math.floor((enemy[whichEnemyIndex].health/200)*enemyBarW);


        ctxEnemy.beginPath();
        ctxEnemy.rect(enemyBarX+1, enemyBarY+1, enemyhealthBarW, 3);
        if(isEnemy.hurt) {
            ctxEnemy.fillStyle = "rgba(255,0,0,0.7)";
        } else {
            ctxEnemy.fillStyle = "rgba(0,255,0,0.5)";
        }
        ctxEnemy.fill();
    }


    if(isEnemy.exploding){
        // play explosion!
        spritesheetW.explosionW=explosion.width;
        ctxEnemy.drawImage(explosion_img, sprite_x.explosionX, 0,
            96, 96,
            enemy[whichEnemyIndex].x-explosion.offsetX, enemy[whichEnemyIndex].y-explosion.offsetY, 
            96, 96);
    }
}

var enemyIndexFlag = false;
function setEnemyIndex(whichEnemy){

    enemyIndexFlag=true;
    enemyImgIndex = {walkBack:0, hurtBack:0}


    // set index
    if(whichEnemy=="BattleCar") {whichEnemyIndex=1}
    else {whichEnemyIndex=0}




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
    }
}

function killEnemy(whichEnemy){
    isEnemy.exploding=true;
}

var moveFactor = .5;
var x_moveAmount_fg = 1.15;
function moveBg(){
    
    if(!moving_backwards){
        if(isPlayer.run){
            moveFactor = 1;
            if(nearEdge.right) {
                moveFactor = 1.5;
            }
        } else {moveFactor = .5;}

        bgOverlay.x=bgOverlay.x-(moveFactor);

        for(i=bgsList.length-1; i>0; i--){
            bgsList[i].x=bgsList[i].x-((moveFactor*i)*.1);

            if(bgsList[i].x<-canvas.width) bgsList[i].x = 0;
        }

        for(i=0; i<buildingsImgs.length; i++) {
            buildingsList[i].x=buildingsList[i].x-(moveFactor);
            if(buildingsList[i].x<-((bgBuildings.width*buildingsImgs.length)-canvas.width)) buildingsList[i].x = canvas.width;
        }

        fg.x=fg.x-(moveFactor*x_moveAmount_fg);
        
    } else if(moving_backwards){
        
        if(isPlayer.runBack){
            moveFactor = 1;
        } else {moveFactor = .5;}
    
        bgOverlay.x=bgOverlay.x-(moveFactor);

        for(i=bgsList.length-1; i>0; i--){
            bgsList[i].x=bgsList[i].x+((moveFactor*i)*.1);
        }

        for(i=0; i<buildingsImgs.length; i++) {
            if(buildingsList[0].x<bgBuildings.width){
                buildingsList[i].x=buildingsList[i].x+(moveFactor);
            }


        }

        fg.x=fg.x+(moveFactor*x_moveAmount_fg);
    }

    if(bgOverlay.x<-bgOverlay.width) bgOverlay.x = 0;
    if(bgOverlay.x>bgOverlay.width) bgOverlay.x = canvas.width;
    
    if(fg.x<-(canvas.width*2)) fg.x = 0;
    if(fg.x>fg.width) {
        //[todo] dont go back
        collided=true;
    }

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




function mobileBtnDoNothing(ev){
    if(ev.cancelable) {
        ev.preventDefault();
    }
}


function showCanvas(){
    document.getElementById("loadingContent").style.display="none";
    container.style.display = "block";
}




/*///////////////////////  ////////////////////////////////*/
/*/////////////////////// FULL WIDTH ////////////////////////////////*/
/*///////////////////////  ////////////////////////////////*/
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