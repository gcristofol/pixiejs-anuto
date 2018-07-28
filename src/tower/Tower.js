const BULLET_SPEED = 10;
const RANGE = 85
let gu = new GameUtilities();

class BasicTower extends PIXI.Container {

  constructor(col, row) {
    super()

    this.bullets = [];
    this.ammo = 2;

    this.gun = new PIXI.Sprite(resources["images/towerDefense_tile206.png"].texture);
    this.rectangle = new PIXI.Graphics();

    var x = col * TILE_SIZE
    var y = row * TILE_SIZE

    // move the sprite to the center of the container
    this.gun.position.x = x + TILE_SIZE / 2;
    this.gun.position.y = y + TILE_SIZE / 2;

    this.gun.scale.x = .65
    this.gun.scale.y = .65

    this.rectangle.beginFill(0x33cc33);
    this.rectangle.drawRect(x, y, TILE_SIZE, TILE_SIZE);
    this.rectangle.endFill();

    this.addChild(this.rectangle)
    this.addChild(this.gun)

    this.gun.anchor.x = 0.5;
    this.gun.anchor.y = 0.5;
  }

  attack(enemy) {
    // aim: rotate mr tower a little
    var dist_Y = enemy.position.y - this.gun.position.y;
    var dist_X = enemy.position.x - this.gun.position.x;
    var angle = Math.atan2(dist_Y, dist_X);
    //var degrees = angle * 180 / Math.PI;
    //console.log("Rotate angle to aim enemy ", degrees);
    this.gun.rotation = angle

    // calculate distance
    //var dist = Math.sqrt( dist_Y*dist_Y + dist_X*dist_X );
    var dist = this.distance(this.gun.position, enemy.position);
    //console.log("Enemy at range ", dist);
    if (dist < RANGE) {
      //console.log("Enemy in range ", dist);
      this.shoot(this.gun.rotation, this.gun.position)
    }

    //move the bullets on the array
    for (var b = 0; b < this.bullets.length; b++) {
      this.bullets[b].position.x += Math.cos(this.bullets[b].rotation) * BULLET_SPEED;
      this.bullets[b].position.y += Math.sin(this.bullets[b].rotation) * BULLET_SPEED;

      //if it touches the enemy it goes away
      var c = this.distance(this.bullets[b].position, enemy.position)
      if (c < TILE_SIZE) {
        console.log("Make damage to enemy ");
        //remove bullet
        console.log("Remove carrot ", b);
        this.bullets[b].visible = false
        this.removeChild(this.bullets[b]);
        var index = this.bullets.indexOf(this.bullets[b]);
        this.bullets.splice(index, 1);
        console.log("carrots on screen ", this.bullets.length);
      }
    }
  }


  shoot(rotation, startPosition) {
    if (this.ammo > 0) {
      console.log("Ammo", this.ammo);
      console.log("Shoot carrot!");
      var bullet = new PIXI.Sprite(resources["images/towerDefense_tile251.png"].texture);
      bullet.position.x = startPosition.x;
      bullet.position.y = startPosition.y;
      bullet.rotation = rotation;
      this.addChild(bullet);
      this.bullets.push(bullet);
      this.ammo -= 1
    }
  }


  //TODO use pixijs utilities
  distance(positionSprite1, positionSprite2) {
    var a = positionSprite1.x - positionSprite2.x;
    var b = positionSprite1.y - positionSprite2.y;
    return Math.sqrt(a * a + b * b);
  }
}

class AnimatedTower extends BasicTower {
  constructor(col, row) {
    super()


    this.bullets = [];
    this.ammo = 3;

    let alienImages = ["images/bunny01.png", "images/bunny02.png", "images/bunny03.png", "images/bunny04.png"];
    let textureArray = [];

    for (let i = 0; i < 4; i++) {
      let texture = PIXI.Texture.fromImage(alienImages[i]);
      textureArray.push(texture);
    }

    this.gun = new PIXI.extras.AnimatedSprite(textureArray);

    this.gun.animationSpeed = 0.5;
    this.gun.loop = true;
    this.gun.play();

    var x = col * TILE_SIZE
    var y = row * TILE_SIZE

    // move the sprite to the center of the screen
    this.gun.position.x = x + TILE_SIZE / 2;
    this.gun.position.y = y + TILE_SIZE / 2;

    this.gun.scale.x = .9 //TODO remove when there are proper textures
    this.gun.scale.y = .7

    this.addChild(this.gun)

    this.gun.anchor.x = 0.5;
    this.gun.anchor.y = 0.5;

  }

  shoot(rotation, startPosition) {
    if (this.ammo > 0) {
      console.log("Animaton");
      super.shoot(rotation, startPosition)
    }
  }
}