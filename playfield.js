export class Playfield {
    constructor(game) {
        this.game = game;

        this.poles = [];
        for (let i = 1; i < this.game.CONSTANTS.pole_count+1; i++) {
            this.poles.push(
                new this.game.pole(
                    this.game,
                    ((this.game.WIDTH / (this.game.CONSTANTS.pole_count+1)) * i) - (this.game.CONSTANTS.pole_width / 2), 
                    0, 
                    this.game.CONSTANTS.pole_width, 
                    this.game.HEIGHT
                )
            )
        }

        this.horizontalSnapLocations = [];
        this.poles.forEach(pole => {
            this.horizontalSnapLocations.push(pole.x);
            this.horizontalSnapLocations.push(pole.x + pole.w);
        });

        console.log(this.horizontalSnapLocations);
        this.initPlayerStart();
    }

    /**
     * AABB (axis-aligned bounding box) collision detection algorithm
     * @param {*} a_collider 
     * @param {*} b_collider 
     * @returns {Boolean} are those two collision boxes colliding?
     */
    checkCollision(a_collider, b_collider) {
        return (
            a_collider.x < b_collider.x + b_collider.w &&
            a_collider.x + a_collider.w > b_collider.x &&
            a_collider.y < b_collider.y + b_collider.h &&
            a_collider.h + a_collider.y > b_collider.y
        );
    }

    update() {

    }

    render() {
        this.poles.forEach(element => {
            element.render();
        });
    }

    /**
     * Moves the player between poles, and applies X position offset
     * @param {Number} direction `-1` left, `1` right
     * @returns {Number} pole index
     */
    movePlayerSideways(direction) {
        if (this.game.player.lastHorizontalMovementTimestamp + this.game.CONSTANTS.player_horizontal_move_delay_ms > this.game.clock) return;
        
        let testNextPoleIndex = this.game.player.poleIndex + direction;
        if (testNextPoleIndex < 0 || testNextPoleIndex > this.horizontalSnapLocations.length -1) return this.game.player.poleIndex;

        this.game.player.poleIndex += direction;

        if (this.game.player.poleIndex % 2 === 0 || this.game.player.poleIndex === 0) {
            this.game.player.x = this.horizontalSnapLocations[this.game.player.poleIndex] - this.game.player.w;
        }
        else {
            this.game.player.x = this.horizontalSnapLocations[this.game.player.poleIndex];
        }

        this.game.player.lastHorizontalMovementTimestamp = this.game.clock;
    }

    /**
     * Moves the player vertically in the playfield
     * @param {Number} direction `-1` up, `1` down
     * @param {Boolean} attack is the player perfoming an attack move?
     * @returns 
     */
    movePlayerUpDown(direction, attack) {
        let speed = attack ? this.game.CONSTANTS.player_attack_speed : this.game.CONSTANTS.player_speed;
        let testY = this.game.player.y + speed * direction * this.game.speedCorrection;

        if (testY <= 0) return;
        if (testY + this.game.player.collisionBox.h >= this.game.HEIGHT) return;
        
        this.game.player.y = testY;
    }

    /**
     * Put the player at the starting position on the playfield
     */
    initPlayerStart() {
        this.game.player.x = this.horizontalSnapLocations[2] - this.game.player.w;
        this.game.player.poleIndex = 2;
        this.game.player.y = this.game.HEIGHT / 5;
    }
}
