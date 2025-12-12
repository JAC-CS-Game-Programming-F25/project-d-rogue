import { getRandomPositiveInteger } from "../../lib/Random.js";
import BulletDamageUpgrade from "../upgrades/BulletDamageUpgrade.js";
import CriticalChangeUpgrade from "../upgrades/CriticalChanceUpgrade.js";
import FreezeShotUpgrade from "../upgrades/FreezeShotUpgrade.js";
import HealthRegenUpgrade from "../upgrades/HealthRegenUpgrade.js";
import MaxHealthUpgrade from "../upgrades/MaxHealthUpgrade.js";
import MovementSpeedUpgrade from "../upgrades/MovementSpeedUpgrade.js";
import PoisonShotUpgrade from "../upgrades/PoisonShotUpgrade.js";
import ReloadSpeedUpgrade from "../upgrades/ReloadSpeedUpgrade.js";

export default class UpgradeFactory {
    static createUpgrades() {
        const upgrades = [
            new MaxHealthUpgrade(),
            new MovementSpeedUpgrade(),
            new ReloadSpeedUpgrade(),
            new PoisonShotUpgrade(),
            new FreezeShotUpgrade(),
            new HealthRegenUpgrade(),
            new BulletDamageUpgrade(),
            new HealthRegenUpgrade(),
            new CriticalChangeUpgrade(),
        ];

        return [
            upgrades[getRandomPositiveInteger(0, upgrades.length - 1)],
            upgrades[getRandomPositiveInteger(0, upgrades.length - 1)],
            upgrades[getRandomPositiveInteger(0, upgrades.length - 1)],
        ];
    }
}
