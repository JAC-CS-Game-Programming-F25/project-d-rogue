import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Augment from "./Augment.js";

export default class Twin extends Augment {
    static TWIN_SPRITE = {
        x: 413,
        y: 515,
        width: 100,
        height: 69,
    };
    constructor() {
        super();
        this.name = "Twin";
        this.image = new Sprite(
            images.get(ImageName.Player),
            Twin.TWIN_SPRITE.x,
            Twin.TWIN_SPRITE.y,
            Twin.TWIN_SPRITE.width,
            Twin.TWIN_SPRITE.height
        );
    }

    applyEffect(player) {
        player.sprite = this.image;
        player.dimensions.width = Twin.TWIN_SPRITE.width;
        player.dimensions.height = Twin.TWIN_SPRITE.height;
        player.augment = this.name;
    }
}
