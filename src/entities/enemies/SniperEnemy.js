import Sprite from "../../../lib/Sprite.js";
import ProgressBar from "../../elements/ProgressBar.js";
import ImageName from "../../enums/ImageName.js";
import { images } from "../../globals.js";
import Enemy from "../Enemy.js";

export default class SniperEnemy extends Enemy {
    constructor(x, y, player) {
        super(x, y, Enemy.SNIPER_SPRITE.width, Enemy.SNIPER_SPRITE.height);

        this.sprite = new Sprite(
            images.get(ImageName.AllSprites),
            Enemy.SNIPER_SPRITE.x,
            Enemy.SNIPER_SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 2,
            bulletDamage: 3,
            bulletSpeed: 350,
            movementSpeed: 75,
            stopDistance: 450,
            health: 5,
            xpValue: 20,
        };

        this.isShooting = false;

        this.player = player;

        this.bullets = [];

        this.healthBar = new ProgressBar(
            this.position.x - 10,
            this.position.y + 65,
            90,
            10,
            this.attributes["health"],
            this.attributes["health"],
            "lightgreen"
        );
    }
}
