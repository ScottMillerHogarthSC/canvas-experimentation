var canvas = {width:576,height:320}
var enemy_groundY = 320-96-32;
var enemy = [{x:canvas.width,y:enemy_groundY,width:96,height:96,hitW:60,hitX:0,hitXB:36,hitH:32,hitY:64,health:200,fullhealth:200,explosionOffsetX:20,explosionOffsetY:0,killValue:50,shootRange:80,shootAmount:1,shootDamage:0.5}, // CyberBike - whichEnemyIndex: 0
            {x:canvas.width,y:enemy_groundY,width:96,height:96,hitW:96,hitX:0,hitXB:0,hitH:60,hitY:36,health:300,fullhealth:300,explosionOffsetX:0,explosionOffsetY:0,killValue:100,shootRange:150,shootAmount:2,shootDamage:0.2}]; // BattleCar - whichEnemyIndex: 1
var enemyCellW = 96;
var enemyKillCount=0;

var explosion = {url:"images/Explosion/2.png",width:576,height:96};
var flash = {url:"images/Explosion/2.png",width:576,height:96,cellW:96,x:0,y:192};
var drone = {url:"images/Drone/Drop.png",width:576,height:96,cellW:96,x:-96,y:32};
var bomb = {url:"images/Drone/Bomb.png",width:96,height:16,cellW:16,x:170,y:76};
var flashes = [{x:0,y:0,go:false}]
var flashCount=0;

var isEnemy = {
    idle:false,
    idleBack:false,
    run:false,
    runBack:true,
    attack:false,
    attackBack:false,
    hurt:false,
    hurtBack:false,
    killed:false,
    exploding:false
}

var enemiesList = [ // order of the below must be preserved
[
    {id:"CyberBike-Idle",url:"images/CyberBike/Idle.png",width:384,height:96,cellW:96},
    {id:"CyberBike-Idle-back",url:"images/CyberBike/Idle-back.png",width:384,height:96,cellW:96},
    {id:"CyberBike-Walk",url:"images/CyberBike/Walk.png",width:384,height:96,cellW:96},
    {id:"CyberBike-Walk-back",url:"images/CyberBike/Walk-back.png",width:384,height:96,cellW:96},
    {id:"CyberBike-Attack",url:"images/CyberBike/Attack4a.png",width:768,height:96,cellW:192},
    {id:"CyberBike-Attack-back",url:"images/CyberBike/Attack4a-back.png",width:768,height:96,cellW:192},
    {id:"CyberBike-Hurt",url:"images/CyberBike/Hurt.png",width:192,height:96,cellW:96},
    {id:"CyberBike-Hurt-back",url:"images/CyberBike/Hurt-back.png",width:192,height:96,cellW:96}],
    
[
    {id:"BattleCar-Idle",url:"images/BattleCar/Idle.png",width:384,height:96,cellW:96},
    {id:"BattleCar-Idle-back",url:"images/BattleCar/Idle-back.png",width:384,height:96,cellW:96},
    {id:"BattleCar-Walk",url:"images/BattleCar/Walk.png",width:384,height:96,cellW:96},
    {id:"BattleCar-Walk-back",url:"images/BattleCar/Walk-back.png",width:384,height:96,cellW:96},
    {id:"BattleCar-Attack",url:"images/BattleCar/Attack2.png",width:768,height:96,cellW:96},
    {id:"BattleCar-Attack-back",url:"images/BattleCar/Attack2-back.png",width:768,height:96,cellW:96},
    {id:"BattleCar-Hurt",url:"images/BattleCar/Hurt.png",width:192,height:96,cellW:96},
    {id:"BattleCar-Hurt-back",url:"images/BattleCar/Hurt-back.png",width:192,height:96,cellW:96}]
]
;
var enemyImgs = [];
var enemyImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0, attack:0, attackBack:0};
