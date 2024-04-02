export class Enemy{
    enemyWidth = 16;
    enemyHeight = 16;
    ctx;
    enemySprite;
    direccion=0;
    dx = 0;
    dy = 0;
    x = 0;
    y = 0;

    constructor(ctx){
        this.ctx=ctx;
        this.x=130;
       this.y=100;
        this.enemySprite = new Image();
        this.enemySprite.src = '../public/CharactersOverworld.png';
    }

    draw(){
        this.ctx.drawImage(
            this.enemySprite,
            9,
            85,
            this.enemyWidth,
            this.enemyHeight,
            this.x,
            this.y,
            this.enemyWidth,
            this.enemyHeight
        );
        //collider
        this.ctx.beginPath()
        this.ctx.rect(this.x,this.y,this.enemyWidth,this.enemyHeight);
        this.ctx.stroke();
    }
}