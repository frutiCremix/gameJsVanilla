import { Player } from "./player.js";
import {Map} from "./map.js"
export class Game {
    p;
    constructor(canvas){
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        this.width=canvas.width;
        this.height=canvas.height;
        this.map=new Map(this.ctx);
        //cargamos map antes que player para conseguir los collider del mapa
        this.map.load((tileMap)=>{
           
            this.p = new Player(this.ctx,tileMap);
            
            this.update()    
        })
        
        
    }
    update(){
        if (this.p) {
            this.p.update();
            let direccion=this.p.getDireccion();
            this.map.update(direccion,this.p.speed);
            this.draw();
        }
    }
    draw(){
        this.ctx.clearRect( 0,  0, this.width, this.height);
        this.ctx.fillStyle='#ddd';
        this.ctx.fillRect(0, 0, this.width,this.height);
        
        this.map.draw();
        if (this.p) {
            this.p.draw();
        }
    }

}