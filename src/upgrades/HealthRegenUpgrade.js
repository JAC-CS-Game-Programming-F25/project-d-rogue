import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class HealthRegenUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 553, y: 84, width: 44, height: 39 };

    constructor() {
        super();

        this.rarity = "rare";
        this.description = "Restore 5 health.";
        this.name = "Regenerator";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            HealthRegenUpgrade.ICON_LOCATION.x,
            HealthRegenUpgrade.ICON_LOCATION.y,
            HealthRegenUpgrade.ICON_LOCATION.width,
            HealthRegenUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.heal(5);
    }
}
