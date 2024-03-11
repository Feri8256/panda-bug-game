import { Idle, Climb, Attack, Fail } from "./playerStates.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.w = 90;
        this.h = 90;

        this.spriteYoffset = 85;
        this.spriteXoffset = 60;
        this.spriteXoffsetFaceLeft = 30;

        this.attacking = false;

        this.poleIndex = 0;
        this.lastHorizontalMovementTimestamp = 0;

        this.collisionBox = {
            x: 0,
            y: 0,
            w: 90,
            h: 170
        };

        this.playerStates = [
            new Idle(this),
            new Climb(this),
            new Attack(this),
            new Fail(this),
        ];

        this.takeOverControl = false;

        this.failAnimations = {
            fallY: null
        }

    }

    update() {
        this.currentState.handleInput(this.game.inputHandler);

        // When the player fails, the control is taken away from anything else
        if (this.takeOverControl) {
            this.failAnimations.fallY.update(this.game.clock);
            this.game.playerSpriteAnimation.update(this.game.clock);

            this.y = this.failAnimations.fallY.currentValue;
            this.game.playerSpriteAnimation.y = this.y + this.spriteYoffset;
            return;
        }

        if ((this.poleIndex + 1) % 2 === 0) {
            this.game.playerSpriteAnimation.flip_h = true;
            this.game.playerSpriteAnimation.x = this.x + this.spriteXoffsetFaceLeft
        } 
        else {
            this.game.playerSpriteAnimation.x = this.x + this.spriteXoffset;
            this.game.playerSpriteAnimation.flip_h = false;
        } 
        this.game.playerSpriteAnimation.y = this.y + this.spriteYoffset;


        this.collisionBox.x = this.x;
        this.collisionBox.y = this.y;

        this.game.playerSpriteAnimation.update(this.game.clock);

    }

    render() {
        this.game.playerSpriteAnimation.draw(this.game.ctx);
    }

    /**
     * The player enters a state
     * @param {String} state name of the state
     */
    setState(state) {
        this.currentState = this.playerStates[state];
        this.currentState.enter();
    }

    /**
     * Setting fail state, and creating the animation for it
     * @returns 
     */
    setFailState() {
        if(this.takeOverControl) return;
        this.takeOverControl = true;
        this.setState(3); // fail

        let startTime = this.game.clock;
        let endTime = startTime + this.game.CONSTANTS.player_fall_duration_ms;

        let fallY = new this.game.animation(
            startTime,
            endTime,
            this.y,
            this.y + this.game.HEIGHT,
            this.game.easings.BackIn
        );

        this.failAnimations.fallY = fallY;

        this.game.gameOver();
    }

    reset() {
        this.lastHorizontalMovementTimestamp = 0;
        this.takeOverControl = false;

        this.failAnimations = {
            fallY: null
        }
    }
}
