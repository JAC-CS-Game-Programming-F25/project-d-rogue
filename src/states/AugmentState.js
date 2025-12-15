import Easing from "../../lib/Easing.js";
import Input from "../../lib/Input.js";
import State from "../../lib/State.js";
import FlankGuard from "../augments/FlankGuard.js";
import MachineGun from "../augments/MachineGun.js";
import Sniper from "../augments/Sniper.js";
import Twin from "../augments/Twin.js";
import AugmentPanel from "../elements/AugmentPanel.js";
import { SoundName } from "../enums/SoundName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    input,
    sounds,
    stateStack,
    timer,
} from "../globals.js";

export default class AugmentState extends State {
    constructor(player) {
        super();

        this.player = player;

        this.augments = this.generateAugments();

        this.augmentBoxes = [
            new AugmentPanel(
                350,
                -1000,
                500,
                500,
                this.augments[0],
                "#68e3f6ff"
            ),
            new AugmentPanel(
                350,
                -1000,
                500,
                500,
                this.augments[1],
                "#f43854ff"
            ),
            new AugmentPanel(
                1150,
                -1000,
                500,
                500,
                this.augments[2],
                "#79f743ff"
            ),
            new AugmentPanel(
                1150,
                -1000,
                500,
                500,
                this.augments[3],
                "#f3f468ff"
            ),
        ];

        this.selectedIndex = 0;

        this.tweenPanels();
    }

    async tweenPanels() {
        const panelWidth = this.augmentBoxes[0].dimensions.x;
        const panelHeight = this.augmentBoxes[0].dimensions.y;

        const gap = 100;

        // Compute total grid width/height
        const totalW = panelWidth * 2 + gap;
        const totalH = panelHeight * 2 + gap;

        // Top-left coordinate of the grid
        const startX = (CANVAS_WIDTH - totalW) / 2;
        const startY = (CANVAS_HEIGHT - totalH) / 2;

        const targets = [
            { x: startX, y: startY }, // top-left
            { x: startX + panelWidth + gap, y: startY }, // top-right
            { x: startX, y: startY + panelHeight + gap }, // bottom-left
            { x: startX + panelWidth + gap, y: startY + panelHeight + gap }, // bottom-right
        ];

        // Tween each panel into its grid spot
        for (let i = 0; i < this.augmentBoxes.length; i++) {
            const box = this.augmentBoxes[i];
            const target = targets[i];

            await timer.tweenAsync(
                box.position,
                { x: target.x, y: target.y },
                0.6,
                Easing.easeOutQuad
            );

            box.tweening = true;
        }
    }

    renderCursor() {
        const box = this.augmentBoxes[this.selectedIndex];

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
        // move left
        if (input.isKeyPressed(Input.KEYS.A)) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.augmentBoxes.length - 1;
            }
            sounds.play(SoundName.Cursor);
        }

        // move right
        if (input.isKeyPressed(Input.KEYS.D)) {
            this.selectedIndex++;
            if (this.selectedIndex > this.augmentBoxes.length - 1) {
                this.selectedIndex = 0;
            }
            sounds.play(SoundName.Cursor);
        }
    }

    update(dt) {
        this.updateSelection();

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            const selectedAugment = this.augments[this.selectedIndex];
            selectedAugment.applyEffect(this.player);
            stateStack.pop();
            sounds.play(SoundName.Selection);
        }
    }

    generateAugments() {
        return [new Twin(), new MachineGun(), new Sniper(), new FlankGuard()];
    }

    render() {
        context.save();
        context.fillStyle = "grey";
        context.globalAlpha = 0.7;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.globalAlpha = 1;

        this.augmentBoxes.forEach((box) => box.render());
        this.renderCursor();
        context.restore();
    }
}
