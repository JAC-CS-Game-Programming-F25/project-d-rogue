import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Upgrade from "./Upgrade.js";

export default class BulletDamageUpgrade extends Upgrade {
    static ICON_LOCATION = { x: 410, y: 294, width: 99, height: 70 };

    constructor() {
        super();
        this.rarity = "common";
        this.description = "Increases bullet \n damage by 2.";
        this.name = "Killer";
        this.icon = new Sprite(
            images.get(ImageName.Player),
            BulletDamageUpgrade.ICON_LOCATION.x,
            BulletDamageUpgrade.ICON_LOCATION.y,
            BulletDamageUpgrade.ICON_LOCATION.width,
            BulletDamageUpgrade.ICON_LOCATION.height
        );
    }

    applyEffect(player) {
        player.attributes["bulletDamage"] += 2;
    }
}
