

function init()
{
    console.log("init");

    // querystr overrides:
    if(window.location.search.includes("frameRate")){
        
        frameRate=window.location.search.split("frameRate=")[1];
    }
    if(window.location.search.includes("highlights")){
        highlights=true;
    }
    if(window.location.search.includes("mute")){
        muted=true;
    }
    if(window.location.search.includes("noEnemies")){
        noEnemies=true;
    }
    if(window.location.search.includes("zoom")){
        zoomIn=true;
        if(window.location.search.split.length>0){
            zoomSpeed=Number(window.location.search.split("zoom=")[1]);
        }
    }



    // main content
    wrap = document.getElementById("wrap");
    container = document.getElementById("container");
    audio = document.getElementById("audio");

    
    resizeWindow();

    $( window ).resize(resizeWindow);


    if ('ontouchstart' in document.documentElement) {
        wrap.classList.add("mobile");
    } else {
        wrap.classList.remove("mobile");
    }


    // if (audio.canPlayType('audio/ogg')) {
    //     audio.setAttribute('src','01_stars_are_my_guide.ogg');

    if (audio.canPlayType('audio/mpeg')) {
        
        if(window.location.href.includes("scottmillerhogarthsc")){
            console.log("online");
            audio.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
        } else {
            console.log("local")
            audio.setAttribute('src','shredded-midi.mp3');
        }
    } 
    else {
        console.log("browser doesnt support audio");
        noAudio=true;
    }


    if (audio.readyState > 3) {
        loadedAudio();
    } else {
        preloadAudio(); 
    }

    // start();
}

function preloadAudio(){
    console.log("preloadAudio");

    audio.addEventListener('canplay', loadedAudio);
    audio.addEventListener('error', failedtoLoadAudio);

    audio.load(); 
}

function failedtoLoadAudio(e){
    console.log("COULD NOT LOAD AUDIO");
    noAudio=true;
    start();
}

var audioLoaded = false;
var isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;;
function loadedAudio(){
    if(!audioLoaded){
        audioLoaded = true;

        isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;
    
        audio.removeEventListener('canplay', loadedAudio);
        audio.addEventListener('error', failedtoLoadAudio);
        
        if(muted) { audio.volume=0; }
    
        $(document).on('show.visibility', function() {
            if(!isPlayingAudio) audio.play();
        });
        $(document).on('hide.visibility', function() {
            if(isPlayingAudio) audio.pause();
        });
        
        

        start();
    }
}

function start(){
    initCanvasAnim();

    
    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

    document.body.addEventListener('keypress', checkKeyPress);
}
