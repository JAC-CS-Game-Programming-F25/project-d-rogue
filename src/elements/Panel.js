import { roundedRectangle } from "../../lib/Drawing.js";
import { context } from "../globals.js";
import UIElement from "./UIElement.js";

export default class Panel extends UIElement {
    static BOTTOM_DIALOGUE = { x: 0, y: 8, width: 15, height: 3 };
    static TOP_DIALOGUE = { x: 0, y: 0, width: 15, height: 3 };
    static POKEMON_STATS = { x: 7.5, y: 3.5, width: 7, height: 7 };
    static BATTLE_PLAYER = { x: 8, y: 5, width: 6.5, height: 2.5 };
    static BATTLE_OPPONENT = { x: 1, y: 1, width: 6.5, height: 2 };
    static BATTLE_EXPERIENCE = { x: 9, y: 7, width: 6, height: 4 };
    static DEFAULT_PADDING = 20;
    static BORDER_WIDTH = 10;

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
    constructor(x, y, width, height, upgrade) {
        super(x, y, width, height);

        if (upgrade.rarity === "common") {
            this.borderColour = "grey";
            this.panelColour = "white";
            this.fontColour = "black";
        } else if (upgrade.rarity === "rare") {
            this.borderColour = "black";
            this.panelColour = "#4d4dffff";
            this.fontColour = "black";
        } else if (upgrade.rarity === "epic") {
            this.borderColour = "black";
            this.panelColour = "#87007eff";
            this.fontColour = "white";
        }
        this.padding = Panel.DEFAULT_PADDING;
        this.isVisible = true;
        this.upgrade = upgrade;

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
            Panel.BORDER_WIDTH,
            true,
            false
        );
    }

    renderUpgrade() {
        const panelX = this.position.x;
        const panelY = this.position.y;
        const panelWidth = this.dimensions.x;

        let cursorY = panelY + Panel.BORDER_WIDTH + this.padding;

        const icon = this.upgrade.icon;
        const scale = 2;
        const iconWidth = icon.width * scale;
        const iconHeight = icon.height * scale;

        const iconX = panelX + (panelWidth - iconWidth) / 2;

        icon.render(iconX, cursorY, { x: scale, y: scale });

        cursorY += iconHeight + 90;

        context.fillStyle = this.fontColour;
        context.font = `bold 50px Ubuntu`;

        const title = this.upgrade.name ?? "";
        const titleWidth = context.measureText(title).width;
        const titleX = panelX + (panelWidth - titleWidth) / 2;

        context.fillText(title, titleX, cursorY);

        cursorY += 75;

        context.font = `40px ${Panel.FONT_FAMILY}`;

        context.font = `50px ${Panel.FONT_FAMILY}`;

        const descLines = (this.upgrade.description ?? "").split("\n");

        descLines.forEach((line) => {
            const lineWidth = context.measureText(line).width;
            const lineX = panelX + (panelWidth - lineWidth) / 2;

            context.fillText(line, lineX, cursorY);

            cursorY += 75; // spacing between lines
        });
    }

    renderForeground() {
        context.fillStyle = this.panelColour;
        roundedRectangle(
            context,
            this.position.x + Panel.BORDER_WIDTH / 2,
            this.position.y + Panel.BORDER_WIDTH / 2,
            this.dimensions.x - Panel.BORDER_WIDTH,
            this.dimensions.y - Panel.BORDER_WIDTH,
            Panel.BORDER_WIDTH,
            true,
            false
        );
    }

    toggle() {
        this.isVisible = !this.isVisible;
    }
}
