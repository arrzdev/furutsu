import { World, Bodies, Body, Composite, Vector, Events } from "matter-js";
import fruitsInfo from "../common/fruits";
import Fruit from "./fruit";

class Panel {
    constructor(engine, thickness, height, ratio, centerX, centerY, color) {
        var composite = Composite.create();

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

        Composite.add(composite, [bottomBar, leftBar, rightBar]);

        this.engine = engine;
        this.composite = composite;

        this.left = centerX - height * ratio / 2 + thickness / 2;
        this.right = centerX + height * ratio / 2 - thickness / 2;

        this.currentFruit = null;
        this.active = true;
        this.fruits = [];

        Events.on(this.engine, 'collisionStart', this.handleCollision.bind(this));
    }

    changeFruit(fruit) {
        this.currentFruit = fruit;
        Body.setPosition(fruit.body, Vector.create(
            this.left + (this.right - this.left) / 2, fruit.radius + 5));
        Composite.add(this.composite, fruit.body);
    }

    goLeft(speed) {
        if (this.currentFruit === null) {
            return;
        }
        var newPosX = this.currentFruit.body.position.x - speed;
        if (newPosX < this.left + this.currentFruit.radius * 2) {
            newPosX = this.left + this.currentFruit.radius * 2;
        }
        var newPos = Vector.create(newPosX, this.currentFruit.body.position.y)
        Body.setPosition(this.currentFruit.body, newPos);
    }

    goRigth(speed) {
        if (this.currentFruit === null) {
            return;
        }
        var newPosX = this.currentFruit.body.position.x + speed;
        if (newPosX > this.right - this.currentFruit.radius * 2) {
            newPosX = this.right - this.currentFruit.radius * 2;
        }
        var newPos = Vector.create(newPosX, this.currentFruit.body.position.y)
        Body.setPosition(this.currentFruit.body, newPos);
    }

    dropFruit() {
        if (this.currentFruit === null) {
            return;
        }
        this.currentFruit.body.isSleeping = false;
        this.currentFruit.canFuse = true;
        this.fruits.push(this.currentFruit);
        this.currentFruit = null;
        this.droppedFruit = true;
    }

    fuseFruits(fruitA, fruitB) {
        fruitA.canFuse = false;
        fruitB.canFuse = false;

        console.log("Fusing " + fruitA.name + " and " + fruitB.name)

        var newPosition = Vector.create(
            (fruitA.body.position.x + fruitB.body.position.x) / 2,
            (fruitA.body.position.y + fruitB.body.position.y) / 2
        );

        var code = fruitsInfo.find((fruit) =>
            fruit.evolutionIndex === fruitA.evolutionIndex + 1).fruitCode;

        var newFruit = new Fruit(code, newPosition.x, newPosition.y)
        newFruit.body.isSleeping = false;
        newFruit.canFuse = true;

        World.remove(this.composite, fruitA.body);
        World.remove(this.composite, fruitB.body);
        Composite.add(this.composite, newFruit.body);
        this.fruits.push(newFruit);
    }

    handleCollision(event) {
        for (let pair of event.pairs) {
            // Get bodies from this composite, only
            if (!Composite.allBodies(this.composite).includes(pair.bodyA) ||
                !Composite.allBodies(this.composite).includes(pair.bodyB)) {
                continue;
            }

            var fruitA = this.fruits.find((fruit) => fruit.body === pair.bodyA);
            var fruitB = this.fruits.find((fruit) => fruit.body === pair.bodyB);

            if (fruitA === undefined || fruitB === undefined) {
                continue;
            }

            console.log("Collision between " + fruitA.name + " and " + fruitB.name);

            if (fruitA.canFuse && fruitB.canFuse && fruitA.evolutionIndex === fruitB.evolutionIndex) {
                this.fuseFruits(fruitA, fruitB);
            }
        }
    }
}

export default Panel