import { getRandomPositiveInteger, oneInXChance } from "../../lib/Random.js";
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
    timer,
} from "../globals.js";
import Camera from "../services/Camera.js";
import LevelMaker from "../services/LevelMaker.js";
import AugmentState from "./AugmentState.js";
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
        this.cleanUpBullets();
        this.player.update(dt);
        this.enemies.forEach((enemy) => enemy.update(dt));
        this.camera.update(dt);
    }

    render() {
        this.camera.applyTransform(context);

        this.drawBackground(context, this.camera);
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

    cleanUpBullets() {
        const bounds = this.camera.getBounds();

        this.player.bullets = this.player.bullets.filter((bullet) => {
            return (
                bullet.position.x + bullet.dimensions.x >= bounds.x &&
                bullet.position.x <= bounds.x + bounds.width &&
                bullet.position.y + bullet.dimensions.y >= bounds.y &&
                bullet.position.y <= bounds.y + bounds.height
            );
        });
    }

    startNextLevel() {
        this.enemies = LevelMaker.GetNextLevel(this.stage++, this.player);

        if (this.stage == 10) {
            stateStack.push(new AugmentState(this.player));
        }
    }

    checkOverTimeDamage(enemy) {
        if (
            this.player.damageOverTime == true &&
            !enemy.isTakingOverTimeDamage
        ) {
            enemy.isTakingOverTimeDamage = true;
            timer.addTask(
                () => {
                    enemy.damage(1);

                    if (enemy.attributes["health"] <= 0) {
                        const indexToRemove = this.enemies.indexOf(enemy);
                        this.enemies.splice(indexToRemove, 1);
                        return;
                    }
                },
                1,
                5,
                () => {
                    enemy.isTakingOverTimeDamage = false;
                }
            );
        }
    }

    checkIfEnemyDead(enemy) {
        if (enemy.attributes["health"] <= 0) {
            const indexToRemove = this.enemies.indexOf(enemy);
            this.enemies.splice(indexToRemove, 1);

            if (this.player.gainXP(enemy.attributes["xpValue"], this.xpBar)) {
                stateStack.push(new UpgradeState(this.player));
            }
        }
    }

    checkFreezeEnemy(enemy) {
        if (this.player.canFreeze == true) {
            enemy.attributes["movementSpeed"] =
                enemy.attributes["movementSpeed"] / 2;

            timer.addTask(
                () => {},
                5,
                5,
                () => {
                    enemy.attributes["movementSpeed"] =
                        enemy.attributes["movementSpeed"] * 2;
                }
            );
        }
    }

    drawBackground(context, camera) {
        const bounds = camera.getBounds();

        // Base color
        context.fillStyle = "#ffffffff";
        context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Grid
        const gridSize = 45;
        context.strokeStyle = "#c2c2c2ff";
        context.lineWidth = 2;

        const startX = Math.floor(bounds.x / gridSize) * gridSize;
        const startY = Math.floor(bounds.y / gridSize) * gridSize;

        for (let x = startX; x < bounds.x + bounds.width; x += gridSize) {
            context.beginPath();
            context.moveTo(x, bounds.y);
            context.lineTo(x, bounds.y + bounds.height);
            context.stroke();
        }

        for (let y = startY; y < bounds.y + bounds.height; y += gridSize) {
            context.beginPath();
            context.moveTo(bounds.x, y);
            context.lineTo(bounds.x + bounds.width, y);
            context.stroke();
        }
    }

    checkCollisions() {
        this.player.bullets.forEach((bullet) => {
            this.enemies.forEach((enemy) => {
                if (enemy.isCollidingWith(bullet)) {
                    const indexToRemove = this.player.bullets.indexOf(bullet);
                    this.player.bullets.splice(indexToRemove, 1);

                    if (
                        getRandomPositiveInteger(0, 100) <
                        this.player.attributes["critChance"]
                    ) {
                        console.log("Critical Hit!");
                        enemy.damage(
                            this.player.attributes["bulletDamage"] * 1.5
                        );
                    } else {
                        enemy.damage(this.player.attributes["bulletDamage"]);
                    }

                    this.checkOverTimeDamage(enemy);

                    this.checkFreezeEnemy(enemy);

                    this.checkIfEnemyDead(enemy);
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
