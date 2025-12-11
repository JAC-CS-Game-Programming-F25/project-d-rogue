import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import BasicEnemy from "../entities/enemies/BasicEnemy.js";
import ShotgunEnemy from "../entities/enemies/ShotgunEnemy.js";
import SniperEnemy from "../entities/enemies/SniperEnemy.js";
import Enemy from "../entities/Enemy.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    context,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
} from "../globals.js";
import Camera from "../services/Camera.js";
import LevelMaker from "../services/LevelMaker.js";

export default class PlayState extends State {
    constructor() {
        super();

        this.scale = 2;

        this.level = 1;

        this.player = new Player(
            VIEWPORT_WIDTH / 2 - Player.BASIC_SPRITE.width / 2,
            VIEWPORT_HEIGHT / 2 - Player.BASIC_SPRITE.height / 2
        );

        this.enemies = LevelMaker.GetNextLevel(this.level, this.player);

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

        this.background.render(0, 0, { x: 3, y: 5 });
        this.player.render();
        this.enemies.forEach((enemy) => enemy.render());

        this.camera.resetTransform(context);

        if (this.enemies.length == 0) {
            this.startNextLevel();
        }
    }

    startNextLevel() {
        this.enemies = LevelMaker.GetNextLevel(this.level++, this.player);
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
