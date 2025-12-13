import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class FireShotUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 685, y: 31, width: 45, height: 39 };

    constructor() {
        super();

        this.rarity = "epic";
        this.description =
            "Decreases enemy\n health by \n 1 for 5 seconds on hit.";
        this.name = "Napalm Rounds";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            FireShotUpgrade.ICON_LOCATION.x,
            FireShotUpgrade.ICON_LOCATION.y,
            FireShotUpgrade.ICON_LOCATION.width,
            FireShotUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        // TODO: Change bullet color to orange
        player.damageOverTime = true;
    }
}
