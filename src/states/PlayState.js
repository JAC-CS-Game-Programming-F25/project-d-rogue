import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js";

export default class PlayState extends State {
    constructor() {
        super();

        this.player = new Player(
            CANVAS_WIDTH / 2 - Player.BASIC_SPRITE.width / 2,
            CANVAS_HEIGHT / 2 - Player.BASIC_SPRITE.height / 2,
            Player.BASIC_SPRITE.width,
            Player.BASIC_SPRITE.height
        );

        this.background = new Sprite(
            images.get(ImageName.Background),
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );
    }

    update(dt) {
        this.player.handleHorizontalMovement();
        this.player.update(dt);
    }

    render() {
        this.background.render(0, 0, { x: 3, y: 5 });
        this.player.render();
    }
}
