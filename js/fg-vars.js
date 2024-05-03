

var fg = {x:0,y:0,width:1152,height:324,cellW:32};

var fgsList = [
{id:"01", url:"images/Foreground/fg0.png", x:-fg.width,y:0},
{id:"02", url:"images/Foreground/fg0.png", x:0,y:0},
{id:"03", url:"images/Foreground/fg0.png", x:fg.width,y:0},
{id:"04", url:"images/Foreground/fg1.png", x:fg.width*2,y:0},
{id:"05", url:"images/Foreground/fg2.png", x:fg.width*3,y:0},
{id:"06", url:"images/Foreground/fg3.png", x:fg.width*4,y:0},
{id:"07", url:"images/Foreground/fg4.png", x:fg.width*5,y:0},
{id:"08", url:"images/Foreground/fg0.png", x:fg.width*6,y:0},
{id:"09", url:"images/Foreground/fg-end.png", x:fg.width*7,y:0}
];  
var fgsImgs = [];
var fgsImgIndex = {}


	
var obstacle = [
	{x:(fg.width*2)+384,y:(32*8),w:(32*4),h:32,initX:(fg.width*2)+384},
	{x:(fg.width*2)+576,y:(32*7),w:(32*2),h:32,initX:(fg.width*2)+576},
	{x:(fg.width*2)+736,y:(32*8),w:(32*3),h:32,initX:(fg.width*2)+736},
	{x:(fg.width*3)+384,y:(32*8),w:(32*4),h:32,initX:(fg.width*3)+384},
	{x:(fg.width*3)+608,y:(32*8),w:(32*2),h:32,initX:(fg.width*3)+608},
	{x:(fg.width*3)+736,y:(32*8),w:(32*3),h:32,initX:(fg.width*3)+736},
	{x:(fg.width*4)+0,y:(32*8)+25,w:32,h:7,initX:(fg.width*4)+0},
	{x:(fg.width*4)+32,y:(32*8)+18,w:(32)*2,h:14,initX:(fg.width*4)+32},
	{x:(fg.width*5)+64,y:(32*8),w:(32),h:32,initX:(fg.width*5)+64},
	{x:(fg.width*5)+128,y:(32*7),w:(32*4),h:16,initX:(fg.width*5)+128},
	{x:(fg.width*5)+320,y:(32*6),w:(32*2),h:32,initX:(fg.width*5)+320},
	{x:(fg.width*5)+448,y:(32*5),w:(32*4),h:32,initX:(fg.width*5)+448},
]

var powerup = {id:"01",url:"images/Punk/Hurt.png",width:96,height:48};

var powerups = [{x:384,y:(32*6),w:(32),h:32,initX:384}];
