import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class FreezeShotUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 622, y: 92, width: 25, height: 22 };

    constructor() {
        super();

        this.rarity = "epic";
        this.description =
            "Decreases enemy \n movement\n speed by 50% for \n3 seconds on hit.";
        this.name = "Frostbite Rounds";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            FreezeShotUpgrade.ICON_LOCATION.x,
            FreezeShotUpgrade.ICON_LOCATION.y,
            FreezeShotUpgrade.ICON_LOCATION.width,
            FreezeShotUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.canFreeze = true;
    }
}
