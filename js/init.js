

function init()
{
    console.log("init");

    // querystr overrides:
    if(window.location.search.includes("devTools")){
        devTools=true;
        console.log("devTools");
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
        noEnemies=true;
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
    initCanvasAnim();
}
