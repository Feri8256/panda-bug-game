export class Enemy {
    constructor(game, x, y, poleIndex) {
        this.takeOverControl = false;
        this.markedForDeletion = false;
        this.markForDeleteAfter = 0;
        this.game = game;
        this.x = x;
        this.y = y;
        this.poleIndex = poleIndex;
        this.randomSprite = this.game.sprites.bugs[Math.floor(Math.random() * this.game.sprites.bugs.length)];
        this.sprite = new this.game.sprite(this.randomSprite);

        this.hitVFX = null;

        this.spriteYOffset = 25;

        this.shouldFlip = (this.poleIndex + 1) % 2 === 0;

        this.sprite.flip_h = this.shouldFlip;
        this.sprite.scale = 0.4;

        this.fallAnimations = {
            fallY: null,
            fallX: null,
            fade: null,
            rotate: null
        };

        this.collisionBox = {
            x: this.x,
            y: this.y,
            w: 40,
            h: 65
        }

        if (!this.shouldFlip) {
            this.collisionBox.x = this.x - this.collisionBox.w;
        } else {
            this.collisionBox.x = this.x;
        }

        this.colliding = false;
    }
    
    update() {
        // Enemy collided with player, so the fail animations taking over the control of the sprite
        if (this.takeOverControl){
            this.y = this.fallAnimations.fallY.currentValue;
            this.sprite.opacity = this.fallAnimations.fade.currentValue;
            this.sprite.rotation = this.fallAnimations.rotate.currentValue;
            this.sprite.x = this.fallAnimations.fallX.currentValue;


            this.fallAnimations.fallY.update(this.game.clock);
            this.fallAnimations.fade.update(this.game.clock);
            this.fallAnimations.rotate.update(this.game.clock);
            this.fallAnimations.fallX.update(this.game.clock);
            this.hitVFX.update();

            this.sprite.y = this.y + this.spriteYOffset;

            if(this.game.clock > this.markForDeleteAfter) this.markedForDeletion = true;
            return;
        };

        this.sprite.x = this.x;
        this.sprite.y = this.y + this.spriteYOffset;
        this.collisionBox.y = this.y;

        this.colliding = this.game.playfield.checkCollision(this.collisionBox, this.game.player.collisionBox);

        if (this.colliding && this.game.player.attacking) this.startFallAnimation();
        if (this.colliding && !this.game.player.attacking) this.game.player.setFailState();
    }

    render() {
        this.sprite.render(this.game.ctx);
        if (this.takeOverControl) this.hitVFX.render();
    }

    /**
     * Animation of the enemy when it's attacked by the player
     * play a hit sound effect and increment the score
     */
    startFallAnimation() {
        this.takeOverControl = true;
        this.game.scoreManager.addToScore();
        
        let startTime = this.game.clock;
        let endTime = this.game.clock + this.game.CONSTANTS.enemy_fall_duration_ms;

        this.markForDeleteAfter = endTime;

        this.fallAnimations.fallY = new this.game.animation(
            startTime,
            endTime,
            this.y,
            this.y + 300,
            this.game.easings.SineIn
        );

        this.fallAnimations.fade = new this.game.animation(
            startTime,
            endTime,
            1,
            0,
            this.game.easings.Linear
        );

        this.fallAnimations.rotate = new this.game.animation(
            startTime,
            endTime,
            0,
            (Math.random() * (Math.PI * 2)) - Math.PI,
            this.game.easings.Linear
        );

        this.fallAnimations.fallX = new this.game.animation(
            startTime,
            endTime,
            this.x,
            this.x + (Math.random() * 400) - 200,
            this.game.easings.Linear
        );

        let scaleVFX = new this.game.animation(
            startTime,
            startTime + 250,
            0.1,
            0.5,
            this.game.easings.QuartOut
        );

        let fadeVFX = new this.game.animation(
            startTime,
            startTime + 250,
            1,
            0,
            this.game.easings.SineOut
        );

        this.hitVFX = new this.game.hitVFX(this.game, this.x, this.y, scaleVFX, fadeVFX);

        this.game.audioManager.playAudioClip(`HIT_${Math.floor(Math.random()*4)}`);
    }
}
