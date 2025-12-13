import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Augment from "./Augment.js";

export default class MachineGun extends Augment {
    static MACHINEGUN_SPRITE = {
        x: 266,
        y: 514,
        width: 99,
        height: 69,
    };
    constructor() {
        super();
        this.name = "Machine Gun";
        this.image = new Sprite(
            images.get(ImageName.Player),
            MachineGun.MACHINEGUN_SPRITE.x,
            MachineGun.MACHINEGUN_SPRITE.y,
            MachineGun.MACHINEGUN_SPRITE.width,
            MachineGun.MACHINEGUN_SPRITE.height
        );
    }

    applyEffect(player) {
        player.sprite = this.image;
        player.dimensions.width = MachineGun.MACHINEGUN_SPRITE.width;
        player.dimensions.height = MachineGun.MACHINEGUN_SPRITE.height;
        player.attributes["reloadSpeed"] = 0.2;
        player.augment = this.name;
    }
}
