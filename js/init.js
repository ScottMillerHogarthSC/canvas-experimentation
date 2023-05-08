

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
        if(!paused) {
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

    var introTL = gsap.timeline();
    introTL
        .to("#intro-shredded",12,{x:-20,ease:"linear"},0)
        .to("#intro-beheaded",12,{x:20,ease:"linear"},0)
        .to("#intro-bg",12,{scale:1.1,ease:"linear",transformOrigin:"center bottom"},0)
        .to("#introContainer",0,{alpha:1},0)
        .to("#intro-shredded",0,{alpha:1},">.4")
        .to("#intro-and",0,{alpha:1},">.4")
        .to("#intro-beheaded",0,{alpha:1},">.4")
        .to("#intro-car",0,{alpha:1},"<")
        .from("#intro-car",.6,{x:300},"<")
        .to("#intro-beheaded",0,{alpha:1},">.4")
        .to("#intro_txt",0,{alpha:1},1.5)

    initCanvasAnim();
    // show
}
