import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class ReloadSpeedUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 266, y: 514, width: 99, height: 69 };

    constructor() {
        super();

        this.rarity = "common";
        this.description = "Decrease reload speed \n by 0.2 seconds.";
        this.name = "Fast Loader";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            ReloadSpeedUpgrade.ICON_LOCATION.x,
            ReloadSpeedUpgrade.ICON_LOCATION.y,
            ReloadSpeedUpgrade.ICON_LOCATION.width,
            ReloadSpeedUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        if (player.attributes["reloadSpeed"] > 0.2) {
            player.attributes["reloadSpeed"] -= 0.2;
        }
    }
}
