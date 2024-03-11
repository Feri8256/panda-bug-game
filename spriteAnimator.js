export class SpriteAnimator {
    /**
     * Loads spritesheet animations
     * @param {String} spriteDataUrl A JSON file that contains spritesheet data
     */
    constructor(spriteDataUrl) {
        this.x = 0;
        this.y = 0;

        this.flip_h = false;
        this.loaded = false;
        this.paused = false;
        this.frameCount = 0;
        this.framesTotal = 0;
        this.backwards = false;

        this.animations;
        this.currentAnimation;

        this.lastFrameChange = 0;
        this.lastTimestamp = 0;

        fetch(spriteDataUrl)
            .then(resp => resp.json())
            .then(data => {
                this.img = new Image();
                this.img.src = data.spritesheet;
                this.img.onload = () => {
                    this.loaded = true;
                }
                this.globalFrameWidth = data.frame_w;
                this.globalFrameHeight = data.frame_h;
                this.scaleWidth = data.scale_w ?? this.img.width;
                //this.scaleWidth = this.img.width;
                this.scaleHeight = data.scale_h ?? this.img.height;
                this.animations = data.animations;

                this.globalScaleWidth = this.scaleWidth;
                this.globalScaleHeight = this.scaleHeight;

            })


    }

    setAnimation(name) {
        if (!this.loaded) return;
        let a = this.animations.find(o => o.name === name);
        if (a != undefined && this.currentAnimation?.name === a.name) return;
        this.currentAnimation = a;
        this.framesTotal = this.currentAnimation.frames.length ?? 0;
        this.frameCount = 0;
    }

    /**
     * Stops the animation
     * @param {Number} frameNumber Stopping the animation at `frameNumber`
     */
    stop(frameNumber) {
        this.frameCount = frameNumber ?? 0;
        this.paused = true;
    }

    /**
     * Pauses the animation. Call `play()` method to resume
     */
    pause() {
        this.paused = true;
    }

    /**
     * Start play the animation
     * @param {Boolean} backwards 
     */
    play(backwards) {
        this.backwards = backwards ?? false;
        this.paused = false;
    }

    /**
     * Step one frame forward in the animation
     */
    stepForward() {
        this.frameCount++;
        if (this.frameCount === this.framesTotal) {
            if (this.currentAnimation.loop) this.frameCount = 0; 
            else this.frameCount = this.framesTotal-1;
        }
    }

    /**
     * Step one frame backwards in the animation
     */
    stepBackward() {
        this.frameCount--;
        if (this.frameCount < 0) {
            if (this.currentAnimation.loop) this.frameCount = this.framesTotal-1;
            else this.frameCount = this.framesTotal-1
    
        }
    }

    update(t) {
        this.lastTimestamp = t;
        if (!this.loaded || !this.currentAnimation) return;
        if (!this.paused && (this.lastTimestamp >= this.lastFrameChange + this.currentAnimation.frame_delay_ms)) {
            if (this.backwards) this.stepBackward();
            else this.stepForward();

            this.lastFrameChange = t;
        }
        
    }
    /**
     * Draw onto the rendering context
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        if (!this.loaded) return;
        
        let frame = this.currentAnimation?.frames[this.frameCount];
        if (frame == undefined) return;

        let localFrameWidth = this.currentAnimation.frame_w ?? this.globalFrameWidth;
        let localFrameHeight = this.currentAnimation.frame_h ?? this.globalFrameHeight;

        let localScaleWidth = this.currentAnimation.scale_w ? this.currentAnimation.scale_w : this.globalScaleWidth;
        let localScaleHeight = this.currentAnimation.scale_h ? this.currentAnimation.scale_w : this.globalScaleHeight;

        // What if i don't want to center it?
        let localHalfWidth = localScaleWidth * 0.5;
        let localHalfHeight = localScaleHeight * 0.5;

        context.save();

        // set 0;0 to X;Y then use negative half width and negative half height to center the sprite around X;Y
        context.translate(this.x, this.y);

        // uniform scale
        // SHOULD BE DYNAMIC
        context.scale(0.35, 0.35);

        // flip X
        context.scale(this.flip_h ? -1 : 1, 1);

        context.drawImage(
            this.img,               // image object
            frame.x,                // source X
            frame.y,                // source Y
            localFrameWidth,        // source width
            localFrameHeight,       // source height
            -localHalfWidth,        // destination X
            -localHalfHeight,       // destination Y
            localScaleWidth,        // destination width
            localScaleHeight        // destination height
        );

        context.restore();
    }
}