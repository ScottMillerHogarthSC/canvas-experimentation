

var fg = {url:"images/Foreground/fg.png", x:0,y:0,width:1152,height:324,cellW:32};

var fgObstacles = [];

for(i=0; i<(fg.width/fg.cellW); i++){
	fgObstacles[i]=false;
}
fgObstacles[12]=true;
var obstacles = {x:0}
obstacles.x=384;
obstacles.y=(32*8);
obstacles.w=(32*4);
obstacles.h=32;