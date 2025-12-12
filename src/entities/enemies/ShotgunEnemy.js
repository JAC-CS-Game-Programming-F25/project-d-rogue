import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { context, images } from "../../globals.js";
import Enemy from "../Enemy.js";
import ProgressBar from "../../elements/ProgressBar.js";

export default class ShotgunEnemy extends Enemy {
    constructor(x, y, player) {
        super(x, y, Enemy.SHOTGUN_SPRITE.width, Enemy.SHOTGUN_SPRITE.height);

        this.sprites = new Sprite(
            images.get(ImageName.AllSprites),
            Enemy.SHOTGUN_SPRITE.x,
            Enemy.SHOTGUN_SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 1.5,
            bulletDamage: 2,
            bulletSpeed: 150,
            movementSpeed: 100,
            stopDistance: 200,
            health: 12,
            xpValue: 15,
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
