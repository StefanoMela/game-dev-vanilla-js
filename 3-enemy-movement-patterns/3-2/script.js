/** @type {HTMLCanvasElement} */ // questa linea fa si che VSC sappia il tipo di progetto di modo da darci emmet corretti per i metodi usati

// recupero gli elementi necessari
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const enemiesNumber = 40;

// array di storage degli oggetti Enemy
const enemiesArray = [];

// creo variabile gameFrame per controllare velocità di movimento frame
let gameFrame = 0;

// istanzio classe Enemy
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = './assets/enemies/enemy2.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = 0; // creo proprietà angolo per creare movimento verticale nemici
        this.angleSpeed = Math.random() * 0.2; // creo proprietà per poter randomizzare la velocità di movimento verticale
        this.curve = Math.random() * 7; // creo un numero random per randomizzare la grandezza della curva di ogni Enemy
    }
    // creo un metodo update per randomizzare il movimento
    update() {
        this.x -= this.speed;
        this.y += this.curve * Math.sin(this.angle); // calcolo il seno dell'angolo
        this.angle += this.angleSpeed; // incremento gradualmente il seno dell'angolo
        if(this.x + this.width < 0) this.x = canvas.width; // if per movimento infinito da dx a sx 
        // animo gli Enemies
        if(gameFrame % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++; // ciclo per animare i frame
        }
    }
    // visualizzare Enemies
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

// ciclo for per creare e salvare in un nuovo array gli oggetti Enemy
for(let i = 0; i < enemiesNumber; i++){
    enemiesArray.push(new Enemy());
}

// creo loop animazione
function animate() {
    // pulisco il canva
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ciclo per creare e visualizzare gli oggetti Enemy
    enemiesArray.forEach(enemy =>{
        enemy.update();
        enemy.draw();
    })
    gameFrame++;
    requestAnimationFrame(animate);
};
animate();