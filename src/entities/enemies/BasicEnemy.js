import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { context, images } from "../../globals.js";
import Enemy from "../Enemy.js";
import ProgressBar from "../../elements/ProgressBar.js";

export default class BasicEnemy extends Enemy {
    constructor(x, y, player) {
        super(x, y, Enemy.BASIC_SPRITE.width, Enemy.BASIC_SPRITE.height);

        this.sprite = new Sprite(
            images.get(ImageName.AllSprites),
            Enemy.BASIC_SPRITE.x,
            Enemy.BASIC_SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 1,
            bulletDamage: 1,
            bulletSpeed: 300,
            movementSpeed: 150,
            stopDistance: 350,
            health: 8,
            xpValue: 10,
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
