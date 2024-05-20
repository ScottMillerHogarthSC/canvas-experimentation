
var powerup_images = [
	{id:0,url:"images/Powerups/gun.png",width:28,height:13,cellW:14},
	{id:1,url:"images/Powerups/jump.png",width:36,height:18,cellW:18},
	{id:2,url:"images/Powerups/shotgun.png",width:50,height:10,cellW:25}
];

var powerups = [
	{x:576+23,y:(32*7),w:14,h:13,initX:576+23,isApplied:false,isUsed:false,powerupTimer:-1,which:"shootRange"},
	{x:(fg.width*2)+576+23,y:(32*4),w:18,h:18,initX:(fg.width*2)+576+23,isApplied:false,isUsed:false,powerupTimer:10,which:"jumpH"},
	{x:(fg.width*6)+448+(23+23),y:(32*2),w:25,h:10,initX:(fg.width*6)+448+(23+23),isApplied:false,isUsed:false,powerupTimer:10,which:"shootDamage"},
];
// var powerups = [
var powerupIndex = 0;
var powerup_imgs=[];