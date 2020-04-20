class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('bird', './assets/bird.png');
        this.load.image('bug', './assets/bug.png');
        this.load.image('fly', './assets/fly.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('boom', './assets/boom.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0x00FF00).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0xC70039).setOrigin(0, 0);
        // add bird (p1)
        this.p1bird = new bird(this, game.config.width/2 - 8, 431, 'bird').setScale(0.5, 0.5).setOrigin(0, 0);
        // add spaceships (x3)
        this.ship01 = new bug(this, game.config.width + 192, 132, 'bug', 0, 30).setOrigin(0,0);
        this.ship02 = new bug(this, game.config.width + 96, 196, 'bug', 0, 20).setOrigin(0,0);
        this.ship03 = new bug(this, game.config.width, 260, 'bug', 0, 10).setOrigin(0,0);
        this.ship04 = new fly(this, game.config.width, 130, 'fly', 0, 40).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);   
        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);   
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {               
            this.p1bird.update();         // update bird sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        } 
        // check collisions
        if (this.checkCollision(this.p1bird, this.ship04)) {
            this.p1bird.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p1bird, this.ship03)) {
            this.p1bird.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1bird, this.ship02)) {
            this.p1bird.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1bird, this.ship01)) {
            this.p1bird.reset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(bird, ship) {
        // simple AABB checking
        if (bird.x < ship.x + ship.width && 
            bird.x + bird.width > ship.x && 
            bird.y < ship.y + ship.height &&
            bird.height + bird.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'boom').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });       
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;  
        this.sound.play('sfx_swallow'); 
    }   
}