import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameEntity from "./GameEntity.js";

export default class Bullet extends GameEntity {
    static ENEMY_BULLET_SPRITE = { x: 450, y: 1124, width: 12, height: 12 };
    static PLAYER_BULLET_SPRITE = { x: 616, y: 214, width: 15, height: 15 };

    constructor(x, y, angle, speed, type) {
        // red bullet if an enemy shot it
        if (type == "enemy") {
            super(
                x,
                y,
                Bullet.ENEMY_BULLET_SPRITE.width,
                Bullet.ENEMY_BULLET_SPRITE.height
            );

            this.sprite = new Sprite(
                images.get(ImageName.AllSprites),
                Bullet.ENEMY_BULLET_SPRITE.x,
                Bullet.ENEMY_BULLET_SPRITE.y,
                this.dimensions.x,
                this.dimensions.y
            );
        }

        // blue bullet if an enemy shot it
        if (type == "player") {
            super(
                x,
                y,
                Bullet.PLAYER_BULLET_SPRITE.width,
                Bullet.PLAYER_BULLET_SPRITE.height
            );

            this.sprite = new Sprite(
                images.get(ImageName.Player),
                Bullet.PLAYER_BULLET_SPRITE.x,
                Bullet.PLAYER_BULLET_SPRITE.y,
                this.dimensions.x,
                this.dimensions.y
            );
        }

        this.speed = speed;
        this.angle = angle;
    }

    update(dt) {
        this.move(dt);
    }

    move(dt) {
        this.position.x += Math.cos(this.angle) * this.speed * dt;
        this.position.y += Math.sin(this.angle) * this.speed * dt;
    }

    render() {
        this.sprite.render(this.position.x, this.position.y);
    }
}
