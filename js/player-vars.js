var player_ground={y:268,floor:288}
var player = {x:0,y:0,width:48,height:48,hitW:30,hitX:0,hitXB:20,hitH:36,hitY:12,health:100,jumpH:60,lives:3,shootRange:180};
player.y=player_ground.y-player.height; 

var isPlayer = {
    walk:true,
    idleBack:false,
    run:false,
    runBack:false,
    attack:false,
    attackBack:false,
    hurt:false,
    jump:false,
    dead: false,
    shot: false,
    invincible: false,
    atObstacle: false
}


var player_idle = {url:"images/Biker/Biker_idle.png",width:192,height:48},
    player_walk = {url:"images/Biker/Walk.png",width:288,height:48},
    player_idleBack = {url:"images/Biker/Biker_idle-back.png",width:192,height:48},
    player_run = {url:"images/Biker/Run.png",width:288,height:48},
    player_runBack = {url:"images/Biker/Run-back.png",width:288,height:48},
    player_attack = {url:"images/Biker/Idle1.png",width:192,height:48},
    player_attackBack = {url:"images/Biker/Idle1-back.png",width:192,height:48},
    player_hurt = {url:"images/Biker/Hurt.png",width:96,height:48},
    player_hurtBack = {url:"images/Biker/Hurt-back.png",width:96,height:48},
    player_hurtRun = {url:"images/Biker/Hurt_run.png",width:288,height:48},
    player_hurtRunBack = {url:"images/Biker/Hurt_run-back.png",width:288,height:48},
    player_jump = {url:"images/Biker/Jump.png",width:384,height:48},
    player_jumpBack = {url:"images/Biker/Jump-back.png",width:384,height:48},
    player_dead = {url:"images/Biker/Death.png",width:288,height:48},
    player_deadBack = {url:"images/Biker/Death-back.png",width:288,height:48},
    player_shot = {url:"images/Biker/Shot.png",width:240,height:48,offsetX:17},
    player_shotBack = {url:"images/Biker/Shot-back.png",width:240,height:48,offsetX:-17};

var player_shoot = {url:"images/Shoot/1_1.png",width:288,height:48,offsetX:10,offsetY:4},
    player_shootBack = {url:"images/Shoot/1_1-back.png",width:288,height:48,offsetX:86,offsetY:4};