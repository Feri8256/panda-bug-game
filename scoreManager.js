/**
 * Scoring system and its displaying
 */
export class ScoreManager {
    constructor(game) {
        this.game = game;

        this.scoreEffectDurationMs = 500;
        this.comboEffectDurationMs = 200;

        this.score = 0;
        this.displayScore = 0;
        this.prevScore = 0;

        this.combo = 0;
        this.highestCombo = 0;
        this.currentIncrement = 5;
        this.comboLoss = false;

        this.scoreFrames = [];

        this.frameElements = 3;

        this.textSizePx = 38;
        this.textPositionY = 64;
        this.scoreTextPositionX = this.game.WIDTH / this.frameElements;
        this.comboTextPositionX = (this.scoreTextPositionX * 2) - 36;

        this.currentComboScale = this.textSizePx;
        this.currentIncrementPositionY = this.textPositionY;

        for (let index = 1; index < this.frameElements; index++) {
            let s = new this.game.sprite(this.game.sprites.scoreFrame);
            s.scale = 1;
            s.x = (this.game.WIDTH / this.frameElements) * index;
            s.y = 50;
            this.scoreFrames.push(s);
        }

        this.comboSprite = new this.game.sprite(this.game.sprites.bugs[2]);
        this.comboSprite.scale = 0.23;
        this.comboSprite.rotation = - Math.PI * 1.5
        this.comboSprite.x = this.comboTextPositionX - 30;
        this.comboSprite.y = this.textPositionY - 8;

        this.scoreEffect = new this.game.animation(
            0,
            0,
            0,
            0,
            this.game.easings.Linear
        );

        this.comboEffect = new this.game.animation(
            0,
            0,
            this.textSizePx,
            this.textSizePx,
            this.game.easings.Linear
        );

        this.incrementEffect = new this.game.animation(
            0,
            0,
            this.textPositionY,
            this.textPositionY,
            this.game.easings.Linear
        );
    }

    calculate() {
        this.score = this.score + this.currentIncrement;
    }

    update() {
        this.scoreEffect.update(this.game.clock);
        this.comboEffect.update(this.game.clock);
        this.incrementEffect.update(this.game.clock);
        this.displayScore = Math.round(this.scoreEffect.currentValue);
        this.currentComboScale = this.comboEffect.currentValue;
        this.currentIncrementPositionY = this.incrementEffect.currentValue;
    }

    startScoreEffect() {
        this.scoreEffect = new this.game.animation(
            this.game.clock,
            this.game.clock + this.scoreEffectDurationMs,
            this.prevScore,
            this.score,
            this.game.easings.ExpoOut
        );
    }

    startComboEffect() {
        this.comboEffect = new this.game.animation(
            this.game.clock,
            this.game.clock + this.comboEffectDurationMs,
            this.textSizePx + 7,
            this.textSizePx,
            this.game.easings.SineOut
        );
    }

    startIncrementEffect() {
        this.incrementEffect = new this.game.animation(
            this.game.clock,
            this.game.clock + this.scoreEffectDurationMs,
            this.textPositionY * 2,
            this.textPositionY,
            this.game.easings.CubicIn
        );
    }

    render() {
        this.game.ctx.save();

        // increment popup
        this.game.ctx.textAlign = "center";
        this.game.ctx.font = `${this.textSizePx}px Arial`;
        this.game.ctx.strokeStyle = "#fff";
        this.game.ctx.fillStyle = "#008800";
        this.game.ctx.fillText(`+${this.currentIncrement}`, this.scoreTextPositionX, this.currentIncrementPositionY);
        this.game.ctx.strokeText(`+${this.currentIncrement}`, this.scoreTextPositionX, this.currentIncrementPositionY);

        // score
        this.scoreFrames.forEach(e => e.render(this.game.ctx));
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.font = `${this.textSizePx}px Arial`;
        this.game.ctx.fillText(this.displayScore, this.scoreTextPositionX, this.textPositionY);

        // combo sprite
        this.comboSprite.render(this.game.ctx);

        // combo number
        this.game.ctx.fillStyle = this.comboLoss ? "#f00" : "#fff";
        this.game.ctx.textAlign = "left";
        this.game.ctx.font = `${this.currentComboScale}px Arial`;
        this.game.ctx.fillText(`x${this.combo}`, this.comboTextPositionX, this.textPositionY);
        this.game.ctx.restore();
    }

    addToScore() {
        this.prevScore = this.score;

        this.combo++;
        if (this.combo > 0 && this.combo % 50 === 0) this.currentIncrement += 5;
        this.comboLoss = false;

        this.calculate();

        this.startScoreEffect();
        this.startComboEffect();
        this.startIncrementEffect();
    }

    resetScore() {
        this.score = 0;
        this.displayScore = 0;
        this.prevScore = 0;
        this.scoreEffect = new this.game.animation(
            0,
            0,
            0,
            0,
            this.game.easings.Linear
        );
    }

    resetCombo() {
        this.combo = 0;
        this.currentIncrement = 5;
        this.comboLoss = false;
    }

    breakCombo() {
        this.combo = 0;
        this.currentIncrement = 5;
        this.comboLoss = true;
    }

    reset() {
        this.resetScore();
        this.resetCombo();
    }
}