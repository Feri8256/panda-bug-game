/**
 * Easing functions to use with Animation class
 */
export let EASING = {
    Linear: (x) => {
        return x;
    },
    SineIn: (x) => {
        return 1 - Math.cos((x * Math.PI) / 2);
    },
    SineOut: (x) => {
        return Math.sin((x * Math.PI) / 2);
    },
    BackIn: (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return c3 * x * x * x - c1 * x * x;
    },
    ExpoOut: (x) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
    QuartOut: (x) => {
        return 1 - Math.pow(1 - x, 4);
    }
};

export class Animation {
    /**
     * Use `currentValue` to get the animated value between `startValue` and `endValue` after calling update on this
     * @param {Number} startTime timestamp of animation start
     * @param {Number} endTime timestamp of animation end
     * @param {Number} startValue start value
     * @param {Number} endValue end value
     * @param {Function} easing easing function
     */
    constructor(startTime, endTime, startValue, endValue, easing) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.startValue = startValue;
        this.endValue = endValue;
        this.currentValue = this.startValue;
        this.duration = this.endTime - this.startTime;
        this.amount = 0;
        this.easing = easing;
    }
    /**
     * 
     * @param {Number} currentTime timestamp
     */
    update(currentTime) {
        let checkProgress = (currentTime - this.startTime) / this.duration;
        this.amount = Math.max(0, Math.min(checkProgress, 1));
        this.currentValue = this.startValue + (this.endValue - this.startValue) * this.easing(this.amount);
    }
}