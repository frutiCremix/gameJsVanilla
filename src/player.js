export class Player {
    playerWidth = 16;
    playerHeight = 16;
    ctx;
    playerSprite;
    direccion=0;
    dx = 0;
    dy = 0;
    x = 0;
    y = 0;
    life=100;

    constructor(ctx) {
        this.ctx = ctx;
       this.x=this.ctx.canvas.width/2-(this.playerWidth/2);
       this.y=this.ctx.canvas.height/2-(this.playerHeight/2);
        this.playerSprite = new Image();
        this.playerSprite.src = '../public/CharactersOverworld.png';
        document.addEventListener("keydown", (e) => this.keyDownHandler(e));
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
        //collider
        this.ctx.beginPath()
        this.ctx.rect(this.x,this.y,this.playerWidth,this.playerHeight);
        this.ctx.stroke();
        this.ctx.beginPath();
    this.ctx.fillStyle="green"
    if(this.life<40){
        this.ctx.fillStyle="red"
    }
    this.ctx.fillRect(this.x, this.y+this.playerHeight, this.playerWidth*this.life/100, 5);
    this.ctx.closePath();
    }

   

    update() {
    } 
    getDireccion(){
        return this.direccion;
    }
    
    setDireccion(direccion){
        this.direccion = direccion;
    }
    


    keyDownHandler(e){
        if(e.keyCode==65){
            console.log("ataca")
        }
    }
    getLife(){
        return this.life;
      }
      setLife(life){
        this.life=life;
      }
}
