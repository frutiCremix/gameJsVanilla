import { Player } from "./player.js";
import {Map} from "./map.js"
export class Game {
    constructor(canvas){
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        this.width=canvas.width;
        this.height=canvas.height;
        this.p=new Player(this.ctx);
        this.map=new Map(this.ctx);
    }
    update(){
        this.p.update();
        let direccion=this.p.getDireccion();
        this.map.update(direccion,this.p.speed);
    }
    draw(){
        this.ctx.clearRect( 0,  0, this.width, this.height);
        this.ctx.fillStyle='#ddd';
        this.ctx.fillRect(0, 0, this.width,this.height);
        
        this.map.draw();
        this.p.draw();
    }
}