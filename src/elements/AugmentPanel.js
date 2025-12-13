import { roundedRectangle } from "../../lib/Drawing.js";
import { context } from "../globals.js";
import UIElement from "./UIElement.js";
import UpgradePanel from "./UpgradePanel.js";

export default class AugmentPanel extends UIElement {
    /**
     * A UI element that is simply a rectangle that
     * other UI elements are placed on top of.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} options
     */
    constructor(x, y, width, height, augment, color) {
        super(x, y, width, height);

        this.borderColour = "grey";
        this.panelColour = color;
        this.fontColour = "black";

        this.augment = augment;

        this.padding = UpgradePanel.DEFAULT_PADDING;
        this.isVisible = true;

        this.tweening = false;
    }

    render() {
        if (!this.isVisible) {
            return;
        }

        context.save();
        this.renderBackground();
        this.renderForeground();
        if (this.tweening) {
            this.renderUpgrade();
        }
        context.restore();
    }

    renderBackground() {
        context.fillStyle = this.borderColour;
        roundedRectangle(
            context,
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            UpgradePanel.BORDER_WIDTH,
            true,
            false
        );
    }

    renderUpgrade() {
        const panelX = this.position.x;
        const panelY = this.position.y;
        const panelWidth = this.dimensions.x;

        let cursorY = panelY + UpgradePanel.BORDER_WIDTH + this.padding + 70;

        const icon = this.augment.image;
        const scale = 2;
        const iconWidth = icon.width * scale;
        const iconHeight = icon.height * scale;

        const iconX = panelX + (panelWidth - iconWidth) / 2;

        icon.render(iconX, cursorY, { x: scale, y: scale });

        cursorY += iconHeight + 100;

        context.fillStyle = this.fontColour;
        context.font = `bold 50px Ubuntu`;

        const title = this.augment.name ?? "";
        const titleWidth = context.measureText(title).width;
        const titleX = panelX + (panelWidth - titleWidth) / 2;

        context.fillText(title, titleX, cursorY);
    }

    renderForeground() {
        context.fillStyle = this.panelColour;
        roundedRectangle(
            context,
            this.position.x + UpgradePanel.BORDER_WIDTH / 2,
            this.position.y + UpgradePanel.BORDER_WIDTH / 2,
            this.dimensions.x - UpgradePanel.BORDER_WIDTH,
            this.dimensions.y - UpgradePanel.BORDER_WIDTH,
            UpgradePanel.BORDER_WIDTH,
            true,
            false
        );
    }

    toggle() {
        this.isVisible = !this.isVisible;
    }
}
