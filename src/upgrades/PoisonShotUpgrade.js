import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class PoisonShotUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 745, y: 14, width: 64, height: 61 };

    constructor() {
        super();

        this.rarity = "epic";
        this.description =
            "Decrease enemy health \n by 1 for 5 seconds \n on hit.";
        this.name = "Toxic Rounds";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            PoisonShotUpgrade.ICON_LOCATION.x,
            PoisonShotUpgrade.ICON_LOCATION.y,
            PoisonShotUpgrade.ICON_LOCATION.width,
            PoisonShotUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.damageOverTime = true;
    }
}
