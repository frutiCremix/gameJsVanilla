export class Player {
    playerWidth = 32;
    playerHeight = 32;
    ctx;
    direccion=0;
    dx = 0;
    dy = 0;
    x = 100;
    y = 200;
    speed = 3; // Velocidad del jugador
    keysPressed = {}; // Objeto para mantener el estado de las teclas presionadas

    constructor(ctx) {
        this.ctx = ctx;
        
        this.playerSprite = new Image();
        this.playerSprite.src = '../public/sprites.png';
       

        document.addEventListener('keydown', (e) => this.keyDownHandler(e));
        document.addEventListener('keyup', (e) => this.keyUpHandler(e));

        // Iniciar el bucle de animación
        
    }

    draw() {
        this.ctx.drawImage(
            this.playerSprite,
            this.playerWidth * 2,
            this.playerHeight * 2,
            this.playerWidth,
            this.playerHeight,
            this.x,
            this.y,
            this.playerWidth,
            this.playerHeight
        );
    }

    keyDownHandler(e) {
        this.keysPressed[e.keyCode] = true;
    }

    keyUpHandler(e) {
        this.keysPressed[e.keyCode] = false;
    }

    update() {
        // Actualizar la posición del jugador si las teclas están presionadas
        if (this.keysPressed[37]) { // Flecha izquierda
            this.dx = -this.speed;
        } else if (this.keysPressed[39]) { // Flecha derecha
            this.dx = this.speed;
        } else {
            this.dx = 0;
        }
        
        if (this.keysPressed[38]) { // Flecha arriba
            this.dy = -this.speed;
        } else if (this.keysPressed[40]) { // Flecha abajo
            this.dy = this.speed;
        } else {
            this.dy = 0;
        }

        //set direccion
        this.setDireccion(this.dx, this.dy);

        // Mover al jugador
        this.x += this.dx;
        this.y += this.dy;

        // Asegurarse de que el jugador no se salga del lienzo
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.ctx.canvas.width - this.playerWidth) {
            this.x = this.ctx.canvas.width - this.playerWidth;
        }
        
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > this.ctx.canvas.height - this.playerHeight) {
            this.y = this.ctx.canvas.height - this.playerHeight;
        }
  

    } 
   
    setDireccion(dx, dy) {
        if(dx > 0 && dy == 0){
            console.log("derecha")
            this.direccion=1;
        }else if(dx == 0 && dy > 0){
            console.log("abajo")
            this.direccion=2;
        }else if(dx < 0 && dy == 0){
            console.log("izquierda")
            this.direccion=3;
        }else if(dx == 0 && dy < 0){
            console.log("arriba")
            this.direccion=4;
        } else{this.direccion=0;}
    }
    getDireccion(){
        return this.direccion;
    }
}
