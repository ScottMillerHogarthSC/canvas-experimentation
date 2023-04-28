var npc_groundY = enemy_groundY+48;
var npc = [{x:100,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:38,hitY:10,health:20,fullhealth:20,killValue:5},       
            {x:200,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:38,hitY:10,health:20,fullhealth:20,killValue:5},
            {x:576,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:38,hitY:10,health:20,fullhealth:20,killValue:5},
            {x:500,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:38,hitY:10,health:20,fullhealth:20,killValue:5}]

var isNpc = []

for(i=0;i<=npc.length-1;i++){
    isNpc[i]= {
        idle:false,
        idleBack:false,
        walk:false,
        walkBack:false,
        hurt:false,
        hurtBack:false,
        killed:false
    }
}

var npcList = [ // order of the below must be preserved
[
    {id:"Punk-Idle",url:"images/Punk/Idle.png",width:192,height:48},
    {id:"Punk-Idle-back",url:"images/Punk/Idle-back.png",width:192,height:48},
    {id:"Punk-Walk",url:"images/Punk/Walk.png",width:288,height:48},
    {id:"Punk-Walk-back",url:"images/Punk/Walk-back.png",width:288,height:48},
    {id:"Punk-Hurt",url:"images/Punk/Hurt.png",width:96,height:48},
    {id:"Punk-Hurt-back",url:"images/Punk/Hurt-back.png",width:96,height:48},
    {id:"Punk-Death",url:"images/Punk/Death.png",width:288,height:48},
    {id:"Punk-Death-back",url:"images/Punk/Death-back.png",width:288,height:48}]
];
var npcImgs = [];
var npcImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0, death:0, deathBack:0};

