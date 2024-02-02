/** @type {HTMLCanvasElement} */ // questa linea fa si che VSC sappia il tipo di progetto di modo da darci emmet corretti per i metodi usati

// recupero gli elementi necessari
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const enemiesNumber = 10;

// array di storage degli oggetti Enemy
const enemiesArray = [];

// creo variabile gameFrame per controllare velocità di movimento frame
let gameFrame = 0;

// istanzio classe Enemy
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = './assets/enemies/enemy1.png';
        //  this.speed = Math.random() * 4 - 2; // randomizzo la velocità in un range da - 2 a 4
        this.spriteWidth = 293; // larghezza spritesheet diviso numero frame così da avere larghezza di un singolo frame
        this.spriteHeight = 155; // altezza spritesheet diviso numero frame così da avere altezza di un singolo frame
        this.width = this.spriteWidth / 2.5; // larghezza relativa alla larghezza del frame di modo da non perdere proporzioni 
        this.height = this.spriteHeight / 2.5; // altezza relativa alla larghezza del frame di modo da non perdere proporzioni 
        this.x = Math.random() * (canvas.width - this.width); // randomizzo posizione iniziale asse x
        this.y = Math.random() * (canvas.height - this.height); // randomizzo posizione iniziale asse y
        this.frame = 0; // setto il frame a zero per poterlo ciclare e animare gli Enemy
        this.flapSpeed = Math.floor(Math.random() * 3 + 1); // creo randomizzatore velocità frame
    }
    // creo un metodo update per randomizzare il movimento
    update() {
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;
        // animo gli Enemy
        if(gameFrame % this.flapSpeed == 0){
            this.frame > 4 ? this.frame = 0 : this.frame++; // ciclo per animare i frame
        }
    }
    // visualizzare gli sfondi
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