export class EnemyManager {
    constructor(game) { 
        this.game = game;
        this.enemies = [];
        this.lastSpawnTime = 0;
    }

    spawnEnemy() {
        let possibleXpoints = this.game.playfield.horizontalSnapLocations;
        let rdmIndex = Math.floor(Math.random() * possibleXpoints.length);
        
        this.enemies.push(
            new this.game.enemy(
                this.game, 
                possibleXpoints[rdmIndex], 
                this.game.HEIGHT,
                rdmIndex
            )
        );

        this.lastSpawnTime = this.game.clock;
    }

    update() {
        if (this.lastSpawnTime + this.game.CONSTANTS.enemy_spawn_interval_ms < this.game.clock) this.spawnEnemy();

        // Update enemies and mark them for deletion after they reached the top of the screen
        this.enemies.forEach(e => {
            e.update();
            if (!e.takeOverControl) e.y -= this.game.CONSTANTS.enemy_speed * this.game.speedCorrection;
            if (e.y + e.collisionBox.h < 0) {
              e.markedForDeletion = true;
              this.game.scoreManager.breakCombo();
            }
        });

        this.enemies = this.enemies.filter((en) => { return !en.markedForDeletion });
    }

    render() {
        this.enemies.forEach(e => {
            e.render();
        });
    }

    reset() {
        this.enemies = [];
    }
}