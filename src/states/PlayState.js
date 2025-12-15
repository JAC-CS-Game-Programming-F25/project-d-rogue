import Input from "../../lib/Input.js";
import { getRandomPositiveInteger, oneInXChance } from "../../lib/Random.js";
import Sprite from "../../lib/Sprite.js";
import State from "../../lib/State.js";
import FlankGuard from "../augments/FlankGuard.js";
import MachineGun from "../augments/MachineGun.js";
import Sniper from "../augments/Sniper.js";
import Twin from "../augments/Twin.js";
import ProgressBar from "../elements/ProgressBar.js";
import Mothership from "../entities/enemies/Mothership.js";
import Player from "../entities/Player.js";
import { AugmentName } from "../enums/AugmentName.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import { SoundName } from "../enums/SoundName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    context,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT,
    stateStack,
    timer,
    input,
    saveState,
    sounds,
} from "../globals.js";
import Camera from "../services/Camera.js";
import LevelMaker from "../services/LevelMaker.js";
import AugmentState from "./AugmentState.js";
import GameOverState from "./GameOverState.js";
import PauseState from "./PauseState.js";
import PauseStates from "./PauseState.js";
import UpgradeState from "./UpgradeState.js";
import VictoryState from "./VictoryState.js";

export default class PlayState extends State {
    constructor() {
        super();

        this.scale = 2;

        this.stage = 13;

        this.player = new Player(
            VIEWPORT_WIDTH / 2 - Player.BASIC_SPRITE.width / 2,
            VIEWPORT_HEIGHT / 2 - Player.BASIC_SPRITE.height / 2
        );

        if (saveState.loadData) {
            this.loadSavefile();
        }

        this.enemies = LevelMaker.GetNextStage(this.stage, this.player);

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

        this.isBossLevel = false;
    }

    update(dt) {
        if (input.isKeyPressed(Input.KEYS.ESCAPE)) {
            stateStack.push(new PauseState(this.player, this));
        }

        this.player.handleMovement();
        this.checkCollisions();
        this.cleanUpBullets();
        this.player.update(dt);
        this.enemies = this.enemies.filter((enemy) => !enemy.isDead);
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

        if (!this.isBossLevel) {
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
        } else {
            context.font = "100px Kungfu";
            context.fillText(`The Mothership`, 650, 90);
            if (this.enemies.length > 0) {
                this.enemies[0].healthBar.render();
            }
        }
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

        this.enemies.forEach((enemy) => {
            enemy.bullets = enemy.bullets.filter((bullet) => {
                return (
                    bullet.position.x + bullet.dimensions.x >= bounds.x &&
                    bullet.position.x <= bounds.x + bounds.width &&
                    bullet.position.y + bullet.dimensions.y >= bounds.y &&
                    bullet.position.y <= bounds.y + bounds.height
                );
            });
        });
    }

    loadSavefile() {
        const raw = localStorage.getItem("save");
        if (!raw) return false;

        const data = JSON.parse(raw);

        this.stage = data.stage;

        this.player.level = data.player.level;

        // Restore attributes
        Object.assign(this.player.attributes, data.player.attributes);

        // Restore XP
        this.player.attributes.xp = data.player.xp;
        this.player.attributes.xpThreshold = data.player.xpThreshold;

        this.player.damageOverTime = data.player.damageOverTime;
        this.player.canFreeze = data.player.canFreeze;

        this.restoreAugment(data.player.augment);
    }

    restoreAugment(augment) {
        const augments = [
            new Twin(),
            new Sniper(),
            new MachineGun(),
            new FlankGuard(),
        ];

        switch (augment) {
            case AugmentName.Twin:
                augments[0].applyEffect(this.player);
                return;
            case AugmentName.Sniper:
                augments[1].applyEffect(this.player);
                return;

            case AugmentName.MachineGun:
                augments[2].applyEffect(this.player);
                return;

            case AugmentName.FlankGuard:
                augments[3].applyEffect(this.player);
                return;
        }
    }

    startNextLevel() {
        this.stage += 1;
        this.enemies = LevelMaker.GetNextStage(this.stage, this.player);

        if (this.stage == 10) {
            stateStack.push(new AugmentState(this.player));
            sounds.play(SoundName.Augment);
        }

        if (this.stage == 15) {
            this.isBossLevel = true;
        }
    }

    checkOverTimeDamage(enemy) {
        if (!this.player.damageOverTime) return;

        if (enemy.isTakingOverTimeDamage) return;

        enemy.isTakingOverTimeDamage = true;

        enemy.dotTimer = timer.addTask(
            () => {
                if (enemy.attributes["health"] <= 0) {
                    enemy.isDead = true;
                }

                enemy.damage(1);
            },
            1,
            5,
            () => {
                enemy.isTakingOverTimeDamage = false;
            }
        );
    }

    checkIfEnemyDead(enemy) {
        if (enemy.attributes["health"] <= 0) {
            enemy.isDead = true;

            if (this.player.gainXP(enemy.attributes["xpValue"], this.xpBar)) {
                sounds.play(SoundName.LevelUp);
                stateStack.push(new UpgradeState(this.player));
            }

            if (enemy instanceof Mothership) {
                stateStack.pop();
                stateStack.push(new VictoryState());
            }
        }
    }

    checkIfPlayerDead(player) {
        if (player.attributes["currentHealth"] <= 0) {
            stateStack.push(new GameOverState());
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
                        enemy.damage(
                            this.player.attributes["bulletDamage"] * 1.5
                        );
                        enemy.gotCrit = true;
                    } else {
                        enemy.damage(this.player.attributes["bulletDamage"]);
                    }

                    sounds.play(SoundName.Hit);

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
                    sounds.play(SoundName.Hit);

                    this.checkIfPlayerDead(this.player);
                }
            });
        });
    }
}
