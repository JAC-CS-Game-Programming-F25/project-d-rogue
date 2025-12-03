import Sprite from "../../lib/Sprite.js";
import GameEntity from "./GameEntity.js";
import { images, input } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import { PlayerConfig } from "../config/PlayerConfig.js";
import Input from "../../lib/Input.js";

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
    }
    /**
     * Handles horizontal movement of the player.
     * This method updates the player's horizontal velocity based on input
     * and applies acceleration, deceleration, and speed limits.
     */
    handleHorizontalMovement() {
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
        this.velocity.x = Math.max(
            this.velocity.x + PlayerConfig.acceleration,
            PlayerConfig.maxSpeed
        );
    }

    moveUp() {
        this.velocity.y = Math.min(
            this.velocity.y - PlayerConfig.acceleration,
            PlayerConfig.maxSpeed
        );
    }

    moveDown() {
        this.velocity.y = Math.max(
            this.velocity.y + PlayerConfig.acceleration,
            -PlayerConfig.maxSpeed
        );
    }

    moveLeft() {
        this.velocity.x = Math.max(
            this.velocity.x - PlayerConfig.acceleration,
            -PlayerConfig.maxSpeed
        );
    }

    slowDown() {
        console.log();
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

        //TODO: Keep player within horizontal map boundaries
        // this.player.position.x = Math.max(
        //     0,
        //     Math.min(
        //         Math.round(this.player.position.x),
        //         this.player.map.width * Tile.SIZE - this.player.dimensions.x
        //     )
        // );

        // Round vertical position to avoid sub-pixel rendering
        this.position.y = Math.round(this.position.y);
    }

    render() {
        this.sprites.render(this.position.x, this.position.y);
    }

    update(dt) {
        this.updatePosition(dt);
    }
}
