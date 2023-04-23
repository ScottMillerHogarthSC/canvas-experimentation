function initAudio(){
    if (audio.canPlayType('audio/mpeg')) {
        
        if(window.location.href.includes("scottmillerhogarthsc")){
            console.log("online");
            audio.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
            audio_shoot.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shoot.mp3');
            audio_blaster.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/blaster.mp3');
            audio_explosion.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/explosion.mp3');


        } else {
            console.log("local");
            audio.setAttribute('src','audio/shredded-midi.mp3');
            audio_shoot.setAttribute('src','audio/shoot.mp3');
            audio_blaster.setAttribute('src','audio/blaster.mp3');
            audio_explosion.setAttribute('src','audio/explosion.mp3');
        }
        // audio_shoot.volume=.4;
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

    audio_blaster.addEventListener('canplay', loadedAudio);
    audio_blaster.addEventListener('error', failedtoLoadAudio);

    audio_blaster.load(); 

    audiosToLoad++;

    audio_explosion.addEventListener('canplay', loadedAudio);
    audio_explosion.addEventListener('error', failedtoLoadAudio);

    audio_explosion.load(); 

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
        audio.removeEventListener('error', failedtoLoadAudio);
        
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
