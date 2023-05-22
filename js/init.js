

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
    container.style.display = "block";

    gsap.to("#introContainer",0,{alpha:1});
    gsap.to("#intro_txt",0,{alpha:1})


    initCanvasAnim();

    //
    showGame();
    gsap.to(footer,0,{display:"block",alpha:1});

    // once intro is played bind these start buttons!
    container.addEventListener('click', playIntro);
    mobileControls.addEventListener('touchend', playIntro);;
    // show
}


function playIntro() {

var introTL = gsap.timeline({paused:true});
    
introTL.addLabel("reset", 0)
    .to("#container", 0, {className:"noMouse"}, "reset")
    .to("#intro_txt",0,{alpha:0}, "reset")
    .to("#intro_txt",0,{className:"txt intro-played"}, "reset")
    .to(".game-canvas",{className:"game-canvas"},"reset")
    .to(["#bgOverlay-canvas","#bg-canvas"],{className:""},"reset")

    .to("#intro-primitai",1,{alpha:1}, ">")
    .to("#intro-primitai-bg",0,{y:0}, ">")
    .to("#intro-primitai-bg",3.5,{y:"-39%",ease:"linear"}, ">")
    .to("#intro-presents",0,{alpha:1}, "<1.5")
    .to("#intro-primitai",0,{alpha:0}, "reset+=5")
    
    .to("#intro-licensed-by",0,{alpha:1}, ">.2")
    .to("#intro-roar",0,{alpha:1,clip:"rect(168px, 296px, 170px, 290px)"}, ">")
    .to("#intro-roar",1,{clip:"rect(168px, 576px, 170px, 0px)",ease:"expo.in"}, ">")
    .to("#intro-roar",1,{clip:"rect(0px, 576px, 490px, 0px)",ease:"sine.in"}, ">.2")

.addLabel("city", ">1")
    .to(["#intro-licensed-by","#intro-roar","#intro-primitai"],0,{alpha:0}, "city")
    .to("#intro-city",0,{alpha:1}, "city")    
    .to("#intro-city-txt1", 0, {alpha:1}, "city")
    .call(typeText,[intro_city_txt1,2,0], ">")
    .to("#intro-city-02",0,{y:60}, "city")    
    .to(["#intro-city-01","#intro-city-02"],2,{alpha:1}, "city+=1")

    .to("#intro-city-02",6,{y:0, ease:"linear"}, "city+=3")
    .to("#intro-city-txt1", 1, {alpha:0}, "city+=4")

    .to("#intro-city-txt2", 0, {alpha:1}, "city+=4")
    .call(typeText,[intro_city_txt2,2,0], "city+=3")
    .to("#intro-city-txt2", 1, {alpha:0}, "city+=6")
    .to("#intro-city",1,{alpha:0}, "city+=8")    


.addLabel("lockup", ">")
    
    .to("#intro-shredded",12,{x:-20,ease:"linear"},"lockup")
    .to("#intro-beheaded",12,{x:20,ease:"linear"},"lockup")
    .to("#intro-bg",12,{scale:1.1,ease:"linear",transformOrigin:"center bottom"},"lockup")
    .to(["#introContainer","#intro-player","#intro-bg"],0,{alpha:1},"lockup")
    .to("#intro-shredded",0,{alpha:1},">.4")
    .to("#intro-and",0,{alpha:1},">.4")
    .to("#intro-beheaded",0,{alpha:1},">.4")
    .to("#intro-car",0,{alpha:1,x:300},"<")
    .to("#intro-car",.6,{x:0},">")
    .to("#intro-beheaded",0,{alpha:1},">.4")
    .to("#intro_txt",0,{alpha:1},">")
    .to("#container",0,{className:""},">");


    introTL.play();

    playMusic(audio_music);

    container.removeEventListener('click', playIntro);
    mobileControls.removeEventListener('touchend', playIntro);;

    container.addEventListener('click', bindButtons);
    window.addEventListener('keydown', bindButtons);
    mobileControls.addEventListener('touchend', bindButtons);;
}
