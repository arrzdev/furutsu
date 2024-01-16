import { World, Bodies, Body, Composite, Vector } from "matter-js";
import Fruit from "./fruit";

class Panel {
    constructor(thickness, height, ratio, centerX, centerY, color) {
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

        this.composite = composite;
        this.left = centerX - height * ratio / 2 + thickness / 2;
        this.right = centerX + height * ratio / 2 - thickness / 2;
        this.currentFruit = null;
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
        this.currentFruit = null;
        this.droppedFruit = true;
    }

    fuseFruits(fruitA, fruitB) {
        if (fruitA.canFuse && fruitB.canFuse) {
            fruitA.canFuse = false;
            fruitB.canFuse = false;

            newPosition = Vector.create(
                (fruitA.body.position.x + fruitB.body.position.x) / 2,
                (fruitA.body.position.y + fruitB.body.position.y) / 2
            );

            newFruit = new Fruit(fruitA.evolutionIndex + 1, newPosition.x, newPosition.y)
            World.remove(this.composite, fruitA.body);
            World.remove(this.composite, fruitB.body);
            // TODO fuse fruits
        }
    }
}
export default Panel