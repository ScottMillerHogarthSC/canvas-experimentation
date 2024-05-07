
var powerup_images = [
	{id:"01",url:"images/Powerups/gun.png",width:26,height:11,cellW:13},
	{id:"02",url:"images/Powerups/jump.png",width:36,height:18,cellW:18}];

var powerups = [
	{x:576+23,y:(32*7),w:13,h:11,initX:(fg.width*2)+576+23,isApplied:false,isUsed:false,powerupTimer:-1,which:"shootRange"},
	{x:(fg.width*2)+576+23,y:(32*4),w:18,h:18,initX:(fg.width*2)+576+23,isApplied:false,isUsed:false,powerupTimer:5,which:"jumpH"}
];
// var powerups = [
var powerupIndex = 0;
var powerup_imgs=[];