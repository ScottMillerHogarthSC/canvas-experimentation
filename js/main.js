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

var full_health = 1000;



var nearEdge = {left:false,right:false}

var sprite_x = {playerX:0, enemyX:0, shootX:0, explosionX:0};

var spritesheetW = {playerW: player_idle.width, enemyW:enemiesList[0][0].width, shootW:player_shoot.width, explosionW:explosion.width }; // sprites width

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

        tlJump.to(player,.9,{y:player_groundY-player.jumpH,ease:"power3.out"},0).to(player,.8,{y:player_groundY,ease:"sine.in"},"<.7")
        tlJump.duration(.6);

}


function checkKeyPress(e){
    if(e.code == "Space" && !paused && !isPlayer.dead) {
        paused=true;
        gsap.to(["#paused","#overlay-bg"],0,{display:"block"})
        gsap.to("#paused",.2,{alpha:1})
        gsap.to("#overlay-bg",1,{alpha:1})

        audio.pause();
        
    } else {
        paused=false;
        gsap.to(["#paused","#overlay-bg"],0,{alpha:0,display:"none"})

        audio.play();
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
            backwards();
        }
        else if (Keyboard.isDown(Keyboard.RIGHT)) { 
            forwards();
        }


        if(Keyboard.isDown(Keyboard.DOWN)){
            shoot();
        }

        if(Keyboard.isDown(Keyboard.UP)){
            jump();
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

function jump() {
    isPlayer.idle=false;
    isPlayer.idleBack=false;
    isPlayer.jump=true;
    keysWait=true;
    tlJump.seek(0).play();
}

function shoot(){
    isPlayer.idle=false;
    isPlayer.runBack=false;
    isPlayer.run=false;
    if(moving_backwards) {
        isPlayer.attackBack=true;
    } else {
        isPlayer.attack=true;
    }
}

function forwards(){
    moving_backwards = false;

    isPlayer.idle=false;
    isPlayer.runBack=false;
    isPlayer.run=true;
}
function backwards() {
    moving_backwards = true;

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
        }
        
        

        
        renderPlayer();

        
        if(!enemyIndexFlag) {
            setEnemyIndex();
        } else {
            if(!isEnemy.killed){
                
                renderEnemy();
                
            } else {
                ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);

                setEnemyIndex();

                // [todo] next enemy:

                enemy[whichEnemyIndex].health=200;
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
        

        if(isPlayer.dead){
            if(!moving_backwards) sprite_x.playerX+=player.width;
            else {
                //[todo] - stop player when backwards:
                // sprite_x.playerX-=player.width;
            }

            if(sprite_x.playerX>=spritesheetW.playerW || sprite_x.playerX<=0) {
                // only play this anim once!
                collided=true;
                gsap.to(["#overlay-death","#died"],0,{display:"block"})
                gsap.to("#died",.2,{alpha:1})
                gsap.to("#overlay-death",1,{alpha:1})
            }   
        } else {
            sprite_x.playerX+=player.width;
        }

        
         // if player is in middle of a jump anim:
        if(keysWait){
            if(sprite_x.playerX>=spritesheetW.playerW) {
                sprite_x.playerX=0;
                // keysWait=false;
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

        // console.log("sprite_x.enemyX: "+sprite_x.enemyX)
        

        if(isEnemy.exploding){
            sprite_x.explosionX+=(96);
            if(sprite_x.explosionX>=spritesheetW.explosionW) {
                // only play this anim once!
                isEnemy.exploding=false;
                isEnemy.killed=true;
                sprite_x.explosionX=0;
                
                enemyKillCount++;

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
    var healthBarW=Math.floor((player.health/full_health)*68);

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
    if(moving_backwards) { playerL = player.x+player.hitXB; }
    var playerT = player.y+player.hitY;
    var playerB = player.y+player.hitH;
    var playerH = player.hitH;


    var enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitX;
    if(isEnemy.runBack) { enemyL = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB; }
    var enemyR = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitW;
    var enemyT = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY;
    var enemyB = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitH;
    var enemyH = enemy[whichEnemyIndex].hitH;


    
    // [todo] enemy hit area
        // ctxEnemy.beginPath();
        // ctxEnemy.rect(enemyL, enemyT, enemy[whichEnemyIndex].hitW, enemy[whichEnemyIndex].hitH);
        // ctxEnemy.fillStyle = "rgba(255,0,0,0.5)";
        // ctxEnemy.fill();

    // [todo] player hit area
        // ctxEnemy.beginPath();
        // ctxEnemy.rect(playerL, playerT, player.hitW, player.hitH);
        // ctxEnemy.fillStyle = "rgba(0,255,0,0.5)";
        // ctxEnemy.fill();

    if(!isEnemy.killed 
        && playerL < enemyL + enemy[whichEnemyIndex].hitW
        && playerL + player.hitW > enemyL
        && playerT < enemyT + enemy[whichEnemyIndex].hitH
        && playerT + player.hitH > enemyT ){

        // colliding! 
        isPlayer.hurt=true;
        player.health--;
        player.health = player.health < 0 ? 0 : player.health;
        if(player.health==0) { 

            playerDeath();
        }
    } else {

        isPlayer.hurt=false;
    }


    // if enemy is being hit by shoot:
    if(isPlayer.attack) {
        if(playerR<enemyL 
         && playerT>=enemyT){
            if(isEnemy.run) isEnemy.hurt=true;
            else if(isEnemy.runBack) isEnemy.hurtBack=true;
            
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
         && playerT>=enemyT){
            if(isEnemy.run) isEnemy.hurt=true;
            else if(isEnemy.runBack) isEnemy.hurtBack=true;

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

    // enemy repeat 
    if(!isEnemy.killed && !isEnemy.attack){
        

         // [todo] - enemy turns to you and attack
        if(enemy[whichEnemyIndex].x<=player.x-(enemy[whichEnemyIndex].width*2)){


            if(isEnemy.run && enemy[whichEnemyIndex].x<=-((enemy[whichEnemyIndex].width*2)+1)) {
                enemy[whichEnemyIndex].x=canvas.width;
                isEnemy.runBack=true;
                isEnemy.run=false;
    
            } else {
                
                isEnemy.runBack=false;
                isEnemy.run=true;
            
            }
        }
        if(enemy[whichEnemyIndex].x>canvas.width){
            isEnemy.runBack=true;
            isEnemy.run=false;
        }
    }
}


    
var moveFactor_enemy = 1;
var whichEnemyIndex=0;
var startedAttack = false;
function renderEnemy(whichEnemy) {
    
    

    if(isEnemy.killed){
        ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
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

    } else {



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

                enemy[whichEnemyIndex].x+=moveFactor_enemy/1.5;  
                if(isPlayer.runBack) {
                    enemy[whichEnemyIndex].x+=moveFactor_enemy/3;  
                }
            }
        } else if(isEnemy.run){
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



        // [todo] draw enemy health
        var enemyBarX = enemy[whichEnemyIndex].x+10;
        var enemyBarY = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY-25;
        var enemyBarW = enemy[whichEnemyIndex].width-56;
        if(isEnemy.runBack){
            enemyBarX = enemy[whichEnemyIndex].x+enemy[whichEnemyIndex].hitXB+10;
            enemyBarY = enemy[whichEnemyIndex].y+enemy[whichEnemyIndex].hitY-25;
            enemyBarW = enemy[whichEnemyIndex].width-enemy[whichEnemyIndex].hitXB-20;
        }

    

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
}

function killEnemy(whichEnemy){
    isEnemy.exploding=true;
}


var onlyDieOnce = false;
function playerDeath(){
    if(!onlyDieOnce) {

        spritesheetW.playerW=player_dead.width;

        if(!moving_backwards) sprite_x.playerX=0;
        else sprite_x.playerX=(spritesheetW.playerW);
        onlyDieOnce=true;
        isPlayer.dead=true;
    }
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

var canvasShowing=false;
function showCanvas(){
    document.getElementById("loadingContent").style.display="none";
    container.style.display = "block";
    canvasShowing=true;
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