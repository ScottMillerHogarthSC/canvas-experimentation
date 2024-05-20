

var fg = {x:0,y:0,width:1152,height:324,cellW:32};

var fgsList = [
{int:0, url:"images/Foreground/fg0.png", x:-fg.width,y:0},
{int:1, url:"images/Foreground/fg0.png", x:0,y:0},
{int:2, url:"images/Foreground/fg0.png", x:fg.width,y:0},
{int:3, url:"images/Foreground/fg1.png", x:fg.width*2,y:0},
{int:4, url:"images/Foreground/fg0.png", x:fg.width*3,y:0},
{int:5, url:"images/Foreground/fg2.png", x:fg.width*4,y:0},
{int:6, url:"images/Foreground/fg3.png", x:fg.width*5,y:0},
{int:7, url:"images/Foreground/fg4.png", x:fg.width*6,y:0},
{int:8, url:"images/Foreground/fg0.png", x:fg.width*7,y:0},
{int:9, url:"images/Foreground/fg-end.png", x:fg.width*8,y:0}
];  
var fgsImgs = [];
var fgsImgIndex = {}


	
var obstacle = [
	{x:(fg.width*2)+384,y:(32*8),w:(32*4),h:32,initX:(fg.width*2)+384}, //fg1 1st block
	{x:(fg.width*2)+576,y:(32*7),w:(32*2),h:32,initX:(fg.width*2)+576}, //fg1 2nd platform
	{x:(fg.width*2)+736,y:(32*8),w:(32*3),h:32,initX:(fg.width*2)+736}, //fg1 3rd block
	
	{x:(fg.width*4)+384,y:(32*8),w:(32*4),h:32,initX:(fg.width*4)+384}, //fg3 1st block
	{x:(fg.width*4)+608,y:(32*8),w:(32*2),h:32,initX:(fg.width*4)+608}, //fg3 1nd block
	{x:(fg.width*4)+736,y:(32*8),w:(32*4),h:32,initX:(fg.width*4)+736}, //fg3 3rd block
	
	{x:(fg.width*5)+0,y:(32*8)+25,w:32,h:7,initX:(fg.width*5)+0}, //fg4 - little floor blocks
	{x:(fg.width*5)+32,y:(32*8)+18,w:(32)*2,h:14,initX:(fg.width*5)+32}, //fg4 - little floor blocks
	
	{x:(fg.width*6)+64,y:(32*8),w:(32),h:32,initX:(fg.width*6)+64}, //fg5 - first single block
	{x:(fg.width*6)+128,y:(32*7),w:(32*4),h:16,initX:(fg.width*6)+128}, //fg5 - 2nd platform
	{x:(fg.width*6)+320,y:(32*6),w:(32*2),h:32,initX:(fg.width*6)+320}, //fg5 - 3rd platform
	{x:(fg.width*6)+448,y:(32*5),w:(32*4),h:32,initX:(fg.width*6)+448}, //fg5 - 4th highest platform
]