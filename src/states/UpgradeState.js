import Easing from "../../lib/Easing.js";
import Input from "../../lib/Input.js";
import State from "../../lib/State.js";
import Panel from "../elements/Panel.js";
import { CANVAS_WIDTH, context, input, stateStack, timer } from "../globals.js";
import UpgradeFactory from "../services/UpgradeFactory.js";

export default class UpgradeState extends State {
    constructor(player) {
        super();
        this.player = player;

        this.upgrades = this.generateUpgrades();

        this.upgradeBoxes = [
            new Panel(200, 50, 500, 500, this.upgrades[0]),
            new Panel(CANVAS_WIDTH / 2 - 250, 50, 500, 500, this.upgrades[1]),
            new Panel(1300, 50, 500, 500, this.upgrades[2]),
        ];

        this.selectedIndex = 0;

        this.tweenPanels();
    }

    async tweenPanels() {
        const middleY =
            context.canvas.height / 2 - this.upgradeBoxes[0].dimensions.y / 2;

        for (const box of this.upgradeBoxes) {
            await timer.tweenAsync(
                box.position,
                { y: middleY },
                0.5,
                Easing.easeOutQuad
            );

            box.tweening = true;
        }
    }

    renderCursor() {
        const box = this.upgradeBoxes[this.selectedIndex];

        const cursorX = box.position.x + box.dimensions.x / 2;
        const cursorY = box.position.y - 40;

        context.save();
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(cursorX, cursorY);
        context.lineTo(cursorX - 20, cursorY - 30);
        context.lineTo(cursorX + 20, cursorY - 30);
        context.closePath();
        context.fill();
        context.restore();
    }

    updateSelection() {
        if (input.isKeyPressed(Input.KEYS.A)) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.upgradeBoxes.length - 1;
            }
        }

        if (input.isKeyPressed(Input.KEYS.D)) {
            this.selectedIndex++;
            if (this.selectedIndex > this.upgradeBoxes.length - 1) {
                this.selectedIndex = 0;
            }
        }
    }

    generateUpgrades() {
        return UpgradeFactory.createUpgrades();
    }

    update(dt) {
        this.updateSelection();

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            const selectedUpgrade = this.upgrades[this.selectedIndex];
            selectedUpgrade.applyEffect(this.player);
            stateStack.pop();
        }
    }

    render() {
        context.fillStyle = "grey";
        context.globalAlpha = 0.7;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.globalAlpha = 1;

        this.upgradeBoxes.forEach((box) => box.render());
        this.renderCursor();
    }
}
