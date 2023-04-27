function playEnding(){
	isEnemy.exploding=true;

	isPlayer.run=false;
	if(!isPlayer.idle){
		isPlayer.idle=true;
	}
	gsap.to(["#overlay-bg"],0,{display:"block"});
	gsap.to("#overlay-bg",1,{alpha:1});
	frameRate=50;
	

	if(player.x<360){ 
		renderEnemy();

		renderPlayer();
		moveSpriteSheets();
		player.x++;
	}
	else {

		ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);
		ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
	}
}