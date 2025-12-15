import Input from "../../lib/Input.js";
import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import ImageName from "../enums/ImageName.js";
import { SoundName } from "../enums/SoundName.js";
import { context, images, input, sounds, stateStack } from "../globals.js";

export default class VictoryState extends State {
    constructor() {
        super();

        this.grandPrize = new Sprite(
            images.get(ImageName.GrandPrize),
            0,
            0,
            225,
            225
        );

        sounds.play(SoundName.Victory);
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            sounds.stop(SoundName.Victory);

            // TitleScreenState
            stateStack.pop();
        }
    }

    render() {
        context.save();

        context.fillStyle = "gray";

        context.globalAlpha = 0.7;

        context.fillRect(600, 500, 850, 1000);

        context.globalAlpha = 1;

        context.fillStyle = "black";

        context.font = "100px Ubuntu";

        context.fillText(`You win!!!!!!!!!!!!!`, 650, 650);

        this.grandPrize.render(800, 700, { x: 2, y: 2 });

        context.fillStyle = "cornflowerblue";

        context.fillText(`Return to Menu`, 650, 1300);

        context.restore();
    }
}
