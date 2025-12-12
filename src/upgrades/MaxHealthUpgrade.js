import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class MaxHealthUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 666, y: 267, width: 31, height: 27 };

    constructor() {
        super();

        this.rarity = "common";
        this.description = "Increases max \n health by 2";
        this.name = "Tank (get it?)";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            MaxHealthUpgrade.ICON_LOCATION.x,
            MaxHealthUpgrade.ICON_LOCATION.y,
            MaxHealthUpgrade.ICON_LOCATION.width,
            MaxHealthUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.attributes["maxHealth"] += 2;
    }
}
