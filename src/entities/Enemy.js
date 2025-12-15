import Animation from "../../lib/Animation.js";
import Easing from "../../lib/Easing.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    images,
    timer,
} from "../globals.js";
import Bullet from "./Bullet.js";
import GameEntity from "./GameEntity.js";

export default class Enemy extends GameEntity {
    static BASIC_SPRITE = { x: 40, y: 890, width: 38, height: 27 };
    static SHOTGUN_SPRITE = { x: 379, y: 896, width: 38, height: 27 };
    static SNIPER_SPRITE = { x: 429, y: 982, width: 44, height: 27 };

    static EXPLOSION_ANIMATION = [
        { x: 24, y: 411, width: 13, height: 12 },
        { x: 84, y: 407, width: 23, height: 23 },
        { x: 143, y: 404, width: 32, height: 29 },
        { x: 206, y: 404, width: 34, height: 30 },
        { x: 269, y: 404, width: 36, height: 32 },
        { x: 396, y: 403, width: 36, height: 29 },
    ];

    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.angle = 0;

        this.attributes = {};

        this.healthBar = {};

        this.istakingOverTimeDamage = false;

        this.isDead = false;

        this.gotCrit = false;

        this.critAnimation = new Animation(
            Enemy.EXPLOSION_ANIMATION.map(
                (frame) =>
                    new Sprite(
                        images.get(ImageName.ExplosionSheet),
                        frame.x,
                        frame.y,
                        frame.width,
                        frame.height
                    )
            ),
            0.1,
            1
        );
    }

    moveAI(dt) {
        const healthBarYOffset = 40;

        const enemyCenterX = this.position.x + this.dimensions.x / 2;
        const enemyCenterY = this.position.y + this.dimensions.y / 2;

        const playerCenterX =
            this.player.position.x + this.player.dimensions.x / 2;
        const playerCenterY =
            this.player.position.y + this.player.dimensions.y / 2;

        // vector pointing from enemy to player
        const directionX = playerCenterX - enemyCenterX;
        const directionY = playerCenterY - enemyCenterY;

        const distanceToPlayer = Math.hypot(directionX, directionY);

        if (distanceToPlayer === 0) return;

        // normalized direction (unit vector)
        const normalizedDirectionX = directionX / distanceToPlayer;
        const normalizedDirectionY = directionY / distanceToPlayer;

        const movementAmount = this.attributes["movementSpeed"] * dt;

        if (distanceToPlayer <= this.attributes["stopDistance"]) {
            // move away from the player
            this.position.x -= normalizedDirectionX * movementAmount;
            this.position.y -= normalizedDirectionY * movementAmount;
        } else {
            // move toward the player
            this.position.x += normalizedDirectionX * movementAmount;
            this.position.y += normalizedDirectionY * movementAmount;
        }

        // clamp enemy inside the screen
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
            this.position.y + this.dimensions.y + healthBarYOffset;
    }

    render() {
        const centerX = this.position.x + this.dimensions.x / 2;
        const centerY = this.position.y + this.dimensions.y / 2;

        context.save();

        context.translate(centerX, centerY);

        context.rotate(this.angle);

        context.translate(-this.dimensions.x / 2, -this.dimensions.y / 2);

        this.sprite.render(0, 0, { x: 2, y: 2 });

        context.restore();

        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet) => {
                bullet.render();
            });
        }

        this.healthBar.render();

        if (this.gotCrit) {
            const currentFrame = this.critAnimation.getCurrentFrame();

            currentFrame.render(
                this.position.x +
                    this.dimensions.x / 2 -
                    currentFrame.width / 2,
                this.position.y +
                    this.dimensions.y / 2 -
                    currentFrame.height / 2,
                { x: 2, y: 2 }
            );
        }
    }

    update(dt) {
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;

        this.angle = Math.atan2(dy, dx);

        // always move enemy
        this.moveAI(dt);

        if (this.isShooting == false) {
            this.shoot();
        }

        if (this.bullets.length > 0) {
            this.bullets.forEach((bullet) => {
                bullet.update(dt);
            });
        }

        // play explosion animation if enemy got crit
        if (this.gotCrit) {
            this.critAnimation.update(dt);

            if (this.critAnimation.isDone()) {
                this.critAnimation.refresh();
                this.gotCrit = false;
            }
        }
    }

    damage(dmg) {
        this.attributes["health"] -= dmg;

        this.healthBar.currentValue = this.attributes["health"];

        timer.tween(
            this.healthBar,
            { displayValue: this.healthBar.currentValue },
            0.5,
            Easing.easeOutQuad
        );
    }

    shoot() {
        const centerX = this.position.x + this.dimensions.x / 2;
        const centerY = this.position.y + this.dimensions.y / 2;

        const muzzleOffset = 40;

        const muzzleX = centerX + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = centerY + Math.sin(this.angle) * muzzleOffset;

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
