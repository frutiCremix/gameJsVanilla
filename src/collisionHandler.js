export class CollisionHandler {

  constructor(player, enemyActive, mapTilesCollider) {
    this.player = player;
    this.mapTilesCollider = mapTilesCollider;
    this.enemyActive = enemyActive;//array
  }
  checkPlayerTileMapCollision() {
    const playerLeft = this.player.x;
    const playerRight = this.player.x + this.player.playerWidth;
    const playerTop = this.player.y;
    const playerBottom = this.player.y + this.player.playerHeight;

    for (const tile of this.mapTilesCollider) {
      if (tile.collider === true) {
        // Calcular las posiciones de los bordes del azulejo
        const tileLeft = tile.x;
        const tileRight = tile.x + tile.width;
        const tileTop = tile.y;
        const tileBottom = tile.y + tile.height;
        if (
          playerRight >= tileLeft &&
          playerLeft <= tileRight &&
          playerBottom >= tileTop &&
          playerTop <= tileBottom
        ) {
          return true;
        }
      }
    }
    return false;
  }
  checkPlayerEnemyCollision() {
    const playerLeft = this.player.x;
    const playerRight = this.player.x + this.player.playerWidth;
    const playerTop = this.player.y;
    const playerBottom = this.player.y + this.player.playerHeight;
    
    for(let enemy of this.enemyActive){
        const enemyLeft = enemy.x;
        const enemyRight = enemy.x + enemy.enemyWidth;
        const enemyTop = enemy.y;
        const enemyBottom = enemy.y + enemy.enemyHeight;
        if (
            playerRight >= enemyLeft &&
            playerLeft <= enemyRight &&
            playerBottom >= enemyTop &&
            playerTop <= enemyBottom
          ){
            return enemy;
      }
      
    }return null;
}
}
