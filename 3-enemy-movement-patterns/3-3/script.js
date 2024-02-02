/** @type {HTMLCanvasElement} */ // questa linea fa si che VSC sappia il tipo di progetto di modo da darci emmet corretti per i metodi usati

// recupero gli elementi necessari
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const enemiesNumber = 250;

const enemiesArray = [];

let gameFrame = 0;

// istanzio classe Enemy
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = './assets/enemies/enemy3.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = 0; // determina la posizione di partenza degli Enemies nella curva
        this.angleSpeed = Math.random() * 2 + 0.5; // determina quanto veloce aumenta l'angolo a linea 35
    //  this.curve = Math.random() * 200 + 50; // determina il raggio della curva sulla quale si muovono i personaggi 
    }
    update() {
        this.x = canvas.width / 2 * Math.sin(this.angle * Math.PI / 90) + (canvas.width / 2 - this.width / 2);
        this.y = canvas.height / 2 * Math.cos(this.angle * Math.PI / 270) + (canvas.height / 2 - this.height / 2);
        this.angle += this.angleSpeed;
        if (this.x + this.width < 0) this.x = canvas.width;
        // animo gli Enemies
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; // ciclo per animare i frame
        }
    }
    // visualizzare Enemies
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

// ciclo for per creare e salvare in un nuovo array gli oggetti Enemy
for (let i = 0; i < enemiesNumber; i++) {
    enemiesArray.push(new Enemy());
}

// creo loop animazione
function animate() {
    // pulisco il canva
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ciclo per creare e visualizzare gli oggetti Enemy
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
    gameFrame++;
    requestAnimationFrame(animate);
};
animate();