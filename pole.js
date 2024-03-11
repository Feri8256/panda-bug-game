export class Pole {
    constructor(game, x, y, w, h) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.lighterColor = "#00ba45";
        this.darkerColor = "#005522";

        this.gradient = this.game.ctx.createLinearGradient(this.x, 0,  this.x + this.w, 0);
        this.gradient.addColorStop(0, this.darkerColor);
        this.gradient.addColorStop(0.5, this.lighterColor);
        this.gradient.addColorStop(1, this.darkerColor);

    }

    render() {
        this.game.ctx.save();
        this.game.ctx.fillStyle = this.gradient;
        this.game.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.game.ctx.restore();
    }
}
