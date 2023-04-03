var player_groundY = 320-48-32;
var player = {x:0,y:player_groundY,width:48,height:48,hitW:30,hitX:0,hitXB:20,hitH:36,hitY:12};


var isPlayer = {
    idle:true,
    idleBack:false,
    run:false,
    runBack:false,
    attack:false,
    attackBack:false,
    hurt:false,
    jump:false
}


var player_idle = {url:"images/Biker/Walk.png",width:288,height:48},
    player_idleBack = {url:"images/Biker/Walk-back.png",width:288,height:48},
    player_run = {url:"images/Biker/Run.png",width:288,height:48},
    player_runBack = {url:"images/Biker/Run-back.png",width:288,height:48},
    player_attack = {url:"images/Biker/Idle1.png",width:192,height:48},
    player_attackBack = {url:"images/Biker/Idle1-back.png",width:192,height:48},
    player_hurt = {url:"images/Biker/Hurt.png",width:96,height:48},
    player_hurtBack = {url:"images/Biker/Hurt-back.png",width:96,height:48},
    player_jump = {url:"images/Biker/Jump.png",width:384,height:48},
    player_jumpBack = {url:"images/Biker/Jump-back.png",width:384,height:48};

var shoot = {url:"images/Shoot/1_1.png",width:288,height:48,offsetX:10,offsetY:4},
    shootBack = {url:"images/Shoot/1_1-back.png",width:288,height:48,offsetX:86,offsetY:4};




// var player_idle = {url:"images/CyberBike/Idle.png",width:384,height:96},
//     player_idleBack = {url:"images/CyberBike/Idle-back.png",width:384,height:96},
//     player_run = {url:"images/CyberBike/Walk.png",width:384,height:96},
//     player_runBack = {url:"images/CyberBike/Walk-back.png",width:384,height:96},
//     player_attack = {url:"images/CyberBike/Attack1.png",width:384,height:96},
//     player_attackBack = {url:"images/CyberBike/Attack1-back.png",width:384,height:96};

// var player_idle = {url:"images/Idle.png",width:576,height:96},
//     player_idleBack = {url:"images/Idle-back.png",width:576,height:96},
//     player_run = {url:"images/Run.png",width:576,height:96},
//     player_runBack = {url:"images/Run-back.png",width:576,height:96},
//     player_attack = {url:"images/Run_Attack.png",width:384,height:96},
//     player_attackBack = {url:"images/Run_Attack-back.png",width:384,height:96};

