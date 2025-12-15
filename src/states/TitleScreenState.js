import Input from "../../lib/Input.js";
import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import Mothership from "../entities/enemies/Mothership.js";
import ImageName from "../enums/ImageName.js";
import { SoundName } from "../enums/SoundName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    images,
    input,
    saveState,
    sounds,
    stateStack,
} from "../globals.js";
import PlayState from "./PlayState.js";

export default class TitleScreenState extends State {
    constructor() {
        super();

        this.menuOptions = {
            new: "New Game",
            resume: "Resume Game",
        };

        this.hasSave = localStorage.getItem("save") !== null;

        this.highlighted = this.menuOptions.new;

        this.background = new Sprite(
            images.get(ImageName.MainMenu),
            0,
            0,
            2000,
            2000
        );

        this.mothershipSprite = new Sprite(
            images.get(ImageName.Player),
            Mothership.SPRITE.x,
            Mothership.SPRITE.y,
            Mothership.SPRITE.width,
            Mothership.SPRITE.height
        );
    }

    update(dt) {
        this.hasSave = localStorage.getItem("save") !== null;

        if (
            input.isKeyPressed(Input.KEYS.W) ||
            input.isKeyPressed(Input.KEYS.S)
        ) {
            // only allow movement if the player has a previous save
            if (this.hasSave) {
                sounds.play(SoundName.Cursor);
                this.highlighted =
                    this.highlighted === this.menuOptions.new
                        ? this.menuOptions.resume
                        : this.menuOptions.new;
            }
        }

        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            if (this.highlighted === this.menuOptions.new) {
                saveState.loadData = false;
                stateStack.push(new PlayState());
            } else {
                saveState.loadData = true;
                stateStack.push(new PlayState());
            }

            sounds.play(SoundName.Selection);
        }
    }

    render() {
        this.background.render(0, 0);

        this.mothershipSprite.render(700, 700, {
            x: 3,
            y: 3,
        });
        context.save();

        context.strokeStyle = "black";
        context.lineWidth = 10;

        context.font = "300px Ubuntu";
        context.fillStyle = "white";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText(`D-ROGUE`, 1000, 300);
        context.strokeText(`D-ROGUE`, 1000, 300);
        context.font = "150px Ubuntu";

        context.fillStyle =
            this.highlighted === this.menuOptions.new
                ? "cornflowerblue"
                : "white";
        context.fillText(
            `${this.menuOptions.new}`,
            CANVAS_WIDTH * 0.5,
            CANVAS_HEIGHT * 0.8
        );
        // add border around text
        context.strokeText(
            `${this.menuOptions.new}`,
            CANVAS_WIDTH * 0.5,
            CANVAS_HEIGHT * 0.8
        );

        context.globalAlpha = this.hasSave ? 1 : 0.4;

        context.fillStyle =
            this.highlighted === this.menuOptions.resume && this.hasSave
                ? "cornflowerblue"
                : "white";

        context.fillText(
            this.menuOptions.resume,
            CANVAS_WIDTH * 0.5,
            CANVAS_HEIGHT * 0.9
        );

        context.strokeText(
            this.menuOptions.resume,
            CANVAS_WIDTH * 0.5,
            CANVAS_HEIGHT * 0.9
        );

        context.globalAlpha = 1;
        context.restore();
    }
}
