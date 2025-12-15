import Input from "../../lib/Input.js";
import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import StateStack from "../../lib/StateStack.js";
import Mothership from "../entities/enemies/Mothership.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    images,
    input,
    stateStack,
} from "../globals.js";
import PlayState from "./PlayState.js";

export default class GameOverState extends State {
    constructor() {
        super();
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            // Play State
            stateStack.pop();

            // TitleScreenState
            stateStack.pop();
        }
    }

    render() {
        context.save();

        context.fillStyle = "gray";

        context.globalAlpha = 0.7;

        context.fillRect(650, 500, 850, 750);

        context.globalAlpha = 1;

        context.fillStyle = "black";

        context.font = "100px Ubuntu";

        context.fillText(`You died...`, 850, 650);

        context.fillStyle = "cornflowerblue";

        context.fillText(`Return to Menu`, 700, 900);

        context.restore();
    }
}
