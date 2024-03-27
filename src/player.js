export class Player {
    playerWidth = 16;
    playerHeight = 16;
    ctx;
    direccion=0;
    dx = 0;
    dy = 0;
    x = 100;
    y = 200;
    speed = 1; // Velocidad del jugador
    keysPressed = {}; // Objeto para mantener el estado de las teclas presionadas

    mapcollider;

    constructor(ctx,mapcollider) {
        this.ctx = ctx;
        this.mapcollider = mapcollider;
        this.playerSprite = new Image();
        this.playerSprite.src = '../public/CharactersOverworld.png';
       
        document.addEventListener('keydown', (e) => this.keyDownHandler(e));
        document.addEventListener('keyup', (e) => this.keyUpHandler(e));
      
    }

    draw() {
        this.ctx.drawImage(
            this.playerSprite,
            9,
            34,
            this.playerWidth,
            this.playerHeight,
            this.x,
            this.y,
            this.playerWidth,
            this.playerHeight
        );
        this.ctx.beginPath()
        this.ctx.rect(this.x,this.y,this.playerWidth,this.playerHeight);
        this.ctx.stroke();
    }

    keyDownHandler(e) {
       
       
            this.keysPressed[e.keyCode] = true;
    }


    keyUpHandler(e) {
        this.keysPressed[e.keyCode] = false;
    }

    update() {
        
            if (this.keysPressed[37]&& !this.checkCollisions()) { // Flecha izquierda
                this.dx = -this.speed;
            } else if (this.keysPressed[39]&& !this.checkCollisions()) { // Flecha derecha
                this.dx = this.speed;
            } else {
                this.dx = 0;
            }
            
            if (this.keysPressed[38]&&!this.checkCollisions()) { // Flecha arriba
                this.dy = -this.speed;
            } else if (this.keysPressed[40]&&!this.checkCollisions()) { // Flecha abajo
                this.dy = this.speed;
            } else {
                this.dy = 0;
            }
        // Actualizar la posición del jugador si las teclas están presionadas
        

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
        this.checkCollisions();

    } 
    setDireccion(dx, dy) {
        if(dx > 0 && dy == 0){
            console.log("derecha");
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

    checkCollisions() {
        const playerLeft = this.x;
        const playerRight = this.x + this.playerWidth;
        const playerTop = this.y;
        const playerBottom = this.y + this.playerHeight;
        let collided = false;
    
        for (const tile of this.mapcollider) {
            if (tile.collider === true) {
                // Calcular las posiciones de los bordes del azulejo
                const tileLeft = tile.x;
                const tileRight = tile.x + tile.width;
                const tileTop = tile.y;
                const tileBottom = tile.y + tile.height;
    
                // Verificar si hay superposición entre el jugador y el azulejo
                if (
                    playerRight > tileLeft &&
                    playerLeft < tileRight &&
                    playerBottom > tileTop &&
                    playerTop < tileBottom
                ) {
                    collided = true;
    
                    // Ajustar la posición del jugador para que esté justo al borde del azulejo
                    const overlapLeft = playerRight - tileLeft;
                    const overlapRight = tileRight - playerLeft;
                    const overlapTop = playerBottom - tileTop;
                    const overlapBottom = tileBottom - playerTop;
                    //los bordes que colisionan son los que tienen menor distancia
                    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
                    if (minOverlap === overlapLeft) {
                        this.x -= overlapLeft;
                    } else if (minOverlap === overlapRight) {
                        this.x += overlapRight;
                    } else if (minOverlap === overlapTop) {
                        this.y -= overlapTop;
                    } else if (minOverlap === overlapBottom) {
                        this.y += overlapBottom;
                    }
                    
                    break;
                }
            }
        }
    
        return collided;
    }
    
    
}
