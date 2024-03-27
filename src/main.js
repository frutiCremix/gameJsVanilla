import { Game } from "./game.js";

let canvas=document.getElementById('root');
canvas.width=160;
canvas.height=160;
const game=new Game(canvas);

function update(){
    game.update();
    game.draw();
    requestAnimationFrame(update);
}

update();
