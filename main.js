var c = document.getElementById("drawCanvas");

c.width = 1000; //1000 pixels
c.height = 1000; //1000 pixels

var pen = c.getContext("2d");

var spaceDown = false;

onkeydown = function(e){
    if(e.key == " "){
        spaceDown = true;
    }
}

var bush = new Image();
bush.src = "bush.png";
var cloud = new Image();
cloud.src = "cloud.png";
var ground = new Image();
ground.src = "ground.png";
var sky = new Image();
sky.src = "sky.png";

var gravity = 0.5;

var score = 0;

var bird = {
    x: 250,
    y: 500,
    velocity: 0
};

function drawBird(){
    pen.beginPath();
    pen.fillStyle = "yellow";
    pen.strokeStyle = "black";
    pen.lineWidth = 5;
    pen.arc(bird.x, c.height - bird.y, 25, 0, Math.PI * 2);
    pen.fill();
    pen.stroke();
    pen.closePath();

}

function updateBird(){
    bird.velocity -= gravity;
    bird.y += bird.velocity;

    if(spaceDown){
        bird.velocity = 15;
    }
}

var pipeTimer = 0;

function update(){
    pipeTimer -= 1000/60;

    //make a new pipe every 2 seconds
    if(pipeTimer <= 0){
        pipeTimer = 2000;
        new Pipe();
    }

    pen.clearRect(0, 0, c.width, c.height);

    drawBackground();

    updateBird();
    updatePipes();
    drawBird();
    drawPipes();

    pen.fillStyle = "white";
    pen.font = "50px arial";
    pen.strokeStyle = "black";
    pen.strokeText("Score: " + score, 50, 100);
    pen.fillText("Score: " + score, 50, 100);

    spaceDown = false;
}

function drawPipes(){
    for(i of pipes){
        i.draw();
    }
}

function updatePipes(){
    for(i of pipes){
        i.update();
    }
}

var pipes = [];

function Pipe(){
    pipes.push(this); //same as python's append
    this.x = 1000;
    this.y = (Math.random() * 750) + 125; //random num between 125, 875
    this.gapSize = 200;
    this.width = 100;

    this.update = function(){
        this.x -= 7;
        if(this.x < -this.width){
            if(bird.y != Infinity){
                score++;
            }
            pipes.shift();
        }

        if(bird.x > this.x && bird.x < this.x + this.width){
            if(Math.abs(bird.y - (1000 - this.y)) > this.gapSize / 2){
                bird.y = Infinity;
            }
        }
    }

    this.draw = function(){
        pen.fillStyle = "limegreen";
        pen.fillRect(this.x, 0, this.width, this.y - this.gapSize / 2); //draw top half of pipe
        pen.fillRect(this.x, this.y + this.gapSize / 2, this.width, 1000 - (this.y + this.gapSize / 2)); //draw bottom half of pipe

        pen.fillStyle = "rgba(255, 255, 255, 0.2)";

        pen.fillRect(this.x + 75, 0, this.width - 75, this.y - this.gapSize / 2); //draw top half of pipe shading
        pen.fillRect(this.x + 75, this.y + this.gapSize / 2, this.width - 75, 1000 - (this.y + this.gapSize / 2)); //draw bottom half of pipe shading


        pen.strokeRect(this.x, 0, this.width, this.y - this.gapSize / 2); //draw top half of pipe
        pen.strokeRect(this.x, this.y + this.gapSize / 2, this.width, 1000 - (this.y + this.gapSize / 2)); //draw bottom half of pipe
    }
}

var bushes = [];

function Bush(){
    bushes.push(this);
    this.y = Math.random() * 200 + 600;
    this.x = 1000;

    this.update = function(){
        this.x -= 3;
    }
}

var clouds = [];

function Cloud(){
    clouds.push(this);
    this.y = Math.random() * 500;
    this.x = 1000;

    this.update = function(){
        this.x -= 1;
    }
}

var cloudTimer = 0;
var bushTimer = 0;

function drawBackground(){
    cloudTimer -= 1000/60;
    bushTimer -= 1000/60;

    if(cloudTimer < 0){
        new Cloud();
        cloudTimer = 2000;
    }

    if(bushTimer < 0){
        new Bush();
        bushTimer = 1500;
    }

    pen.drawImage(ground, 0, 750, 1000, 250);

    pen.drawImage(sky, 0, 0, 1000, 750);

    pen.strokeStyle = "black";
    pen.beginPath();
    pen.moveTo(0, 750);
    pen.lineTo(1000, 750);
    pen.stroke();
    pen.closePath();

    for(i of clouds){
        i.update();
        pen.drawImage(cloud, i.x, i.y, 200, 200);
    }

    for(i of bushes){
        i.update();
        pen.drawImage(bush, i.x, i.y, 200, 200);
    }
}

setInterval(update, 1000/60); //calls update 60 times a second