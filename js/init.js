

function init()
{
    console.log("init");

    // querystr overrides:
    if(window.location.search.includes("devTools")){
        devTools=true;
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
    audio = document.getElementById("audio");
    audio_shoot = document.getElementById("audio-shoot");

    
    resizeWindow();

    $( window ).resize(resizeWindow);


    if ('ontouchstart' in document.documentElement) {
        wrap.classList.add("mobile");
        mobile=true;
    } else {
        wrap.classList.remove("mobile");
        mobile=false;
    }


    // if (audio.canPlayType('audio/ogg')) {
    //     audio.setAttribute('src','01_stars_are_my_guide.ogg');

    if (audio.canPlayType('audio/mpeg')) {
        
        if(window.location.href.includes("scottmillerhogarthsc")){
            console.log("online");
            audio.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
            audio_shoot.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shoot.mp3');

            //[todo] - set shoot audio on web storage

        } else {
            console.log("local");
            audio.setAttribute('src','audio/shredded-midi.mp3');
            audio_shoot.setAttribute('src','audio/shoot.mp3');
        }
        audio_shoot.volume=.4;
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
var audiosToLoad=0;
function preloadAudio(){
    console.log("preloadAudio");

    audio.addEventListener('canplay', loadedAudio);
    audio.addEventListener('error', failedtoLoadAudio);

    audio.load(); 

    audiosToLoad++;

    audio_shoot.addEventListener('canplay', loadedAudio);
    audio_shoot.addEventListener('error', failedtoLoadAudio);

    audio_shoot.load(); 

    audiosToLoad++;
}

var audioFailcount=0;
function failedtoLoadAudio(e){
    audioFailcount++;
    console.log("COULD NOT LOAD AUDIO: "+audioFailcount+ " of "+audiosToLoad);
    if(audioFailcount==audiosToLoad){
        noAudio=true;
        start();
    }
}

var audiosLoaded = 0;
var isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;
var isPlayingAudio_shoot;
function loadedAudio(){
    audiosLoaded++;
    if(audiosLoaded==audiosToLoad){

        isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;
        isPlayingAudio_shoot = audio_shoot.currentTime > 0 && !audio_shoot.paused && !audio_shoot.ended && audio_shoot.readyState > audio_shoot.HAVE_CURRENT_DATA;
    
        audio.removeEventListener('canplay', loadedAudio);
        audio.addEventListener('error', failedtoLoadAudio);
        
        if(muted) { audio.volume=0; audio_shoot.volume=0; }
    
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
