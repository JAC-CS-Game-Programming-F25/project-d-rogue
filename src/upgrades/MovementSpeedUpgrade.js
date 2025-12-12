import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class MovementSpeedUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 246, y: 21, width: 118, height: 79 };

    constructor() {
        super();

        this.rarity = "common";
        this.description = "Increases movement \n speed by 25%";
        this.name = "Blitzkrieg";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            MovementSpeedUpgrade.ICON_LOCATION.x,
            MovementSpeedUpgrade.ICON_LOCATION.y,
            MovementSpeedUpgrade.ICON_LOCATION.width,
            MovementSpeedUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.attributes["movementSpeed"] += 25;
    }
}
