import Sprite from "../../lib/Sprite.js";
import GameEntity from "./GameEntity.js";
import {
    canvas,
    context,
    images,
    input,
    timer,
    VIEWPORT_HEIGHT,
    VIEWPORT_WIDTH,
} from "../globals.js";
import ImageName from "../enums/ImageName.js";
import { PlayerConfig } from "../config/PlayerConfig.js";
import Input from "../../lib/Input.js";
import Bullet from "./Bullet.js";
import ProgressBar from "../elements/ProgressBar.js";

export default class Player extends GameEntity {
    static BASIC_SPRITE = { x: 24, y: 30, width: 68, height: 48 };

    constructor(x, y) {
        super(x, y, Player.BASIC_SPRITE.width, Player.BASIC_SPRITE.height);
        this.sprites = new Sprite(
            images.get(ImageName.Player),
            Player.BASIC_SPRITE.x,
            Player.BASIC_SPRITE.y,
            this.dimensions.x,
            this.dimensions.y
        );

        this.attributes = {
            reloadSpeed: 1,
            bulletDamage: 1,
            bulletSpeed: 300,
            currentHealth: 15,
            maxHealth: 15,
            movementSpeed: 100,
            critChance: 2,
        };

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

        // Angle of the player and the mouse (in radians)
        this.angle = 0;

        this.bullets = [];
    }

    damage(dmg) {
        this.attributes["currentHealth"] =
            this.attributes["currentHealth"] - dmg;

        this.healthBar.displayValue = this.attributes["currentHealth"];
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
            PlayerConfig.maxSpeed
        );
    }

    moveLeft() {
        this.velocity.x = Math.max(
            this.velocity.x - PlayerConfig.acceleration,
            -PlayerConfig.maxSpeed
        );
    }

    moveUp() {
        this.velocity.y = Math.max(
            this.velocity.y - PlayerConfig.acceleration,
            -PlayerConfig.maxSpeed
        );
    }

    moveDown() {
        this.velocity.y = Math.min(
            this.velocity.y + PlayerConfig.acceleration,
            PlayerConfig.maxSpeed
        );
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

        this.position.x += dx;

        this.position.y += dy;

        this.healthBar.position.x += dx;

        this.healthBar.position.y += dy;

        //TODO: Keep player within horizontal map boundaries
        // this.player.position.x = Math.max(
        //     0,
        //     Math.min(
        //         Math.round(this.player.position.x),
        //         this.player.map.width * Tile.SIZE - this.player.dimensions.x
        //     )
        // );
    }

    render() {
        const cx = this.position.x + this.dimensions.x / 2;
        const cy = this.position.y + this.dimensions.y / 2;

        context.save();

        context.translate(cx, cy);

        context.rotate(this.angle);

        context.translate(-this.dimensions.x / 2, -this.dimensions.y / 2);

        this.sprites.render(0, 0);

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
