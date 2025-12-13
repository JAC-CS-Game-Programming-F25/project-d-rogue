import Sprite from "../../lib/Sprite.js";
import GameEntity from "./GameEntity.js";
import {
    CANVAS_WIDTH,
    context,
    images,
    input,
    stateStack,
    timer,
} from "../globals.js";
import ImageName from "../enums/ImageName.js";
import { PlayerConfig } from "../config/PlayerConfig.js";
import Input from "../../lib/Input.js";
import Bullet from "./Bullet.js";
import ProgressBar from "../elements/ProgressBar.js";
import GameStateName from "../enums/GameStateName.js";

export default class Player extends GameEntity {
    static BASIC_SPRITE = { x: 24, y: 30, width: 68, height: 48 };

    constructor(x, y) {
        super(x, y, Player.BASIC_SPRITE.width, Player.BASIC_SPRITE.height);
        this.sprite = new Sprite(
            images.get(ImageName.Player),
            Player.BASIC_SPRITE.x,
            Player.BASIC_SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 1,
            bulletDamage: 2,
            bulletSpeed: 300,
            currentHealth: 15,
            maxHealth: 15,
            movementSpeed: 100,
            critChance: 5,
            xp: 0,
            xpThreshold: 30,
        };

        this.level = 1;

        this.isShooting = false;

        this.healthBar = new ProgressBar(
            this.position.x - 10,
            this.position.y + 65,
            90,
            10,
            this.attributes["currentHealth"],
            this.attributes["currentHealth"],
            "lightgreen"
        );

        // Player has poison shot / fire shot upgrade
        this.damageOverTime = false;

        // Player has freeze shot upgrade
        this.canFreeze = false;

        // Angle of the player and the mouse (in radians)
        this.angle = 0;

        this.bullets = [];

        this.augment = "Basic";
    }

    damage(dmg) {
        this.attributes["currentHealth"] =
            this.attributes["currentHealth"] - dmg;

        this.healthBar.displayValue = this.attributes["currentHealth"];
    }

    heal(amount) {
        this.attributes["currentHealth"] = Math.min(
            this.attributes["maxHealth"],
            this.attributes["currentHealth"] + amount
        );

        this.healthBar.displayValue = this.attributes["currentHealth"];
    }

    gainXP(xp, xpBar) {
        this.attributes["xp"] = this.attributes["xp"] + xp;

        xpBar.displayValue = this.attributes["xp"];

        if (this.attributes["xp"] >= this.attributes["xpThreshold"]) {
            this.attributes["xp"] = 0;
            this.attributes["xpThreshold"] =
                this.attributes["xpThreshold"] + 30;
            xpBar.maxValue = this.attributes["xpThreshold"];
            xpBar.displayValue = this.attributes["xp"];

            this.level += 1;

            return true;
        }

        return false;
    }

    /**
     * Handles movement of the player.
     * This method updates the player's velocity based on input
     * and applies acceleration, deceleration, and speed limits.
     */
    handleMovement() {
        if (input.isKeyHeld(Input.KEYS.A) && input.isKeyHeld(Input.KEYS.D)) {
            this.slowDown();
        } else if (input.isKeyHeld(Input.KEYS.A)) {
            this.moveLeft();
        } else if (input.isKeyHeld(Input.KEYS.D)) {
            this.moveRight();
        } else if (input.isKeyHeld(Input.KEYS.W)) {
            this.moveUp();
        } else if (input.isKeyHeld(Input.KEYS.S)) {
            this.moveDown();
        } else {
            this.slowDown();
        }

        // Set speed to zero if it's close to zero to stop the player
        if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
    }

    moveRight() {
        this.velocity.x = Math.min(
            this.velocity.x + PlayerConfig.acceleration,
            this.attributes["movementSpeed"]
        );
    }

    moveLeft() {
        this.velocity.x = Math.max(
            this.velocity.x - PlayerConfig.acceleration,
            -this.attributes["movementSpeed"]
        );
    }

    moveUp() {
        this.velocity.y = Math.max(
            this.velocity.y - PlayerConfig.acceleration,
            -this.attributes["movementSpeed"]
        );
    }

    moveDown() {
        this.velocity.y = Math.min(
            this.velocity.y + PlayerConfig.acceleration,
            this.attributes["movementSpeed"]
        );
    }

    shootBasic() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        const muzzleOffset = 40;

        this.isShooting = true;

        const muzzleX = cx + Math.cos(this.angle) * muzzleOffset;
        const muzzleY = cy + Math.sin(this.angle) * muzzleOffset;

        this.bullets.push(
            new Bullet(
                muzzleX,
                muzzleY,
                this.angle,
                this.attributes["bulletSpeed"],
                "player"
            )
        );

        timer.addTask(
            () => {},
            1,
            this.attributes["reloadSpeed"],
            () => (this.isShooting = false)
        );
    }

    shootFlankGuard() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        const muzzleOffset = 40;

        const angles = [this.angle, this.angle + Math.PI];

        if (!this.isShooting) {
            this.isShooting = true;

            angles.forEach((angle) => {
                const muzzleX = cx + Math.cos(angle) * muzzleOffset;
                const muzzleY = cy + Math.sin(angle) * muzzleOffset;

                this.bullets.push(
                    new Bullet(
                        muzzleX,
                        muzzleY,
                        angle,
                        this.attributes["bulletSpeed"],
                        "player"
                    )
                );
            });

            timer.addTask(
                () => {},
                1,
                this.attributes["reloadSpeed"],
                () => (this.isShooting = false)
            );
        }
    }

    shootTwin() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        const muzzleOffset = 40; // forward barrel length
        const barrelSpacing = 25; // distance between barrels

        const fx = Math.cos(this.angle);
        const fy = Math.sin(this.angle);

        const px = -Math.sin(this.angle);
        const py = Math.cos(this.angle);

        if (!this.isShooting) {
            this.isShooting = true;

            // Left barrel
            this.bullets.push(
                new Bullet(
                    cx + fx * muzzleOffset - px * barrelSpacing,
                    cy + fy * muzzleOffset - py * barrelSpacing,
                    this.angle,
                    this.attributes["bulletSpeed"],
                    "player"
                )
            );

            // Right barrel
            this.bullets.push(
                new Bullet(
                    cx + fx * muzzleOffset + px * barrelSpacing,
                    cy + fy * muzzleOffset + py * barrelSpacing,
                    this.angle,
                    this.attributes["bulletSpeed"],
                    "player"
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

    shoot() {
        if (this.isShooting) {
            return;
        }

        if (
            this.augment == "Basic" ||
            this.augment == "Sniper" ||
            this.augment == "Machine Gun"
        ) {
            this.shootBasic();
        } else if (this.augment == "Flank Guard") {
            this.shootFlankGuard();
        } else if (this.augment == "Twin") {
            this.shootTwin();
        }
    }

    slowDown() {
        if (this.velocity.x > 0) {
            this.velocity.x = Math.max(
                0,
                this.velocity.x - PlayerConfig.deceleration
            );
        } else if (this.velocity.x < 0) {
            this.velocity.x = Math.min(
                0,
                this.velocity.x + PlayerConfig.deceleration
            );
        }

        if (this.velocity.y > 0) {
            this.velocity.y = Math.max(
                0,
                this.velocity.y - PlayerConfig.deceleration
            );
        } else if (this.velocity.y < 0) {
            this.velocity.y = Math.min(
                0,
                this.velocity.y + PlayerConfig.deceleration
            );
        }
    }

    /**
     * Updates the player's position based on their current velocity.
     * This method also handles collision detection and keeps the player within the map boundaries.
     *
     * @param {number} dt - Delta time (time since last update).
     */
    updatePosition(dt) {
        // Calculate position change
        const dx = this.velocity.x * dt;
        const dy = this.velocity.y * dt;

        // boundaries check
        if (
            this.position.x + dx < 0 ||
            this.position.x + this.dimensions.x + dx > CANVAS_WIDTH
        ) {
            return;
        }

        if (
            this.position.y + dy < 0 ||
            this.position.y + this.dimensions.y + dy > CANVAS_WIDTH
        ) {
            return;
        }

        this.position.x += dx;

        this.position.y += dy;

        this.healthBar.position.x += dx;

        this.healthBar.position.y += dy;
    }

    render() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        context.save();

        context.translate(cx, cy);

        context.rotate(this.angle);

        context.translate(-this.dimensions.x / 2, -this.dimensions.y / 2);

        this.sprite.render(0, 0);

        context.restore();

        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.render();
            });
        }

        this.healthBar.render();
    }

    update(dt) {
        if (this.bullets != []) {
            this.bullets.forEach((bullet) => {
                bullet.update(dt);
            });
        }

        this.updatePosition(dt);
    }
}
