import Sprite from "../../../lib/Sprite.js";
import ProgressBar from "../../elements/ProgressBar.js";
import ImageName from "../../enums/ImageName.js";
import { context, images, timer } from "../../globals.js";
import Bullet from "../Bullet.js";
import Enemy from "../Enemy.js";

export default class Mothership extends Enemy {
    static SPRITE = { x: 14, y: 857, width: 212, height: 212 };
    constructor(x, y, player) {
        super(x, y, Mothership.SPRITE.width, Mothership.SPRITE.height, player);

        this.sprite = new Sprite(
            images.get(ImageName.Player),
            Mothership.SPRITE.x,
            Mothership.SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 1,
            bulletDamage: 2,
            bulletSpeed: 300,
            movementSpeed: 0,
            health: 100,
            xpValue: 0,
        };

        this.player = player;

        this.rotation = 0;

        this.bullets = [];

        this.isShooting = false;

        this.healthBar = new ProgressBar(
            200,
            100,
            1500,
            20,
            this.attributes["health"],
            this.attributes["health"],
            "red"
        );
    }

    update(dt) {
        if (this.isShooting == false) {
            this.shoot();
        }

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.update(dt);
            });
        }
    }

    render() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        context.save();

        // move origin to center of boss
        context.translate(cx, cy);

        // rotate around center
        context.rotate(this.rotation);

        // draw sprite centered at origin
        this.sprite.render(-this.dimensions.x / 2, -this.dimensions.y / 2);

        context.restore();

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.render();
            });
        }
    }

    shoot() {
        if (this.isShooting) return;

        this.isShooting = true;

        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        const cannonCount = 16;
        const angleStep = (Math.PI * 2) / cannonCount;

        const muzzleOffset = this.dimensions.x / 2 + 10;

        for (let i = 0; i < cannonCount; i++) {
            const angle = this.rotation + i * angleStep;

            const muzzleX = cx + Math.cos(angle) * muzzleOffset;
            const muzzleY = cy + Math.sin(angle) * muzzleOffset;

            this.bullets.push(
                new Bullet(
                    muzzleX,
                    muzzleY,
                    angle,
                    this.attributes["bulletSpeed"],
                    "enemy"
                )
            );
        }

        // rotate a bit every time we fire
        this.rotation += Math.PI / 32; // adjust for faster/slower spin

        timer.addTask(
            () => {},
            1,
            this.attributes["reloadSpeed"],
            () => (this.isShooting = false)
        );
    }
}
