// recupero canva
const canvas = document.getElementById('canvas1'); 
// creo contesto grafico
const context = canvas.getContext('2d'); 

// setto default width & height
const CANVAS_WIDTH = canvas.width = 800; 
const CANVAS_HEIGHT = canvas.height = 700;

// setto velocità gioco
let gameSpeed = 5;

// creo i livelli di sfondo
const backgroundLayer1 = new Image (); 
backgroundLayer1.src = 'backgroundLayers/layer-1.png';

const backgroundLayer2 = new Image ();
backgroundLayer2.src = 'backgroundLayers/layer-2.png';

const backgroundLayer3 = new Image ();
backgroundLayer3.src = 'backgroundLayers/layer-3.png';

const backgroundLayer4 = new Image ();
backgroundLayer4.src = 'backgroundLayers/layer-4.png';

const backgroundLayer5 = new Image ();
backgroundLayer5.src = 'backgroundLayers/layer-5.png';

// recupero lo slider
const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener('change', function(event){
    gameSpeed = event.target.value;
    showGameSpeed.innerHTML = event.target.value;
})

class Layer { // istanzio oggetto classe
    constructor(image, speedModifier){ // passo argomenti di modifica al costruttore
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier; // velocità di ogni sfondo (velocità di gioco * modificatore di velocità)
    }
    update(){ // creo un metodo update per spostare e resettare gli sfondi orizzontalmente
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){ // se la coordinata X è minore o uguale di -2400
            this.x = 0; // riporto l'immagine a 0
        }
        this.x = this.x - this.speed; // ricalcolo posizione orizzontale immagini
    }
    draw(){ // visualizzare gli sfondi
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height) // x + width per far si che la seconda immagine inizi sempre alla fine della prima
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5]; // creo array di sfondi

// creo loop animazione
function animate(){
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // pulisco il canva
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    requestAnimationFrame(animate);
};
animate();