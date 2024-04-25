export class PlayfieldDecorator {
    constructor(game) {
        this.game = game;
        this.clouds = [];
        this.cloudAnimations = [];
        this.cloudCount = 5;

        // create the cloud sprites and their animation
        for (let count = 0; count < this.cloudCount; count++) {
            let c = new this.game.sprite(
                this.game.sprites.cloud,
                -200,
                (Math.random() * this.game.HEIGHT) 
            );
            c.scale = (Math.random()) + 0.5;
            c.flip_h = Math.round(Math.random()) === 1 ? true : false;
            this.clouds.push(c);

            let a = new this.game.animation(
                0,
                (Math.random() * 50000) + 20000,
                -200,
                this.game.WIDTH + 200,
                this.game.easings.Linear,
                true
            );
            this.cloudAnimations.push(a);
        }
    }

    update() {
        let currentTime = this.game.clock;
        for (let index = 0; index < this.cloudCount; index++) {
            let sprite = this.clouds[index];
            let animation = this.cloudAnimations[index];

            animation.update(currentTime);
            sprite.x = animation.currentValue;
        }
    }

    render() {
        this.clouds.forEach(c => {
            c.render(this.game.ctx);
        });
    }
}