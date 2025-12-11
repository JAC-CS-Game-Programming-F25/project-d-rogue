import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { context, images } from "../../globals.js";
import Enemy from "../Enemy.js";

export default class BasicEnemy extends Enemy {
    constructor(x, y, player) {
        super(x, y, Enemy.BASIC_SPRITE.width, Enemy.BASIC_SPRITE.height);

        this.sprites = new Sprite(
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
        };

        this.isShooting = false;

        this.player = player;

        this.bullets = [];
    }

    render() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        context.save();

        context.translate(cx, cy);

        context.rotate(this.angle);

        context.translate(-this.dimensions.x / 2, -this.dimensions.y / 2);

        this.sprites.render(0, 0, { x: 2, y: 2 });

        context.restore();

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.render();
            });
        }
    }

    update(dt) {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;

        this.angle = Math.atan2(dy, dx);

        this.moveAI(dt);

        if (this.isShooting == false) {
            this.shoot();
        }

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.update(dt);
            });
        }
    }
}
