/** @type {HTMLCanvasElement} */

// recupero gli elementi necessari
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;

// array storage frame animazione
const explosions = [];

// salvo la posizione del Canva con getBoundingClientRect
// metodo che ritorno un oggetto con informazioni sulla taglia e la posizione di un elemento relativamente al viewport
let canvasPosition = canvas.getBoundingClientRect();


// istanzio classe Explosion
class Explosion {
    constructor(x, y) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.x = x; 
        this.y = y;
        this.image = new Image();
        this.image.src = 'assets/boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2; // salvo un numero random fra 0 e 6.2 che è il radiante di un angolo di 360°
        this.sound = new Audio();
        this.sound.src = 'assets/fire-impact.wav';
    }
    update() {
        if(this.frame === 0) this.sound.play(); // aggiungo il suono 
        this.timer++;
        if (this.timer % 10 === 0) { // rallento l'animazione aggiornando il frame ogni 10 iterazioni
            this.frame++;
        }
    }
    /* uso i metodi built-in save() & restore() per ruotare ogni primo frame esplosione in modo casuale
    */
    draw() {
        ctx.save(); // salvo posizione iniziale cosi che il resto del codice valga per una sola iterazione
        ctx.translate(this.x, this.y); // 
        ctx.rotate(this.angle) // rotate aspetta come argomento un radiante
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height); // offset posizione x - larghezza/2 per centrare l'immagine al click del puntatore
        ctx.restore(); // riporto il contex allo stato iniziale
    }
};

/*

window.addEventListener('click', function (e) {

disegno un rettangolo al click del mouse nel punto preciso del click:

ctx.fillRect(e.x - canvasPosition.left - 25, e.y - canvasPosition.top - 25, 50, 50);

ex, ey = coordinate evento click
- canvas = offset con canvasPosition meno la metà di altezza e larghezza del rettangolo

});
 
window.addEventListener('mousemove', function (e) {
    createAnimation(e)
});
*/

window.addEventListener('click', function (e) {
    createAnimation(e)
});


function createAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].frame > 4) {
            explosions.splice(i, 1);
        }
    };
    requestAnimationFrame(animate);
};

animate();