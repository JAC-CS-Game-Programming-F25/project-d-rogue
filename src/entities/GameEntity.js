import Vector from "../../lib/Vector.js";
import { isAABBCollision } from "../services/AABBCollision.js";

export default class GameEntity {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.velocity = new Vector(0, 0);
        this.sprite = {};
    }

    render() {}

    update(dt) {}

    isCollidingWith(target) {
        return isAABBCollision(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            target.position.x,
            target.position.y,
            target.dimensions.x,
            target.dimensions.y
        );
    }
}
