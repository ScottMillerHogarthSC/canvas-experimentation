var endingPlaying=false;
function playEnding(){
	// console.log("ending");
	isEnemy.exploding=true;

	isPlayer.run=false;
	isPlayer.runBack=false;
	isPlayer.attack=false;
	isPlayer.attackBack=false;
	if(!isPlayer.walk){
		isPlayer.walk=true;
	}
	gsap.to(["#overlay-bg"],0,{display:"block"});
	gsap.to("#overlay-bg",1,{alpha:1});
	createjs.Ticker.framerate = 50;
	

	if(player.x<360){ 
		renderEnemy();

		renderPlayer();
		moveSpriteSheets();
		player.x++;
	}
	else {
		if(!endingPlaying){
			endingPlaying=true;

			ctxPlayer.clearRect(0, 0, canvas.width, canvas.height);
			ctxEnemy.clearRect(0, 0, canvas.width, canvas.height);
			ctxNpc.clearRect(0, 0, canvas.width, canvas.height);

			
	        endingTL = gsap.timeline({paused:true, onComplete:bindRestartButtons});

	        endingTL.to(["#ending_txt","#endingContainer"],0,{display:"block"},0)
	        	.to("#endingContainer",.2,{alpha:1},">")
	        	.to("#end-sly",0,{alpha:1},">.4")
	        	.to("#end-txt",0,{alpha:1},">.4")
	            .to("#ending_txt",.2,{alpha:1},">.4")
	            .call(typeText, [ending_txt,.7,0], "<")
	            .to([restart_btn,restart_btn_mobile], 0, {display:"block", left: "66%", top: "50px"},">.4")
	            .to([restart_btn,restart_btn_mobile], 1, {alpha:1},"<");

	        endingTL.play();
	    }
	}
}