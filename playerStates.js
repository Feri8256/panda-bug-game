const STATE = {
    IDLE: 0,
    CLIMB: 1,
    ATTACK: 2,
    FAIL: 3
}

class State {
    constructor(stateName) {
        this.name = stateName;
    }
}

class Idle extends State {
    constructor(player) {
        super("IDLE");
        this.player = player;
    }

    enter() {
        this.player.game.playerSpriteAnimation.setAnimation("idle");
    }

    handleInput(input) {
        this.player.attacking = false;

        let attackKey = input.includesKey("KeyK");
        let upKey = input.includesKey("KeyW");
        let downKey = input.includesKey("KeyS");
        let leftKey = input.includesKey("KeyA");
        let rightKey = input.includesKey("KeyD");

        if (attackKey) {
            this.player.setState(STATE.ATTACK);
            return;
        }

        if (leftKey) {
            this.player.game.playfield.movePlayerSideways(-1);
        }

        if (rightKey) {
            this.player.game.playfield.movePlayerSideways(1);
        }

        if (upKey || downKey) { 
            this.player.setState(STATE.CLIMB);
        }
    }
}

class Climb extends State {
    constructor(player) {
        super("CLIMB");
        this.player = player;
    }

    enter() {
        this.player.game.playerSpriteAnimation.setAnimation("climb");
    }

    handleInput(input) {
        let upKey = input.includesKey("KeyW");
        let downKey = input.includesKey("KeyS");
        let attackKey = input.includesKey("KeyK");
        this.player.attacking = false;

        if (attackKey) {
            this.player.setState(STATE.ATTACK);
            return;
        }

        if (upKey) { 
            this.player.setState(STATE.CLIMB);
            this.player.game.playfield.movePlayerUpDown(-1, false);
        }

        if (downKey) { 
            this.player.setState(STATE.CLIMB);
            this.player.game.playfield.movePlayerUpDown(1, false);
        } 
        if (!downKey && !upKey) this.player.setState(STATE.IDLE);
    }
}

class Attack extends State {
    constructor(player) {
        super("ATTACK");
        this.player = player;
    }

    enter() {
        this.player.attacking = true;
        this.player.game.playerSpriteAnimation.setAnimation("climb");
        this.player.game.audioManager.playAudioClip("ATTACK")
    }

    handleInput(input) {
        let attackKey = input.includesKey("KeyK");

        if (attackKey) {
            this.player.attacking = true;
            this.player.game.playfield.movePlayerUpDown(1, true);
        } else {
            this.player.setState(STATE.IDLE);
            this.player.attacking = false;
        }
        
    }
}

class Fail extends State {
    constructor(player) {
        super("FAIL");
        this.player = player;
    }

    enter() {
        this.player.game.playerSpriteAnimation.setAnimation("fail");

    }

    handleInput(input) {
        
    }
}

export { Idle, Climb, Attack, Fail }