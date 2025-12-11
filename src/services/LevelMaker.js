import BasicEnemy from "../entities/enemies/BasicEnemy.js";
import ShotgunEnemy from "../entities/enemies/ShotgunEnemy.js";
import SniperEnemy from "../entities/enemies/SniperEnemy.js";

export default class LevelMaker {
    static GetNextLevel(level, player) {
        switch (level) {
            case 1:
                return [new BasicEnemy(25, 100, player)];
            case 2:
                return [
                    new BasicEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                ];
            case 3:
                return [new SniperEnemy(25, 100, player)];
            case 4:
                return [new ShotgunEnemy(25, 100, player)];
            case 5:
                return [
                    new SniperEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                ];
            case 6:
                return [
                    new ShotgunEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                ];
            case 7:
                return [
                    new SniperEnemy(25, 100, player),
                    new ShotgunEnemy(500, 100, player),
                ];
            case 8:
                return [
                    new BasicEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                ];
            case 9:
                return [
                    new SniperEnemy(25, 100, player),
                    new SniperEnemy(500, 100, player),
                ];
            case 10:
                return [
                    new ShotgunEnemy(25, 100, player),
                    new ShotgunEnemy(500, 100, player),
                ];
            case 11:
                return [
                    new BasicEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                    new BasicEnemy(900, 100, player),
                ];
            case 12:
                return [
                    new SniperEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                    new BasicEnemy(900, 100, player),
                ];
            case 13:
                return [
                    new ShotgunEnemy(25, 100, player),
                    new BasicEnemy(500, 100, player),
                    new BasicEnemy(900, 100, player),
                ];
            case 14:
                return [
                    new ShotgunEnemy(25, 100, player),
                    new SniperEnemy(500, 100, player),
                    new BasicEnemy(900, 100, player),
                ];
            case 15:
                // TODO: MOTHERSHIP
                break;
        }
    }
}
