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
		killEnemy();

		for(i=0; i<=npc.length-1; i++){
			isNpc[i].death=true;
		}
		renderNPCs();
		renderEnemy();

		isPlayer.hurt=false;

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

			
			
			
	        endingTL = gsap.timeline({paused:true, onComplete:bindRestartButtons, defaults:{duration:0} } );

	        endingTL.to(["#ending_txt","#endingContainer","#end_score_txt"], {display:"block"},0)
        		.to(["#overlay-stereo","#tape","#score_txt","#intro-text"], {alpha:0},0)
        		.to("#endingContainer", {alpha:1}, 0)
	        	.to("#end-sly", {x:0,y:0},"<")
	        	.to("#end-sly", {alpha:1},">")
	        	.to("#end-txt", {alpha:1},"<1")
	        	.call(typeText, [ending_txt,.7,0], ">1")
	            .to("#ending_txt", {alpha:1},"<")
	            .call(function(){ document.getElementById("end_score_txt").innerHTML="you scored: "+(Math.round(score.curr).toWidth(6,'0')); },[], "<")
	            .to("#end_score_txt", {alpha:1},">1")
	            .to([restart_btn,restart_btn_mobile], 0, {display:"block", left: "calc(50% + 187px)", top: "calc(50% + 151px)", transform:"rotate(6deg) skew(4deg) translate(-50%, -50%)"},">.4")
	            .to([restart_btn,restart_btn_mobile], 1, {alpha:1},"<");

	        endingTL.play();
	    }
	}
}