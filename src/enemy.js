export class Enemy {
  enemyWidth = 16;
  enemyHeight = 16;
  ctx;
  enemySprite;
  direccion = 0;
  dx = 0;
  dy = 0;
  x = 0;
  y = 0;
  life=100;

  constructor(ctx,x,y) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.enemySprite = new Image();
    this.enemySprite.src = "../public/CharactersOverworld.png";
  }

  draw() {
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
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.enemyWidth, this.enemyHeight);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.fillStyle="green"
    if(this.life<40){
        this.ctx.fillStyle="red"
    }
    this.ctx.fillRect(this.x, this.y+this.enemyHeight, this.enemyWidth*this.life/100, 5);
    this.ctx.closePath();
  }


  getLife(){
    return this.life;
  }
  setLife(life){
    this.life=life;
  }
}
