import Upgrade from "./Upgrade.js";

export default class BulletDamageUpgrade extends Upgrade {
    constructor(rarity) {
        super(rarity);
    }

    applyEffect(player) {
        player.attributes["bulletDamage"] -= 0.2;
    }
}
