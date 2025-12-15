import Input from "../../lib/Input.js";
import State from "../../lib/State.js";
import { context, input, stateStack } from "../globals.js";

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
