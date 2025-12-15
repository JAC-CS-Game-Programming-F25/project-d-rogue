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

export default class PauseState extends State {
    constructor(player, playState) {
        super();

        this.player = player;
        this.playState = playState;
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            this.saveData();

            // Play State
            stateStack.pop();

            // TitleScreenState
            stateStack.pop();
        }

        if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
            // Play State
            stateStack.pop();
        }
    }

    render() {
        context.save();

        context.fillStyle = "gray";

        context.globalAlpha = 0.7;

        context.fillRect(650, 500, 750, 750);

        context.globalAlpha = 1;

        context.fillStyle = "black";

        context.font = "100px Ubuntu";

        context.fillText(`Paused`, 850, 650);

        context.fillStyle = "cornflowerblue";

        context.fillText(`Save and Quit`, 700, 900);

        context.restore();
    }

    saveData() {
        const saveData = {
            player: {
                level: this.player.level,
                xp: this.player.attributes.xp,
                xpThreshold: this.player.attributes.xpThreshold,

                attributes: {
                    health: this.player.attributes.health,
                    maxHealth: this.player.attributes.maxHealth,
                    bulletDamage: this.player.attributes.bulletDamage,
                    bulletSpeed: this.player.attributes.bulletSpeed,
                    reloadSpeed: this.player.attributes.reloadSpeed,
                    critChance: this.player.attributes.critChance,
                },

                canFreeze: this.player.canFreeze,
                damageOverTime: this.playState.damageOverTime,
                augment: this.player.augment,
            },
            stage: this.playState.stage,
        };

        localStorage.setItem("save", JSON.stringify(saveData));
    }
}
