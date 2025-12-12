import Upgrade from "./Upgrade.js";

export default class ReloadSpeedUpgrade extends Upgrade {
    constructor(rarity) {
        super(rarity);
    }

    applyEffect(player) {
        player.attributes["reloadSpeed"] -= 0.2;
    }
}
