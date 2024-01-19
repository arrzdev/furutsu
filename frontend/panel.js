import { World, Bodies, Body, Composite, Vector, Events } from "matter-js";

class Fruit {
    constructor(name, sprite, evolutionIndex, radius, posX, posY) {
        this.name = name;
        this.evolutionIndex = evolutionIndex;
        this.radius = radius;
        this.body = Bodies.circle(posX, posY, this.radius, {
            isSleeping: true,
            render: {
                sprite: {
                    texture: sprite.src,
                    yOffset: (sprite.height - sprite.width) / (sprite.height * 2)
                },
                opacity: 2
            }
        });

        this.inGame = false;
        this.canFuse = false;
    };
}

export default class Panel {
    constructor(gameMode, thickness, height, ratio, centerX, centerY, color, fruits) {
        let composite = Composite.create();

        const leftBar = Bodies.rectangle(
            centerX - height * ratio / 2 + thickness / 2,
            centerY, thickness, height, {
            isStatic: true,
            render: { fillStyle: color }
        });

        const rightBar = Bodies.rectangle(
            centerX + height * ratio / 2 - thickness / 2,
            centerY,
            thickness,
            height, {
            isStatic: true,
            render: { fillStyle: color }
        });

        const bottomBar = Bodies.rectangle(
            centerX,
            centerY + height / 2 - thickness / 2,
            height * ratio,
            thickness, {
            isStatic: true,
            render: { fillStyle: color }
        });

        const deathZone = Bodies.rectangle(
            centerX,
            centerY - height / 2 - thickness * 2.5,
            height * ratio,
            thickness * 3, {
            isStatic: true,
            isSensor: true,
            render: { opacity: 0 }
        });

        Composite.add(composite, [
            bottomBar,
            leftBar,
            rightBar,
            deathZone,]);

        this.gameMode = gameMode;
        this.composite = composite;

        this.left = centerX - height * ratio / 2 + thickness;
        this.right = centerX + height * ratio / 2 - thickness;
        this.top = centerY - height / 2 - thickness;
        this.pointer = centerX;

        this.deathZone = deathZone;
        this.currentFruit = null;
        this.fruitsInGame = [];

        this.fruitsInfo = fruits;

        Events.on(this.gameMode.engine, 'collisionStart', this.handleCollision.bind(this));
    }

    changeFruit(fruitCode) {
        let newFruit = this.fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode);

        if (this.pointer < this.left + newFruit.radius) {
            this.pointer = this.left + newFruit.radius;
        }
        if (this.pointer > this.right - newFruit.radius) {
            this.pointer = this.right - newFruit.radius;
        }

        this.currentFruit = new Fruit(
            newFruit.name,
            newFruit.sprite,
            newFruit.evolutionIndex,
            newFruit.radius,
            this.pointer,
            this.top - newFruit.radius / 2);

        this.currentFruit.body.isSensor = true
        Composite.add(this.composite, this.currentFruit.body);
    }

    goLeft(speed) {
        if (this.currentFruit === null) {
            return;
        }
        let newPosX = this.pointer - speed;
        if (newPosX < this.left + this.currentFruit.radius) {
            newPosX = this.left + this.currentFruit.radius;
        }
        let newPos = Vector.create(newPosX, this.currentFruit.body.position.y)
        this.pointer = newPosX;
        Body.setPosition(this.currentFruit.body, newPos);
    }

    goRigth(speed) {
        if (this.currentFruit === null) {
            return;
        }
        let newPosX = this.pointer + speed;
        if (newPosX > this.right - this.currentFruit.radius) {
            newPosX = this.right - this.currentFruit.radius;
        }
        let newPos = Vector.create(newPosX, this.currentFruit.body.position.y)
        this.pointer = newPosX;
        Body.setPosition(this.currentFruit.body, newPos);
    }

    dropFruit() {
        if (this.currentFruit === null) {
            return;
        }
        this.currentFruit.body.isSleeping = false;
        this.currentFruit.canFuse = true;
        this.currentFruit.body.isSensor = false;
        this.fruitsInGame.push(this.currentFruit);
        this.currentFruit = null;
    }

    fuseFruits(fruitA, fruitB) {
        fruitA.canFuse = false;
        fruitB.canFuse = false;

        // console.log("Fusing " + fruitA.name + " and " + fruitB.name)

        let newPosition = Vector.create(
            (fruitA.body.position.x + fruitB.body.position.x) / 2,
            (fruitA.body.position.y + fruitB.body.position.y) / 2
        );

        let evolutionIndex = fruitA.evolutionIndex + 1;
        if (evolutionIndex > 10) {
            World.remove(this.composite, fruitA.body);
            World.remove(this.composite, fruitB.body);
            return;
        }

        let fruit = this.fruitsInfo.find((fruit) => fruit.evolutionIndex === evolutionIndex);

        let newFruit = new Fruit(
            fruit.name,
            fruit.sprite,
            evolutionIndex,
            fruit.radius,
            newPosition.x,
            newPosition.y)

        newFruit.body.isSleeping = false;
        newFruit.canFuse = true;

        World.remove(this.composite, fruitA.body);
        World.remove(this.composite, fruitB.body);
        Composite.add(this.composite, newFruit.body);
        this.fruitsInGame.push(newFruit);
    }

    handleCollision(event) {
        for (let pair of event.pairs) {
            // Get bodies from this composite, only
            if (!Composite.allBodies(this.composite).includes(pair.bodyA) ||
                !Composite.allBodies(this.composite).includes(pair.bodyB)) {
                continue;
            }

            let fruitA = this.fruitsInGame.find((fruit) => fruit.body === pair.bodyA);
            let fruitB = this.fruitsInGame.find((fruit) => fruit.body === pair.bodyB);

            if (fruitA != undefined && fruitA.inGame && pair.bodyB === this.deathZone) {
                this.gameMode.gameOver();
                return;
            }
            if (fruitB != undefined && fruitB.inGame && pair.bodyA === this.deathZone) {
                this.gameMode.gameOver();
                return;
            }

            if (fruitA != undefined && !fruitA.inGame) {
                fruitA.inGame = true;
            }
            if (fruitB != undefined && !fruitB.inGame) {
                fruitB.inGame = true;
            }

            if (fruitA === undefined || fruitB === undefined) {
                continue;
            }

            // console.log("Collision between " + fruitA.name + " and " + fruitB.name);

            if (fruitA.canFuse && fruitB.canFuse && fruitA.evolutionIndex === fruitB.evolutionIndex) {
                this.fuseFruits(fruitA, fruitB);
            }
        }
    }
}