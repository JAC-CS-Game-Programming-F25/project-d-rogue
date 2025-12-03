import Vector from "../../lib/Vector.js";

export default class GameEntity {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.velocity = new Vector(0, 0);
        this.sprites = {};
    }

    render() {}

    update(dt) {}

    isCollidingWith(otherEntity) {}
}
