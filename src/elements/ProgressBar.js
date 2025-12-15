import { context } from "../globals.js";
import UIElement from "./UIElement.js";

export default class ProgressBar extends UIElement {
    constructor(x, y, width, height, maxValue, currentValue, color) {
        super(x, y, width, height);

        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.displayValue = currentValue; // display value is used for tweens
        this.color = color;
    }

    render() {
        context.save();

        context.fillStyle = "grey";
        context.fillRect(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );

        const progressWidth =
            (this.displayValue / this.maxValue) * this.dimensions.x;

        context.fillStyle = this.color;
        context.fillRect(
            this.position.x,
            this.position.y,
            progressWidth,
            this.dimensions.y
        );

        context.restore();
    }
}
