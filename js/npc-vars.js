var npc_groundY = enemy_groundY+48;
var npc = [{x:596,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:32,hitY:16,health:20,fullhealth:20,killValue:5,initX:596},       
            {x:626,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:32,hitY:16,health:20,fullhealth:20,killValue:5,initX:626},
            {x:676,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:32,hitY:16,health:20,fullhealth:20,killValue:5,initX:676},
            {x:576,y:npc_groundY,width:48,height:48,hitW:20,hitX:5,hitXB:24,hitH:32,hitY:16,health:20,fullhealth:20,killValue:5,initX:576}]
var npcKillCount = 0;
var isNpc = []

for(i=0;i<=npc.length-1;i++){
    isNpc[i]= {
        idle:false,
        idleBack:false,
        walk:false,
        walkBack:false,
        hurt:false,
        hurtBack:false,
        killed:false,
        hitPlayer:false
    }
}

var npcList = [ // order of the below must be preserved
[
    {id:"Punk-Idle",url:"images/Punk/Idle.png",width:192,height:48},
    {id:"Punk-Idle-back",url:"images/Punk/Idle-back.png",width:192,height:48},
    {id:"Punk-Walk",url:"images/Zombie/Walk.png",width:288,height:48},
    {id:"Punk-Walk-back",url:"images/Zombie/Walk-back.png",width:288,height:48},
    {id:"Punk-Hurt",url:"images/Zombie/Hurt.png",width:96,height:48},
    {id:"Punk-Hurt-back",url:"images/Zombie/Hurt-back.png",width:96,height:48},
    {id:"Punk-Death",url:"images/Zombie/Death.png",width:288,height:48},
    {id:"Punk-Death-back",url:"images/Zombie/Death-back.png",width:288,height:48}]
];
var npcImgs = [];
var npcImgIndex = {walkBack:0, hurtBack:0, walk:0, hurt:0, death:0, deathBack:0};


