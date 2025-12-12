import Upgrade from "./Upgrade.js";

export default class CriticalChangeUpgrade extends Upgrade {
    constructor(rarity) {
        super(rarity);
    }

    applyEffect(player) {
        player.attributes["critChange"] += 5;
    }
}
