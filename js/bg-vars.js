
var canvas = {width:576,height:320}

var bgOverlay = {url:"images/Night/Overlay_illumination.png", x:-570,y:-600,width:1800,height:1200};

var bgsList = [
	{url:"images/Night/1.png", x:0, y:-32, width:576, height:320},
	{url:"images/Night/2.png", x:0, y:0, width:576, height:320},
	{url:"images/Night/3.png", x:0, y:0, width:576, height:320},
	{url:"images/Night/5.png", x:0, y:-32, width:576, height:320}
]
var bgsImgs = [];


var bgBuildings = {x:1152,y:0,width:1152,height:324};
var buildingsList = [
	{int:0,url:"images/Buildings/bg-buildings1.png", x:-bgBuildings.width},
	{int:1,url:"images/Buildings/bg-buildings0.png", x:0},
	{int:2,url:"images/Buildings/bg-buildings2.png", x:bgBuildings.width},
	{int:3,url:"images/Buildings/bg-buildings3.png", x:bgBuildings.width*2},
	{int:4,url:"images/Buildings/bg-buildings4.png", x:bgBuildings.width*3},
	{int:5,url:"images/Buildings/bg-buildings5.png", x:bgBuildings.width*4}
];
var buildingsImgs = [];



var numOfBuildings = buildingsList.length;


