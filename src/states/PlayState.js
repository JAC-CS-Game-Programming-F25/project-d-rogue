import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import ProgressBar from "../elements/ProgressBar.js";
import Player from "../entities/Player.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    context,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    stateStack,
} from "../globals.js";
import Camera from "../services/Camera.js";
import LevelMaker from "../services/LevelMaker.js";
import UpgradeState from "./UpgradeState.js";

export default class PlayState extends State {
    constructor() {
        super();

        this.scale = 2;

        this.stage = 1;

        this.player = new Player(
            VIEWPORT_WIDTH / 2 - Player.BASIC_SPRITE.width / 2,
            VIEWPORT_HEIGHT / 2 - Player.BASIC_SPRITE.height / 2
        );

        this.enemies = LevelMaker.GetNextLevel(this.stage, this.player);

        this.xpBar = new ProgressBar(
            this.player.position.x - 100,
            this.player.position.y - 150,
            1500,
            20,
            this.player.attributes["xpThreshold"],
            this.player.attributes["xp"],
            "blue"
        );

        this.camera = new Camera(
            this.player,
            VIEWPORT_WIDTH,
            VIEWPORT_HEIGHT,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            this.scale
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
        this.player.handleMovement();
        this.checkCollisions();
        this.player.update(dt);
        this.enemies.forEach((enemy) => enemy.update(dt));
        this.camera.update(dt);
    }

    render() {
        this.camera.applyTransform(context);

        this.background.render(0, 0, { x: 3, y: 3 });
        this.player.render();
        this.enemies.forEach((enemy) => enemy.render());

        this.camera.resetTransform(context);

        if (this.enemies.length == 0) {
            this.startNextLevel();
        }

        this.xpBar.render();

        context.font = "100px Ubuntu";
        context.fillText(`Stage: ${this.stage}`, 260, 90);

        context.fillText(
            `XP: ${this.player.attributes["xp"]} / ${this.player.attributes["xpThreshold"]}`,
            1350,
            90
        );

        context.font = "75px Ubuntu";
        context.fillText(`Level: ${this.player.level}`, 850, 90);
    }

    startNextLevel() {
        this.enemies = LevelMaker.GetNextLevel(this.stage++, this.player);
    }

    checkCollisions() {
        this.player.bullets.forEach((bullet) => {
            this.enemies.forEach((enemy) => {
                if (enemy.isCollidingWith(bullet)) {
                    const indexToRemove = this.player.bullets.indexOf(bullet);
                    this.player.bullets.splice(indexToRemove, 1);

                    enemy.damage(this.player.attributes["bulletDamage"]);

                    if (enemy.attributes["health"] <= 0) {
                        const indexToRemove = this.enemies.indexOf(enemy);
                        this.enemies.splice(indexToRemove, 1);

                        if (
                            this.player.gainXP(
                                enemy.attributes["xpValue"],
                                this.xpBar
                            )
                        ) {
                            stateStack.push(new UpgradeState(this.player));
                        }
                    }
                }
            });
        });

        this.enemies.forEach((enemy) => {
            enemy.bullets.forEach((bullet) => {
                if (this.player.isCollidingWith(bullet)) {
                    const indexToRemove = enemy.bullets.indexOf(bullet);
                    enemy.bullets.splice(indexToRemove, 1);

                    this.player.damage(enemy.attributes["bulletDamage"]);
                }
            });
        });
    }
}
