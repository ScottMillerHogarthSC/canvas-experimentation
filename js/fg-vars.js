

var fg = {x:0,y:0,width:1152,height:324,cellW:32};

var fgsList = [
{id:"01", url:"images/Foreground/fg0.png", x:-fg.width,y:0},
{id:"02", url:"images/Foreground/fg0.png", x:0,y:0},
{id:"03", url:"images/Foreground/fg1.png", x:fg.width,y:0},
{id:"04", url:"images/Foreground/fg1.png", x:fg.width*2,y:0},
{id:"05", url:"images/Foreground/fg0.png", x:fg.width*3,y:0}
// {url:"images/Foreground/fg1.png", x:fg.width*4,y:0},
// {url:"images/Foreground/fg0.png", x:fg.width*5,y:0},
// {url:"images/Foreground/fg0.png", x:fg.width*6,y:0},
// {url:"images/Foreground/fg1.png", x:fg.width*7,y:0},
// {url:"images/Foreground/fg0.png", x:fg.width*8,y:0}
];  
var fgsImgs = [];
var fgsImgIndex = {}


	
var obstacle = [
	{x:(1152)+384,y:(32*8),w:(32*4),h:32},
	{x:(1152)+608,y:(32*8),w:(32*2),h:32},
	{x:(1152)+736,y:(32*8),w:(32*3),h:32},
	{x:(1152*2)+384,y:(32*8),w:(32*4),h:32},
	{x:(1152*2)+608,y:(32*8),w:(32*2),h:32},
	{x:(1152*2)+736,y:(32*8),w:(32*3),h:32}
]
