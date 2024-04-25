import { InputHandler } from "./InputHandler.js";
import { Player } from "./player.js";
import { Pole } from "./pole.js";
import { Playfield } from "./playfield.js";
import { SpriteImage, Sprite } from "./sprite.js";
import { Enemy } from "./enemy.js";
import { EnemyManager } from "./enemyManager.js";
import { EASING, Animation } from "./animationEngine.js";
import { SpriteAnimator } from "./spriteAnimator.js";
import { AudioManager } from "./audioManager.js";
import { HitEffect } from "./hitEffect.js";
import { ScoreManager } from "./scoreManager.js";
import { PlayfieldDecorator } from "./playfieldDecorator.js";

const CONSTANTS = {
    frametime_constant_ms: 16,
    pole_count: 3,
    pole_width: 55,
    player_speed: 10,
    player_attack_speed: 25,
    enemy_speed: 2.5,
    enemy_spawn_interval_ms: 700,
    enemy_fall_duration_ms: 500,
    player_fall_duration_ms: 1000,
    player_horizontal_move_delay_ms: 100,
    gameover_strings: [
        { headerText: "Game Over!", smallText: "You got in contact with the enemy!" },
        { headerText: "Bugs won!", smallText: "... Again..." },
        { headerText: "That's It!", smallText: "Game Over!" },
        { headerText: "Game Over!", smallText: "That's It!" },
        { headerText: "Ouch!", smallText: "That must have hurt" },
        { headerText: "Seems like you gave up!", smallText: "They don't stop coming..." },
        { headerText: "Alright", smallText: "You tried your best" },
        { headerText: "Enough of this...", smallText: "The air is better down here" }
    ]
}

class Game {
    constructor(width, height, constants) {
        this.CONSTANTS = Object.freeze(constants);
        this.WIDTH = width;
        this.HEIGHT = height;

        this.startContainer = document.querySelector("#start-btn-container");

        this.buttonStart = document.querySelector("#btn-start");
        this.buttonStart.addEventListener("click", () => {
            this.start();
        });

        this.buttonRetry = document.querySelector("#gameover-btn-retry");
        this.buttonRetry.addEventListener("click", () => {
            this.retry();
        });

        this.gameOverOverlay = {
            container: document.querySelector("#gameover-container"),
            headerText: document.querySelector("#gameover-headertext"),
            smallText: document.querySelector("#gameover-smalltext"),
            scoreNumber: document.querySelector("#gameover-score-number")
        }

        this.canvas = document.querySelector("canvas");
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        this.ctx = this.canvas.getContext("2d");

        this.backgroundGradient = this.ctx.createLinearGradient(0,0,1,this.HEIGHT);
        this.backgroundGradient.addColorStop(0, "#0066a0");
        this.backgroundGradient.addColorStop(1, "#00f3f3");

        //
        this.score = 0;
        this.playing = false;
        this.playerSpriteAnimation = new SpriteAnimator("panda.json");

        this.enemy = Enemy;
        this.pole = Pole;
        this.sprite = Sprite;
        this.animation = Animation;
        this.hitVFX = HitEffect;

        this.audioManager = new AudioManager();

        this.audioManager.loadFile("sfx/bgm.ogg", "BGM");
        this.audioManager.loadFile("sfx/attack.ogg", "ATTACK");
        this.audioManager.loadFile("sfx/gameover.ogg", "GAMEOVER");
        this.audioManager.loadFile("sfx/fail1.ogg", "FAIL_0");
        this.audioManager.loadFile("sfx/fail2.ogg", "FAIL_1");
        this.audioManager.loadFile("sfx/fail3.ogg", "FAIL_2");
        this.audioManager.loadFile("sfx/fail4.ogg", "FAIL_3");
        this.audioManager.loadFile("sfx/hit1.ogg", "HIT_0");
        this.audioManager.loadFile("sfx/hit2.ogg", "HIT_1");
        this.audioManager.loadFile("sfx/hit3.ogg", "HIT_2");
        this.audioManager.loadFile("sfx/hit4.ogg", "HIT_3");

        this.sprites = {
            scoreFrame: new SpriteImage("img/score-frame.png"),
            cloud: new SpriteImage("img/cloud.png"),
            bugs: [
                new SpriteImage("img/bug0.png"),
                new SpriteImage("img/bug1.png"),
                new SpriteImage("img/bug2.png"),
                new SpriteImage("img/bug3.png"),
                new SpriteImage("img/bug4.png")
            ],
            hitEffects: [
                new SpriteImage("img/vfx-hit0.png"),
                new SpriteImage("img/vfx-hit1.png"),
                new SpriteImage("img/vfx-hit2.png"),
                new SpriteImage("img/vfx-hit3.png")
            ]
        };

        this.easings = EASING;
        this.inputHandler = new InputHandler();
        this.scoreManager = new ScoreManager(this);
        this.enemyManager = new EnemyManager(this);
        this.player = new Player(this);
        this.playfield = new Playfield(this);
        this.playfieldDecorator = new PlayfieldDecorator(this);

        this.previousFrameTimestamp = 0;
        this.deltaTime = 0;
        this.clock = 0;

        this.speedCorrection = 1;
    }

    update(timestamp) {
        this.clock = timestamp;

        this.deltaTime = this.clock - this.previousFrameTimestamp;
        this.previousFrameTimestamp = this.clock;
        this.speedCorrection = this.deltaTime > 500 ? 1 : this.deltaTime / this.CONSTANTS.frametime_constant_ms;

        this.playfieldDecorator.update();

        if (!this.playing) return;
        this.playfield.update();
        this.player.update();
        this.enemyManager.update();
        this.scoreManager.update();
    }

    render() {
        this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        // Background
        this.ctx.fillStyle = this.backgroundGradient;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        this.playfieldDecorator.render();
        this.playfield.render();
        this.player.render();
        this.enemyManager.render();
        this.scoreManager.render();
    }

    resetGame() {
        this.scoreManager.reset();
        this.player.reset();
        this.playfield.initPlayerStart();
        this.enemyManager.reset();
        this.audioManager.playAudioClip("BGM", true, 0.3);
    }

    start() {
        this.startContainer.remove();
        this.playing = true;
        this.player.setState(0);
        this.audioManager.resumeContext();
        this.audioManager.playAudioClip("BGM", true);
    }

    retry() {
        this.resetGame();

        this.gameOverOverlay.container.animate(
            [
                { top: "50%" },
                { top: "-250px" }
            ],
            {
                delay: 0,
                duration: 400,
                easing: "ease-in",
                fill: "forwards"
            }
        );

        this.canvas.animate(
            [
                { filter: "blur(5px)" },
                { filter: "blur(0px)" }
            ],
            {
                delay: 0,
                duration: 400,
                fill: "forwards"
            }
        );
    }

    gameOver() {
        this.audioManager.stopWithFadeOut("BGM", 1);
        this.audioManager.playAudioClip("GAMEOVER", false, 1);
        this.audioManager.playAudioClip(`FAIL_${Math.floor(Math.random() * 4)}`);

        let rdm = Math.floor(Math.random() * this.CONSTANTS.gameover_strings.length);
        this.gameOverOverlay.headerText.textContent = this.CONSTANTS.gameover_strings[rdm].headerText;
        this.gameOverOverlay.smallText.textContent = this.CONSTANTS.gameover_strings[rdm].smallText;
        this.gameOverOverlay.scoreNumber.textContent = this.scoreManager.score;

        this.gameOverOverlay.container.animate(
            [
                { top: "-250px" },
                { top: "50%" }
            ],
            {
                delay: 1500,
                duration: 600,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        this.canvas.animate(
            [
                { filter: "blur(0px)" },
                { filter: "blur(5px)" }
            ],
            {
                delay: 1500,
                duration: 600,
                fill: "forwards"
            }
        );
    }
}

let game;

function mainLoop(timestamp) {
    game.update(timestamp);

    game.render();

    requestAnimationFrame(mainLoop);
}

document.addEventListener("DOMContentLoaded", () => {
    game = new Game(960, 960, CONSTANTS);
    game.player.setState(0);

    requestAnimationFrame(mainLoop);
});

