import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class CriticalChangeUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 418, y: 830, width: 115, height: 70 };
    constructor() {
        super();

        this.rarity = "rare";
        this.description = "Increases critical \n chance by 5%";
        this.name = "Big Damage";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            CriticalChangeUpgrade.ICON_LOCATION.x,
            CriticalChangeUpgrade.ICON_LOCATION.y,
            CriticalChangeUpgrade.ICON_LOCATION.width,
            CriticalChangeUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.attributes["critChange"] += 5;
    }
}
