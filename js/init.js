

function init()
{
    console.log("init");

    // querystr overrides:
    if(window.location.search.includes("devTools")){
        devTools=true;
        log("devTools");
    }
    if(window.location.search.includes("frameRate")){
        frameRate=window.location.search.split("frameRate=")[1];
        frameRate_txt.value=frameRate;
        devTools=true;
    }
    if(window.location.search.includes("highlights")){
        highlights=true;
        devTools=true;
    }
    if(window.location.search.includes("mute")){
        muted=true;
        devTools=true;
    }
    if(window.location.search.includes("noEnemies")){
        noEnemiesOverride=true;
        devTools=true;
    }
    if(window.location.search.includes("invincible")){
        isPlayer.invincible=true;
        invincibleOverride=true;
        devTools=true;
    }
    if(window.location.search.includes("zoom")){
        zoomIn=true;
        devTools=true;
        if(window.location.search.split.length>0){
            zoomSpeed=Number(window.location.search.split("zoom=")[1]);
        }
    }
    if(devTools){
        setupDevTools();
    }



    // main content
    wrap = document.getElementById("wrap");
    container = document.getElementById("container");
    footer = document.getElementById("footer");

    intro_city_txt1 = document.getElementById("intro-city-txt1");
    intro_city_txt2 = document.getElementById("intro-city-txt2");
    
    
    resizeWindow();

    $( window ).resize(resizeWindow);


    if ('ontouchstart' in document.documentElement) {
        wrap.classList.add("mobile");
        mobile=true;
    } else {
        wrap.classList.remove("mobile");
        mobile=false;
    }


    $(document).on('show.visibility', function() {
        // if(!paused) {
        //     gamePause();
        // }
    });
    $(document).on('hide.visibility', function() {
        if(!paused && !intro) {
            gamePause();
        }
    });

    
    initAudio();
    // start();
}



// called from audio.js once audios loaded:
function start(){
    document.getElementById("loadingContent").style.display="none";
    
    gsap.to([container,wrap,footer],{display:"block"});

    if(mobile){
        gsap.to("#mobileControls",0,{alpha:0});
    }

    gsap.to(["#intro_txt","#introContainer","#screen",footer],0,{alpha:1})


    initCanvasAnim();

    showGame();

    // once intro is played bind these start buttons!
    wrap.addEventListener('click', playIntro);
    mobileControls.addEventListener('touchend', playIntro);;
    window.addEventListener('keydown', playIntro);
    // show
}

var introTL = gsap.timeline({paused:true,defaults:{duration:0,ease:"none"},oncComplete:function(){
    container.addEventListener('click', bindButtons);
    window.addEventListener('keydown', bindButtons);
    mobileControls.addEventListener('touchend', bindButtons);

}});
function playIntro() {
    var introLogoWidth = document.getElementById("intro-primitai-logo").offsetWidth;

    var splitIntroTxtDir = new SplitText("#intro-text-dir", {type:"lines",linesClass:"intro-text-dir-lines"});
    gsap.set(splitIntroTxtDir.lines, {alpha:0});
        

    // console.log(introLogoWidth);
    introTL.addLabel("reset", 0)

        .to("#container", {className:"noMouse"}, "reset")
        .to("#intro-primitai",{width:introLogoWidth+"px"},"reset")
        .to("#intro_txt",{display:"none"}, "reset")
        .to(".game-canvas",{className:"game-canvas"},"reset")
        .to(["#bgOverlay-canvas","#bg-canvas"],{className:"hidden"},"reset")

    .addLabel("intro-screen", ">")
        .call(typeCodes,["intro_screen_txt",2], "intro-screen")

        .to("#intro-text-dir", {alpha:1}, ">")
        .to(".intro-text-dir-lines", {alpha:1,stagger:0.03},">1")
        .to("#intro-text", {alpha:0,y:100},"<")
        .call(clearCode,[],">")
        .to("#intro-text", {alpha:1},"<.5")
        .call(typeCodes,["intro_screen_txt2",2],"<1")
        .to("#intro-text", {alpha:0,y:0},"<2")
        .to("#intro-text-dir", {alpha:0},"<")
        .call(clearCode,[],">")

    .addLabel("intro-primitai", ">.1")
        .to("#glitch",{display:"none"}, "intro-primitai")
        .call(playMusic, [audio_music], "intro-primitai")
        .to("#intro-text-playing", {alpha:1},"intro-primitai")
        .to("#intro-text", {alpha:1,y:20},"intro-primitai")

        .to("#intro-primitai", 1,{alpha:1}, "intro-primitai")
        .to("#intro-primitai-bg", {y:0}, ">")
        .to("#intro-primitai-bg",3.5,{y:"-39%",ease:"linear"}, ">")
        .to("#intro-presents", {alpha:1}, "<1.5")
        .to("#intro-primitai", {alpha:0}, "intro-primitai+=5")

    .addLabel("intro-licensed-by", ">.2")
        .to("#intro-licensed-by", {alpha:1}, "intro-licensed-by")
        .to("#intro-roar", {alpha:1,clip:"rect(168px, 296px, 170px, 290px)"}, ">")
        .to("#intro-roar",1,{clip:"rect(168px, 576px, 170px, 0px)",ease:"expo.in"}, ">")
        .to("#intro-roar",1,{clip:"rect(0px, 576px, 490px, 0px)",ease:"sine.in"}, ">.2")

    .addLabel("city", ">1")
        .to(["#intro-licensed-by","#intro-roar","#intro-primitai"],0,{alpha:0}, "city")
        .to("#intro-city" ,{alpha:1}, "city")    
        .to("#intro-city-txt1", {alpha:1}, "city")
        .call(typeText,[intro_city_txt1,2,0], "city")
        .to("#intro-city-02" ,{y:30}, "city")    
        .to("#intro-city-03" ,{y:60}, "city")    
        .to(["#intro-city-cover"] ,{alpha:1}, "city")
        .to(["#intro-city-01","#intro-city-02","#intro-city-03"],0,{alpha:1}, "city+=1")
        .to(["#intro-city-cover"],3,{alpha:0,ease:"linear"}, "city+=1")
        .to("#intro-city-02",6,{y:0, ease:"linear"}, "city+=3")
        .to("#intro-city-03",6,{y:0, ease:"linear"}, "city+=3")
        .to("#intro-city-txt1", 1, {alpha:0}, "city+=4")
        .to("#intro-city-txt2", {alpha:1}, "city+=4")
    .addLabel("city2", "city+=3")
        .call(typeText,[intro_city_txt2,2,0], "city2")
        .to("#intro-city-txt2", 1, {alpha:0}, "city2+=3")
        .to("#intro-city",1,{alpha:0}, "city2+=4")    


    .addLabel("lockup", ">")
        .to(["#introContainer"], {alpha:1},"lockup")

        .to(["#intro-shredded"], {scale:0.01,ease:"linear"},"lockup")
        


        .to("#intro-shredded",.05,{alpha:1},">.4")
        .to("#intro-shredded",.3,{scale:1.1,ease:"expo.out"},"<")
        
        .to(["#intro-shredded"],.5,{scale:1,ease:"back.out"},">")
        .to("#intro-bg",.5,{alpha:1},"<")


        .call(clearCode,[],">")
        .to("#intro-text-playing", {alpha:0},">")
        .to("#intro-text", {alpha:1,y:0},">")
        .call(typeCodes,["intro_screen_txt3",2], ">")

        .to("#intro-bg",12,{scale:1.1,ease:"linear",transformOrigin:"center bottom"},"<")
        .to(["#intro-player-walk"], {alpha:1},"<")
        .call(introPlayerWalk,[],"<")
        .to("#container", {className:""},">")

    .addLabel("complete", ">")
        .call(function(){
            container.addEventListener('click', bindButtons);
            window.addEventListener('keydown', bindButtons);
            mobileControls.addEventListener('touchend', bindButtons);
        }, "complete");


    introTL.play();

    wrap.removeEventListener('click', playIntro);
    mobileControls.removeEventListener('touchend', playIntro);
    window.removeEventListener('keydown', playIntro);

    wrap.addEventListener('click', introSkip);
    window.addEventListener('keydown', introSkip);
    mobileControls.addEventListener('touchend', introSkip);
}

var introWalk = {x:-100,spriteX:0}
var introWalk_canvas = document.getElementById('intro-player-walk');
introWalk_canvas.width=576;
introWalk_canvas.height=320;
var ctxIntroWalk = introWalk_canvas.getContext('2d');



function introPlayerWalk(){
    createjs.Ticker.addEventListener("tick", animateWalking);
    createjs.Ticker.framerate = 10;
}

function animateWalking(){
    ctxIntroWalk.clearRect(0, 0, canvas.width, canvas.height);
    ctxIntroWalk.drawImage(introWalk_img, introWalk.spriteX, 0, 134, 134, introWalk.x, 180, 134, 134);
    introWalk.spriteX-=134;
    if(introWalk.spriteX<=0){introWalk.spriteX=806-134}

    introWalk.x+=8;
    if(introWalk.x>80){
        createjs.Ticker.removeEventListener("tick", animateWalking);
        gsap.to("#intro-player-walk",0,{alpha:0});
        gsap.to("#intro-player",0,{alpha:1});
    }
}

function introSkip(){
    // console.log("nextLabel: "+introTL.nextLabel());
    if(introTL.nextLabel()!="complete" && introTL.nextLabel()!=undefined){

        introTL.seek(introTL.nextLabel());

    } else if(introTL.nextLabel()=="complete"){ 

        wrap.removeEventListener('click', introSkip);
        window.removeEventListener('keydown', introSkip);
        mobileControls.removeEventListener('touchend', introSkip);
        
        wrap.addEventListener('click', bindButtons);
        window.addEventListener('keydown', bindButtons);
        mobileControls.addEventListener('touchend', bindButtons);

    } else {

        clearCode();
        
        gsap.to("#intro-text-playing",0,{alpha:0});
        gsap.to("#intro-text",0,{y:0});
        // console.log("nextLabel undefined");
        wrap.removeEventListener('click', introSkip);
        window.removeEventListener('keydown', introSkip);
        mobileControls.removeEventListener('touchend', introSkip);

        bindButtons();
    }
}