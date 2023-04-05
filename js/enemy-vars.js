var canvas = {width:576,height:320}
var enemy_groundY = 320-96-32;
var enemy = [{x:canvas.width,y:enemy_groundY,width:96,height:96,hitW:60,hitX:0,hitXB:36,hitH:37,hitY:59,health:200,explosionOffsetX:20,explosionOffsetY:0}, // CyberBike - whichEnemyIndex: 0
            {x:-97,y:enemy_groundY,width:96,height:96,hitW:96,hitX:0,hitXB:0,hitH:60,hitY:36,health:200,explosionOffsetX:0,explosionOffsetY:0}]; // BattleCar - whichEnemyIndex: 1

var enemyKillCount=0;

var explosion = {url:"images/Explosion/2.png",width:576,height:96};

var isEnemy = {
    idle:false,
    idleBack:false,
    run:false,
    runBack:true,
    attack:true,
    attackBack:false,
    hurt:false,
    hurtBack:false,
    killed:false,
    exploding:false
}

var enemiesList = [ // order of the below must be preserved
[
    {id:"CyberBike-Idle",url:"images/CyberBike/Idle.png",width:384,height:96},
    {id:"CyberBike-Idle-back",url:"images/CyberBike/Idle-back.png",width:384,height:96},
    {id:"CyberBike-Walk",url:"images/CyberBike/Walk.png",width:384,height:96},
    {id:"CyberBike-Walk-back",url:"images/CyberBike/Walk-back.png",width:384,height:96},
    {id:"CyberBike-Attack",url:"images/CyberBike/Attack1.png",width:384,height:96},
    {id:"CyberBike-Attack-back",url:"images/CyberBike/Attack1-back.png",width:384,height:96},
    {id:"CyberBike-Hurt",url:"images/CyberBike/Hurt.png",width:192,height:96},
    {id:"CyberBike-Hurt-back",url:"images/CyberBike/Hurt-back.png",width:192,height:96}],
[
    {id:"BattleCar-Idle",url:"images/BattleCar/Idle.png",width:384,height:96},
    {id:"BattleCar-Idle-back",url:"images/BattleCar/Idle-back.png",width:384,height:96},
    {id:"BattleCar-Walk",url:"images/BattleCar/Walk.png",width:384,height:96},
    {id:"BattleCar-Walk-back",url:"images/BattleCar/Walk-back.png",width:384,height:96},
    {id:"BattleCar-Attack",url:"images/BattleCar/Attack2.png",width:768,height:96},
    {id:"BattleCar-Attack-back",url:"images/BattleCar/Attack2-back.png",width:768,height:96},
    {id:"BattleCar-Hurt",url:"images/BattleCar/Hurt.png",width:192,height:96},
    {id:"BattleCar-Hurt-back",url:"images/BattleCar/Hurt-back.png",width:192,height:96}]
]
;
var enemyImgs = [];
var enemyImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0};

var enemies = [[]];