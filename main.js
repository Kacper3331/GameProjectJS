// var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// window.requestAnimationFrame = requestAnimationFrame;

var app = PIXI.autoDetectRenderer(1000, 600, { antialias: true, backgroundColor: 0x65C25D });

document.body.appendChild(app.view);

var graphic = new PIXI.Graphics();

var scene = new PIXI.Container();

var boxes = [];

boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: 600
});

boxes.push({
    x: 0,
    y: 600 - 9,
    width: 1000,
    height: 50
});

boxes.push({
    x: 1000 - 10,
    y: 0,
    width: 50,
    height: 600
});

boxes.push({
    x: 250,
    y: 500,
    width: 100,
    height: 40
});

boxes.push({
    x: 400,
    y: 450,
    width: 120,
    height: 40
});


boxes.push({
    x: 340,
    y: 350,
    width: 120,
    height: 40
});

var player = {
    x : 1000 / 2,
    y :  600 - 65,
    width : 50,
    height : 50,
    speed : 3,
    velX : 0,
    velY : 0,
    jumping : false,
    grounded: false
};

friction = 0.8;
gravity = 0.3;

keys = [];

var zombieTexture = PIXI.Texture.fromImage('image.png');
var image = new PIXI.Sprite(zombieTexture);

image.width = player.width;
image.height = player.height;


graphic.beginFill("black");
graphic.lineStyle(2,"black",1 );

for (var i = 0; i < boxes.length; i++) {
    graphic.drawRect(boxes[i].x, boxes[i].y,boxes[i].width, boxes[i].height);
}
graphic.endFill();


function gameLoop(){
    if(keys[38] || keys[32]) {
        if(!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 3;
        }
    }

    if(keys[39]) {
        if (player.velX < player.speed) {
            player.velX++;
        }
    }

    if(keys[37]) {
        if(player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;


    image.position.x = player.x;
    image.position.y = player.y;

    player.grounded = false;

    var i = 0;
    while (i < boxes.length) {

        var dir = collisionCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if ( dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if ( dir === "t" ) {
            player.velY *= -1;
        }

        i++;
    }


    if (player.grounded) {
        player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    scene.addChild(image);
    scene.addChild(graphic);



    app.render(scene);

    requestAnimationFrame(gameLoop);

};

function collisionCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),

        hWidth = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        collisionDir = null;

    if (Math.abs(vX) < hWidth && Math.abs(vY) < hHeights) {
        var oX = hWidth - Math.abs(vX);
        var oY = hHeights - Math.abs(vY);
        if (oX >= oY ){
            if(vY > 0) {
                collisionDir = "t";
                shapeA.y += oY;
            } else {
                collisionDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                collisionDir = "l";
                shapeA.x += oX;
            } else {
                collisionDir = "r";
                shapeA.x -= oX;
            }
        }
    }

    return collisionDir;
}


document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    gameLoop();
});


gameLoop();
//
// function draw() {
// }
//
// draw();



