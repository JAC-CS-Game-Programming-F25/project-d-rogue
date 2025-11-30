# Final Project

-   [ ] Read the [project requirements](https://vikramsinghmtl.github.io/420-5P6-Game-Programming/project/requirements).
-   [ ] Replace the sample proposal below with the one for your game idea.
-   [ ] Get the proposal greenlit by Vik.
-   [ ] Place any assets in `assets/` and remember to update `src/config.json`.
-   [ ] Decide on a height and width inside `src/globals.js`. The height and width will most likely be determined based on the size of the assets you find.
-   [ ] Start building the individual components of your game, constantly referring to the proposal you wrote to keep yourself on track.
-   [ ] Good luck, you got this!

---

# D-Rogue Proposal

## ✒️ Description

In this Diep.io inspired roguelike game, players will control a little tank that has to defeat many randomly generated enemies from a pool to beat levels. When tanks are killed, the player will gain XP and will be able to level up, leading to the roguelike genre. Players will be able to choose from a pool of different upgrades that will allow them to survive the later rounds. Different levels will lead to a single final battle against The Mothership.

## 🕹️ Gameplay

The game will begin with the player at level 1, each level different enemies will be generated for the players to defeat. Each enemy will award different amounts of XP, which will eventually lead to a level up. When the player levels up, the game will pause and switch to a screen with three different upgrades that they can choose from. Things like increasing bullet damage, bullet speed, reload speed or maybe even elemental damage. This loop will continue until a player reaches a certain level threshold (TBD) and they will be able to level up the tank itself. They can pick the "Twin" upgrade which adds a second cannon to the front of the tank which will make the tank shoot two bullets forward, the "Machine Gun" upgrade, which widens the cannon, leading to reload speed being much higher, the "Sniper" Upgrade which will make the cannon longer, leading to longer reload time, but much more damage and bullet speed and the "Flank Guard" upgrade which adds a cannon on the opposite side of the tank, for the enemies sneaking up on you. Gameplay will then continue normally until players reach level 15, the final level where a bossfight against The Mothership will start. The mothership is a tank with 16 cannons all around it that will shoot periodically that will make a more "Bullet-Hell" type of fight.

Once the player wins / loses, they will be sent back to the main menu (it will look GREAT) where they can either start a new run or restart a previous run if they decided to quit during a run.

When hitting "ESC" while player, a pause screen will appear allowing the player to resume or save and quit, reloading the run will restart from the start of the level, not from where they were exactly to make save-scumming less impactful.

## 📃 Requirements

1. The player should be able to start the game.
2. The player should be able to move on the map.
3. The player and enemies should sprites.
4. The player and enemies should be able to shoot bullets.
5. Bullets should be able to move throughout the screen at a constant speed.
6. Bullets should be deleted when off-screen to avoid lag.
7. The player should be able to see their health and the enemies health at all times.
8. Bullets should be able to hit the player and the enemies and be able to affect them.
9. Player should be able to win / lose.
10. Player should have a camera follow them so they can traverse the map.
11. Players should be able to reload their runs so they dont lose them on page exit.
12. When defeated, enemies should give XP to the player so they can level up
13. Enemies should be randomly generated to abide to the roguelike genre.
14. Players should be able to select an upgrade when they reach a certain XP threshold.
15. Players should be able to augment their tank (twin, machine gun, flank guard and sniper) when reaching a certain XP threshold.
16. When all enemies are defeated, the player should go to the next stage.
17. Players should be able to win when The Mothership has been defeated.

### 🤖 State Diagram

![State Diagram](./assets/images/StateDiagram.png)

### 🗺️ Class Diagram

![Class Diagram](./assets/images/ClassDiagram.png)

### 🧵 Wireframes

[Wireframes](https://www.figma.com/design/GuaKjhwyGAeuNuaNuoypJ4/Untitled?node-id=0-1)

### 🎨 Assets

I used [Figma](https://www.figma.com) to create the wireframes. 

The rest will be heavily inspired / taken from the original game [Diep.io](https://www.diep.io)

#### 🖼️ Images

Most Sprites will be taken from these two sprite sheets:

![Color Sheet](./assets/images/SpriteSheetFull.png)
![Player Sheet](./assets/images/SpriteSheetPlayer.jpg)


#### ✏️ Fonts

For fonts, I decided to use the font Ubuntu, as it is the one used by Diep.io, so it leads to a more similar experience to the base game.

-   [Ubuntu](https://fonts.google.com/specimen/Ubuntu)

#### 🔊 Sounds

Sounds will be taken from multiple different sources, but mostly on [Youtube](https://www.youtube.com) or different free sound sites.

(this will be updated as the project is coded.)

### 📚 References

-   [Diep.io](https://www.diep.io)
