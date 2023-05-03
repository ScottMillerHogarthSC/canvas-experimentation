var audio,audio_shoot,audio_blaster,audio_explosion,audio_playerhurt,audio_playerdead,
noAudio=false;
function initAudio(){
    //[audio]
    audio_music = document.getElementById("audio");
    audio_shoot = document.getElementById("audio-shoot");
    audio_heavyshoot = document.getElementById("audio-heavyshoot");
    audio_blaster = document.getElementById("audio-blaster");
    audio_explosion = document.getElementById("audio-explosion");
    audio_playerhurt = document.getElementById("audio-playerhurt");
    audio_playerdead = document.getElementById("audio-playerdead");
    audio_dieMusic = document.getElementById("audio-die_music");
    

    if (audio_music.canPlayType('audio/mpeg')) {
        
        if(window.location.href.includes("scottmillerhogarthsc")){
            console.log("online");
            audio_music.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shredded-midi.mp3');
            audio_shoot.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/shoot1.mp3');
            audio_heavyshoot.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/heavy_shoot.mp3');
            audio_blaster.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/blaster.mp3');
            audio_explosion.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/explosion.mp3');
            audio_playerhurt.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/player-hurt.mp3');
            audio_playerdead.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/player-ded.mp3');
            audio_dieMusic.setAttribute('src','https://s3.eu-west-2.amazonaws.com/stars-are-my-guide.ga/die.mp3');

        } else {
            console.log("local");
            audio_music.setAttribute('src','audio/shredded-midi.mp3');
            audio_shoot.setAttribute('src','audio/shoot1.mp3');
            audio_heavyshoot.setAttribute('src','audio/heavy_shoot.mp3');
            audio_blaster.setAttribute('src','audio/blaster.mp3');
            audio_explosion.setAttribute('src','audio/explosion.mp3');
            audio_playerhurt.setAttribute('src','audio/player-hurt.mp3');
            audio_playerdead.setAttribute('src','audio/player-ded.mp3');
            audio_dieMusic.setAttribute('src','audio/die.mp3');
        }
    } 
    else {
        console.log("browser doesnt support audio");
        noAudio=true;
    }


    
    preloadMusic(); 
}

var audioMusicArr = [];
function preloadMusic(){

    audio_music.addEventListener('canplay', loadedMusic);
    audio_music.addEventListener('error', failedtoLoadMusic);

    audio_music.load(); 
    audioMusicArr.push(audio_music);

    audio_dieMusic.addEventListener('canplay', loadedMusic);
    audio_dieMusic.addEventListener('error', failedtoLoadMusic);

    audio_dieMusic.load(); 
    audioMusicArr.push(audio_dieMusic);

}

var musicFailcount=0;
function failedtoLoadMusic(e){
    musicFailcount++;
    console.log("COULD NOT LOAD Music: "+musicFailcount+ " of "+audioMusicArr.length-1);
    if(audioFailcount==audioMusicArr.length-1){
        noAudio=true;
        start();
    }
}

var musicsLoaded = 0;
function loadedMusic(){
    musicsLoaded++;
    if(musicsLoaded==audioMusicArr.length-1){
        audioMusicArr.forEach(ele => ele.removeEventListener('canplay', loadedMusic));
        audioMusicArr.forEach(ele => ele.removeEventListener('error', failedtoLoadMusic));
        
        if(muted) { 
            audioMusicArr.forEach(ele => ele.volume=0);
        }

        preloadAudio();
    }
}

var audiosArr = [];
function preloadAudio(){
    console.log("preloadAudio");

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
    console.log("COULD NOT LOAD AUDIO: "+audioFailcount+ " of "+audiosArr.length-1);
    if(audioFailcount==audiosArr.length-1){
        noAudio=true;
        start();
    }
}
var audiosLoaded=0;
function loadedAudio(){
    audiosLoaded++;
    if(audiosLoaded==audiosArr.length-1){

        audiosArr.forEach(ele => ele.removeEventListener('canplay', loadedAudio));
        audiosArr.forEach(ele => ele.removeEventListener('error', failedtoLoadAudio));
        
        if(muted) { 
            audiosArr.forEach(ele => ele.volume=0);
        }

        start();
    }
}

function toggleMuteAudio(){
    if(!muted){
        audiosArr.forEach(ele => ele.volume=0);
        audioMusicArr.forEach(ele => ele.volume=0);

        muted=true;
    } else {
        audiosArr.forEach(ele => ele.volume=1);
        audioMusicArr.forEach(ele => ele.volume=1);
        muted=false;
    }
}

function playSFX(whichSound,stopOtherSounds){
    if(!muted && !noAudio){
        if(stopOtherSounds){
            audiosArr.forEach(ele => ele.volume=0);
            whichSound.volume=1;
            whichSound.play()
        } else {
            whichSound.volume=1;
            whichSound.play()
        }
    }
}
function playMusic(whichMusic,fromPause){
    if(!fromPause){
        audioMusicArr.forEach(ele => ele.currentTime=0);
    }
    audioMusicArr.forEach(ele => ele.pause());
    if(!noAudio && !muted){
        whichMusic.volume=1;
        whichMusic.play();
    }
}

function pauseMusic(whichMusic){
    whichMusic.pause();
}