var audio,audio_shoot,audio_blaster,audio_explosion,audio_playerhurt,audio_playerdead,
noAudio=false;
function initAudio(){
    //[audio]
    audio = document.getElementById("audio");
    audio_shoot = document.getElementById("audio-shoot");
    audio_blaster = document.getElementById("audio-blaster");
    audio_explosion = document.getElementById("audio-explosion");
    audio_playerhurt = document.getElementById("audio-playerhurt");
    audio_playerdead = document.getElementById("audio-playerdead");
    

    if (audio.canPlayType('audio/mpeg')) {
        
        if(window.location.href.includes("scottmillerhogarthsc")){
            console.log("online");
            audio.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
            audio_shoot.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shoot.mp3');
            audio_blaster.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/blaster.mp3');
            audio_explosion.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/explosion.mp3');
            audio_playerhurt.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/player-hurt.mp3');
            audio_playerdead.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/player-ded.mp3');

        } else {
            console.log("local");
            audio.setAttribute('src','audio/shredded-midi.mp3');
            audio_shoot.setAttribute('src','audio/shoot.mp3');
            audio_blaster.setAttribute('src','audio/blaster.mp3');
            audio_explosion.setAttribute('src','audio/explosion.mp3');
            audio_playerhurt.setAttribute('src','audio/player-hurt.mp3');
            audio_playerdead.setAttribute('src','audio/player-ded.mp3');
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
}

var audiosArr = [];

function preloadAudio(){
    console.log("preloadAudio");

    audio.addEventListener('canplay', loadedAudio);
    audio.addEventListener('error', failedtoLoadAudio);

    audio.load(); 
    audiosArr.push(audio);

    audio_shoot.addEventListener('canplay', loadedAudio);
    audio_shoot.addEventListener('error', failedtoLoadAudio);

    audio_shoot.load(); 
    audiosArr.push(audio_shoot);

    audio_blaster.addEventListener('canplay', loadedAudio);
    audio_blaster.addEventListener('error', failedtoLoadAudio);

    audio_blaster.load(); 
    audiosArr.push(audio_blaster);

    audio_explosion.addEventListener('canplay', loadedAudio);
    audio_explosion.addEventListener('error', failedtoLoadAudio);

    audio_explosion.load(); 
    audiosArr.push(audio_blaster);

    audio_playerhurt.addEventListener('canplay', loadedAudio);
    audio_playerhurt.addEventListener('error', failedtoLoadAudio);

    audio_playerhurt.load(); 
    audiosArr.push(audio_playerhurt);

    audio_playerdead.addEventListener('canplay', loadedAudio);
    audio_playerdead.addEventListener('error', failedtoLoadAudio);

    audio_playerdead.load(); 
    audiosArr.push(audio_playerdead);
}

var audioFailcount=0;
function failedtoLoadAudio(e){
    audioFailcount++;
    console.log("COULD NOT LOAD AUDIO: "+audioFailcount+ " of "+audiosToLoad);
    if(audioFailcount==audiosArr.length-1){
        noAudio=true;
        start();
    }
}


var audiosLoaded = 0;


var isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;
function loadedAudio(){
    audiosLoaded++;
    if(audiosLoaded==audiosArr.length-1){

        isPlayingAudio = audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA;
        
        for(i=0; i<=audiosArr.length-1; i++){
            audiosArr[i].removeEventListener('canplay', loadedAudio);
            audiosArr[i].removeEventListener('error', failedtoLoadAudio);
        }
        
        if(muted) { 
            for(i=0; i<=audiosArr.length-1; i++){
                audiosArr[i].volume=0;
            }
        }

        start();
    }
}

function toggleMuteAudio(){
    if(!muted){
        for(i=0; i<=audiosArr.length-1; i++){
            audiosArr[i].volume=0;
        }
        muted=true;
    } else {
        for(i=0; i<=audiosArr.length-1; i++){
            audiosArr[i].volume=1;
        }
        muted=false;
    }
}

function playSFX(whichSound,stopOtherSounds){
    if(!muted){
        if(stopOtherSounds){
            audio_playerhurt.pause();
            audio_playerhurt.volume=0;
            whichSound.volume=1;
            whichSound.play()
        }
        if(!isPlayer.dead){
            whichSound.volume=1;
            whichSound.play()
        }
        // if audio_playerdead
        // audio_playerhurt.pause();
        // audio_playerhurt.volume=0;
        // audio_playerdead.play();
    }
}