import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Augment from "./Augment.js";

export default class FlankGuard extends Augment {
    static FLANKGUARD_SPRITE = {
        x: 242,
        y: 298,
        width: 120,
        height: 70,
    };
    constructor() {
        super();
        this.name = "Flank Guard";
        this.image = new Sprite(
            images.get(ImageName.Player),
            FlankGuard.FLANKGUARD_SPRITE.x,
            FlankGuard.FLANKGUARD_SPRITE.y,
            FlankGuard.FLANKGUARD_SPRITE.width,
            FlankGuard.FLANKGUARD_SPRITE.height
        );
    }

    applyEffect(player) {
        player.sprite = this.image;
        player.dimensions.width = FlankGuard.FLANKGUARD_SPRITE.width;
        player.dimensions.height = FlankGuard.FLANKGUARD_SPRITE.height;
        player.augment = this.name;
    }
}
