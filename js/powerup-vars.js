
var powerup_images = [
	{id:0,url:"images/Powerups/gun.png",width:28,height:13,cellW:14},
	{id:1,url:"images/Powerups/jump.png",width:36,height:18,cellW:18},
	{id:2,url:"images/Powerups/8_1.png",width:18,height:8,cellW:18}
];

var powerups = [
	{x:576+23,y:(32*7),w:14,h:13,initX:576+23,isApplied:false,isUsed:false,powerupTimer:-1,which:"shootRange"},
	{x:(fg.width*2)+576+23,y:(32*4),w:18,h:18,initX:(fg.width*2)+576+23,isApplied:false,isUsed:false,powerupTimer:5,which:"jumpH"},
	// {x:(fg.width*5)+448+23,y:(32*2),w:18,h:18,initX:(fg.width*5)+448+23,isApplied:false,isUsed:false,powerupTimer:-1,which:"shootDamage"},
	{x:(fg.width*5)+448+23,y:(32*2),w:18,h:18,initX:(fg.width*5)+448+23,isApplied:false,isUsed:false,powerupTimer:10,which:"shootDamage"},
];
// var powerups = [
var powerupIndex = 0;
var powerup_imgs=[];