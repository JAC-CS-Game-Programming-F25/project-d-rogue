import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Augment from "./Augment.js";

export default class Sniper extends Augment {
    static SNIPER_SPRITE = {
        x: 417,
        y: 830,
        width: 116,
        height: 70,
    };
    constructor() {
        super();
        this.name = "Sniper";
        this.image = new Sprite(
            images.get(ImageName.Player),
            Sniper.SNIPER_SPRITE.x,
            Sniper.SNIPER_SPRITE.y,
            Sniper.SNIPER_SPRITE.width,
            Sniper.SNIPER_SPRITE.height
        );
    }

    applyEffect(player) {
        // change sprite
        player.sprite = this.image;

        // change dimensions
        player.dimensions.width = Sniper.SNIPER_SPRITE.width;
        player.dimensions.height = Sniper.SNIPER_SPRITE.height;

        // upgrade tank
        player.attributes["bulletSpeed"] = 500;
        player.attributes["bulletDamage"] += 3;
        player.attributes["reloadSpeed"] += 1;
        player.augment = this.name;
    }
}
