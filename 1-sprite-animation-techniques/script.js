let playerState = 'idle'; // setta tipo animazione iniziale poi lo dinamizzo tramite la scelta del dropdown
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(event){
    playerState = event.target.value;
})

const canvas = document.getElementById('canvas1'); // recupero elemnto canva
const context = canvas.getContext('2d'); // creo il contesto di disegno
/*
il metodo integrato getContext può essere chiamato solo su un elemento che contiene un riferimento a un elemento canvas;
l'argomento 2d (oppure webgl per un contesto 3d) è necessario per creare un contesto di disegno 2d o 3d tramite un oggetto che contiene tutte le proprietà e metodi necessari per il disegno;
*/
const CANVAS_WIDTH = canvas.width = 600; // setto larghezza e altezza perché altrimenti il default è 300 x 150
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image(); // creo una classe immagine giocatore 
playerImage.src = 'img/shadow_dog.png'; // assegno lo spritesheet alla classe
const spriteWidth = 575;   // larghezza dello spritesheet divisa per le colonne presenti nello stesso
const spriteHeight = 523; // altezza spritesheet divisa per righe dello stesso
let gameFrame = 0;
const staggerFrames = 5;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    },
];

animationStates.forEach((state, index)=>{ // loop che calcola le coordinate del frame dell'animazione (arg1 = variabile che rappresenta ogni elemento dell'array)
let frames = {
    loc: [],
}
for (let j = 0; j < state.frames; j++){ // loop per calcolare dinamicamente le posizioni X e Y ciclando lo spritesheet
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight; 
    frames.loc.push({x: positionX, y: positionY});
}
spriteAnimations[state.name] = frames; // recupero spriteAnimations e a ogni iterazione creo un nuovo oggetto frames con posizione
});

function animate() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // pulisco tutta l'area del canva da posizione 0,0 per tutta l'area del canva
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    
    context.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight) //
    gameFrame++;
    requestAnimationFrame(animate);
};

animate();

/**

* drawImage method => accetta 3,5,9 argomenti a seconda del livello di controllo necessario all'immagine che stiamo disegnando

* drawImage(image, 0, 0) => Stampa l'immagine a partire dall'angolo sx alto dello spritesheet (coordinate 0,0)

* drawImage(image, 0, 0, imageWidth, imageHeight) => aggiungiamo argomenti per altezza e larghezza in modo da poter modificare l'immagine interna al canva

* drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH)

* image, sourceX, sourceY, sourceWidth, sourceHeight => coordinate che determinano l'area rettangolare da croppare dallo spritesheet

* destinationX, destinationY, destinationWidth, destinationHeight => coordinate del nostro canva su cui visualizzare immagine

* se facciamo Numero*sX maggiore è N maggiore sarà lo spostamento del crop verso destra nella riga dello sprite [come negli array la prima posizione è 0]

* se facciamo Numero*sY maggiore è N maggiore sarà lo spostamento del crop verso il basso nelle colonne dello sprite [come negli array la prima posizione è 0]

* per animare gli sprite basta IF ma bisogna ricordarsi che l'indice primo è lo 0; 

* gameFrame && staggerFrame sono in combinazione per rallentare l'animazione. Maggiore lo stagger minore la velocità di animazione

*/