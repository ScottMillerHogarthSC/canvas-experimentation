

function init()
{
    console.log("init");

    // querystr overrides:
    if(window.location.search.includes("frameRate")){
        
        frameRate=window.location.search.split("frameRate=")[1];
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
        if(!window.location.search.includes("mute")){
            if(window.location.href.includes("scottmillerhogarthsc")){
                console.log("online");
                audio.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
            } else {
                console.log("local")
                audio.setAttribute('src','shredded-midi.mp3');
            }

        } else {
            console.log("audio muted");
            start();
        }
    } 
    else {
        console.log("browser doesnt support audio");
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


    start();


}

var audioLoaded = false;
function loadedAudio(){
    if(!audioLoaded){
        audioLoaded = true;
    
        audio.removeEventListener('canplay', loadedAudio);
        audio.addEventListener('error', failedtoLoadAudio);
    
    
        $(document).on('show.visibility', function() {
            
        });
        $(document).on('hide.visibility', function() {
            audio.pause();
        });
        
        

        start();
    }
}

function start(){
    initCanvasAnim();

    
    Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);

    document.body.addEventListener('keypress', checkKeyPress);
}
