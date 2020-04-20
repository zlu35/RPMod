// bird prefab
class bird extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false;//check firing status
      this.sfxbird = scene.sound.add('sfx_bird'); // add rocket sfx
    }

    update(){
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x>=47){
                this.x -= 2;
            }else if (keyRIGHT.isDown && this.x<=578){
                this.x += 2;
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxbird.play();  // play sfx
        }
        if(this.isFiring && this.y >=108){
            this.y -=2;
        }
        if (this.y<=108) {
            this.isFiring = false;
            this.y = 431;
        }
    }

    reset(){
        this.isFiring =false;
        this.y = 431;
    }
}