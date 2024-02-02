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
const backgroundLayer1 = new Image();
backgroundLayer1.src = 'backgroundLayers/layer-1.png';

const backgroundLayer2 = new Image();
backgroundLayer2.src = 'backgroundLayers/layer-2.png';

const backgroundLayer3 = new Image();
backgroundLayer3.src = 'backgroundLayers/layer-3.png';

const backgroundLayer4 = new Image();
backgroundLayer4.src = 'backgroundLayers/layer-4.png';

const backgroundLayer5 = new Image();
backgroundLayer5.src = 'backgroundLayers/layer-5.png';

// listener per il caricamento della pagina
window.addEventListener('load', function () {

    // recupero lo slider
    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;
    slider.addEventListener('change', function (event) {
        gameSpeed = event.target.value;
        showGameSpeed.innerHTML = event.target.value;
    })

    // istanzio oggetto classe
    class Layer {
        // passo argomenti di modifica al costruttore e istanzio l'oggetto
        constructor(image, speedModifier) {
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier; // velocità di ogni sfondo (velocità di gioco * modificatore di velocità)
        }
        // creo un metodo update per spostare e resettare gli sfondi orizzontalmente
        update() {
            this.speed = gameSpeed * this.speedModifier;
            if (this.x <= -this.width) { // se la coordinata X è minore o uguale di -2400
                this.x = 0; // riporto l'immagine a 0
            }
            this.x = this.x - this.speed; // ricalcolo posizione orizzontale immagini
        }
        // visualizzare gli sfondi
        draw() {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height) // x + width per far si che la seconda immagine inizi sempre alla fine della prima
        }
    }

    // istanzio un oggetto Layer per ogni sfondo, passando immagine e modificatore velocità
    const layer1 = new Layer(backgroundLayer1, 0.2);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.6);
    const layer4 = new Layer(backgroundLayer4, 0.8);
    const layer5 = new Layer(backgroundLayer5, 1);

    // creo array di sfondi
    const gameObjects = [layer1, layer2, layer3, layer4, layer5];

    // creo loop animazione
    function animate() {
        // pulisco il canva
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // loop di creazione e visualizzazione sfondi
        gameObjects.forEach(object => {
            object.update();
            object.draw();
        });
        requestAnimationFrame(animate);
    };
    animate();

});