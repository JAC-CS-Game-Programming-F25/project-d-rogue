import Upgrade from "./Upgrade.js";

export default class MovementSpeedUpgrade extends Upgrade {
    constructor(rarity) {
        super(rarity);
    }

    applyEffect(player) {
        player.attributes["movementSpeed"] += 25;
    }
}
