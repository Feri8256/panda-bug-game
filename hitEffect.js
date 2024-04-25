export class HitEffect {
    constructor(game, x, y, scaleAnimationObject, fadeAnimationObject) {
        this.game = game;

        this.x = x;
        this.y = y;

        this.scaleAnimationObject = scaleAnimationObject;
        this.fadeAnimationObject = fadeAnimationObject;

        // Selecting two random sprite for the hit effect. The two can't be the same
        let spritesArr = this.game.sprites.hitEffects;
        let max = spritesArr.length;
        let rdmIndexA = Math.floor( Math.random() * max);
        let rdmIndexB = Math.floor( Math.random() * max);
        while (rdmIndexA === rdmIndexB) rdmIndexB = Math.floor( Math.random() * max);

        // Setting up the sprites for the hit effect
        this.sprites = [];

        let spriteA = new game.sprite(spritesArr[rdmIndexA]);
        spriteA.additiveColor = true;
        spriteA.x = this.x;
        spriteA.y = this.y;
        spriteA.scale = this.scaleAnimationObject.startValue;
        spriteA.opacity = this.fadeAnimationObject.startValue;

        let spriteB = new game.sprite(spritesArr[rdmIndexB]);
        spriteB.additiveColor = true;
        spriteB.x = this.x;
        spriteB.y = this.y;
        spriteB.scale = this.scaleAnimationObject.startValue;
        spriteB.opacity = this.fadeAnimationObject.startValue;

        this.sprites.push(spriteA);
        this.sprites.push(spriteB);

    }
    update() {
        this.scaleAnimationObject.update(this.game.clock);
        this.fadeAnimationObject.update(this.game.clock);

        this.sprites.forEach(s => {
            s.scale = this.scaleAnimationObject.currentValue;
            s.opacity = this.fadeAnimationObject.currentValue;
        });
    }

    render() {
        this.sprites.forEach(s => {
            s.render(this.game.ctx);
        });
    }
}