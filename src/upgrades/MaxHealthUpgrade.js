import Upgrade from "./Upgrade.js";

export default class MaxHealthUpgrade extends Upgrade {
    constructor(rarity) {
        super(rarity);
    }

    applyEffect(player) {
        player.attributes["maxHealth"] += 2;
    }
}
