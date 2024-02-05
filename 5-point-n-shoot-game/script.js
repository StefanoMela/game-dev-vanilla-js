const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d', { willReadFrequently: true });
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

ctx.font = '50px Impact';

let score = 0;

let gameOver = false;

// inizializzo variabili temporali utili al calcolo dello spawn dei corvi
let timeToNextRaven = 0; // accumula i millisecondi che trascorrono fra frame
let ravenInterval = 500; // limitatore della precedente variabile
let lasTime = 0; // differenza con il timestamp deL loop precedente

let ravens = [];

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height); // posizione randomica fra inizio e fine canva
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'assets/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
    }
    update(deltatime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1; // evito che Raven scompaia sotto i margini
        }
        this.x -= this.directionX; // movimento dx a sx
        this.y += this.directionY; // movimento su giù
        if (this.x < 0 - this.width) this.markedForDeletion = true; // la condizione è vera quando l'oggetto Raven supera il margine sx
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        if(this.x < 0 - this.width) gameOver = true;
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}


let explosions = [];

class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'assets/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'assets/fire-impact.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval  = 200;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if(this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size)
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
};

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'Black';
    ctx.fillText('Game Over! Your score is: ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'White';
    ctx.fillText('Game Over! Your score is: ' + score, canvas.width/2 + 5, canvas.height/2 + 5);
}

window.addEventListener('click', function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1); // recupero informazioni sul punto cliccato (x,y,height,width) = da dove e quanti pixel da cui prendere info
    const pixelColor = detectPixelColor.data; // recupero i valori rgb dall'evento click per poterli confrontare
    ravens.forEach(object =>{
        if(object.randomColors[0] === pixelColor[0] && object.randomColors[1] === pixelColor[1] && object.randomColors[2] === pixelColor[2]){
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
})

function animate(timestamp) { // timestamp sarà un valore numerico in millisecondi
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lasTime; // differenze fra timestamp - ritorna il valore in millisecondi del tempo che trascorre fra ogni frame
    lasTime = timestamp;
    timeToNextRaven += deltatime; // aggiungo la differenza per far crescere l'accumulatore
    if (timeToNextRaven > ravenInterval) { // quando l'accumulatore è maggiore dell'intervallo creo un nuovo Raven e azzero l'accumulatore
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width - b.width; // organizzo l'array di raven in base alla larghezza, così che i più grandi siano di fronte rispetto ai più piccoli
        })
    };
    drawScore();
    [...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion); // (ri)popolo l'array ravens di oggetti il cui markedForDeletion non è true
    explosions = explosions.filter(object => !object.markedForDeletion); 
    if(!gameOver) requestAnimationFrame(animate);
    else  drawGameOver();
}

animate(0);