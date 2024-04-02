import { Map } from "./map.js";
export class Game { 
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.map = new Map(this.ctx);
    //cargamos map antes que player para conseguir los collider del mapa 
    this.update();
  }

  update() {
      this.map.update(); //pasar si esta colisionando
  }
}
