import Sprite from "../../lib/Sprite.js";
import GameEntity from "./GameEntity.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    images,
    timer,
} from "../globals.js";
import ImageName from "../enums/ImageName.js";
import BasicEnemy from "./enemies/BasicEnemy.js";
import Bullet from "./Bullet.js";
import ProgressBar from "../elements/ProgressBar.js";

export default class Enemy extends GameEntity {
    static BASIC_SPRITE = { x: 40, y: 890, width: 38, height: 27 };
    static SHOTGUN_SPRITE = { x: 379, y: 896, width: 38, height: 27 };
    static SNIPER_SPRITE = { x: 429, y: 982, width: 44, height: 27 };

    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.angle = 0;

        this.attributes = {};

        this.healthBar = {};

        this.istakingOverTimeDamage = false;
    }

    moveAI(dt) {
        const healtbarYOffset = 40;

        const enemyCenterX = this.position.x + this.dimensions.x / 2;
        const enemyCenterY = this.position.y + this.dimensions.y / 2;

        const playerCenterX =
            this.player.position.x + this.player.dimensions.x / 2;
        const playerCenterY =
            this.player.position.y + this.player.dimensions.y / 2;

        const dx = playerCenterX - enemyCenterX;
        const dy = playerCenterY - enemyCenterY;

        const distance = Math.hypot(dx, dy);

        if (distance == 0) return;

        const nx = dx / distance;
        const ny = dy / distance;

        const speed = this.attributes["movementSpeed"] * dt;

        if (distance <= this.attributes["stopDistance"]) {
            this.position.x -= nx * speed;
            this.position.y -= ny * speed;
        } else {
            this.position.x += nx * speed;
            this.position.y += ny * speed;
        }

        // Clamp enemy inside screen
        this.position.x = Math.max(
            0,
            Math.min(CANVAS_WIDTH - this.dimensions.x, this.position.x)
        );
        this.position.y = Math.max(
            0,
            Math.min(CANVAS_HEIGHT - this.dimensions.y, this.position.y)
        );

        this.healthBar.position.x = this.position.x;
        this.healthBar.position.y =
            this.position.y + this.dimensions.y + healtbarYOffset;
    }

    render() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        context.save();

        context.translate(cx, cy);

        context.rotate(this.angle);

        context.translate(-this.dimensions.x / 2, -this.dimensions.y / 2);

        this.sprite.render(0, 0, { x: 2, y: 2 });

        context.restore();

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.render();
            });
        }

        this.healthBar.render();
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

    damage(dmg) {
        this.attributes["health"] = this.attributes["health"] - dmg;

        this.healthBar.displayValue = this.attributes["health"];
    }

    shoot() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        const muzzleOffset = 40;

        const muzzleX = cx + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = cy + Math.sin(this.angle) * muzzleOffset;

        if (this.isShooting == false) {
            this.isShooting = true;
            this.bullets.push(
                new Bullet(
                    muzzleX,
                    muzzleY,
                    this.angle,
                    this.attributes["bulletSpeed"],
                    "enemy"
                )
            );

            timer.addTask(
                () => {},
                1,
                this.attributes["reloadSpeed"],
                () => (this.isShooting = false)
            );
        }
    }
}
