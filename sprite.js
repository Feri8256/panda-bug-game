
export class SpriteImage {
    /**
     * Creates an image element, that can be used with the `Sprite` class
     * @param {String} src URL if the image file
     */
    constructor(src) {
        this.loaded = false;
        this.img = new Image();
        this.img.src = src;
        this.img.onload = () => { 
            this.loaded = true;
            this.w = this.w ?? this.img.width;
            this.h = this.h ?? this.img.height;
        }
    }
}

export class Sprite {
    /**
     * Controls the appearance of a `SpriteImage`
     * @param {SpriteImage} spriteImage Object of `SpriteImage` class 
     * @param {Number} x X position (default 0)
     * @param {Number} y Y position (default 0)
     * @param {Number} w Width (defaults to sprite width)
     * @param {Number} h Height (defaults to sprite height)
     * @param {Number} origin_x X position of the anchor (between 0-1) (default 0.5)
     * @param {Number} origin_y Y position of the anchor (between 0-1) (default 0.5)
     * @param {Number} scale Scaling (default 1)
     * @param {Number} opacity 1=fully visible, 0=not visible (default 1)
     * @param {Number} rotation Rotation in Radians (default 0)
     * @param {Boolean} flip_h Horizontal flip (default false)
     * @param {Boolean} flip_v Vertical flip (default false)
     * @param {Boolean} additiveColor Additive color compositing (default false) 
     * 
     */
    constructor(spriteImage, x, y, w, h, origin_x, origin_y, scale, opacity, rotation, flip_h, flip_v, additiveColor) {
        this.spriteImage = spriteImage;
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.w = w;
        this.h = h;
        this.origin_x = origin_x ?? 0.5;
        this.origin_y = origin_y ?? 0.5;
        this.scale = scale ?? 1;
        this.opacity = opacity ?? 1;
        this.rotation = rotation ?? 0;
        this.flip_h = flip_h;
        this.flip_v = flip_v;
        this.additiveColor = additiveColor ?? false;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        if (!this.spriteImage.loaded) return;
        ctx.save();

        // Additive color compositing
        if (this.additiveColor) ctx.globalCompositeOperation = "lighter";

        // Opacity
        ctx.globalAlpha = this.opacity;

        // Move
        ctx.translate(this.x, this.y);

        // Uniform scaling
        ctx.scale(this.scale, this.scale);

        // Rotation
        ctx.rotate(this.rotation);

        // Vector scaling
        //ctx.scale(this.vectorScale.x, this.vectorScale.y);

        // Horizontal & vertival flip
        ctx.scale(
            this.flip_h ? -1 : 1,
            this.flip_v ? -1 : 1
        );

        // Sprite
        ctx.drawImage(this.spriteImage.img, (-this.spriteImage.w * this.origin_x), (-this.spriteImage.h * this.origin_y));

        ctx.resetTransform();

        ctx.restore();
    }
}
