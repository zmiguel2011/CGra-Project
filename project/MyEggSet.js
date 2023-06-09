import {CGFobject} from '../lib/CGF.js';
import { MyBirdEgg } from "./MyBirdEgg.js";
/**
* @method constructor
* @param {CGFscene} scene - MyScene object
* @param {integer} scale - value between 0.0 and 1.0 used to scale the eggs
* @param {path} texture - path to the desired texture
* @param {float} eggFactorNorth - values between 0.0 and 1.0 to determine the deforming factor of the egg (normally it's closer to 1.0)
* @param {float} eggFactorSouth - values between 0.0 and 1.0 to determine the deforming factor of the egg  (normally it's closer to 1.0)
*/
export class MyEggSet extends CGFobject{
    constructor(scene, nEggs, scale, texture, eggFactorNorth, eggFactorSouth, nest){
        super(scene);
        this.nEggs = nEggs > 4 ? nEggs : 4; // the minimum number of Eggs is 4
        this.scale = scale;
        this.egg = new MyBirdEgg(this.scene, scale, texture, eggFactorNorth, eggFactorSouth);
        this.nest = nest; // nest center
        this.positions = []; // eggs' intial positions
        this.nestPositions = []; // eggs' nest positions
        this.rotations = [];
        this.activeEggs = []; // eggs that are drawn in intial positions
        this.eggsInNest = []; // eggs that are drawn in their nest positions
        this.initBuffers();
        this.createPositions();
    }
    initBuffers() {
        this.egg.initBuffers();
    }
    createPositions() {
        var ang = 0;
        var angStep = (2 * Math.PI) / this.nEggs;

        for(var i = 0; i < this.nEggs; i++) {
            if (i % 2 == 0) {
                // Returns a random integer from 5 to 20:
                var x = Math.floor(Math.random() * (20 - 5 + 1)) + 5; 
                var z = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
            }
            else if (i % 3 == 0) {
                // Returns a random integer from -20 to -5:
                var x = Math.floor(Math.random() * (-5 + 20 + 1)) - 20; 
                // Returns a random integer from 5 to 20:
                var z = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
            }
            else if (i % 5 == 0) {
                // Returns a random integer from 5 to 20:
                var x = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
                // Returns a random integer from -20 to -5:
                var z = Math.floor(Math.random() * (-5 + 20 + 1)) - 20; 
            }
            else {
                // Returns a random integer from -20 to -5:
                var x = Math.floor(Math.random() * (-5 + 20 + 1)) - 20; 
                var z = Math.floor(Math.random() * (-5 + 20 + 1)) - 20;
            }
            this.positions.push([x,-7.0,z]) // -7.0 is the chosen value for the "ground"
            
            // Returns a random integer from 3 to 8:
            var r = Math.floor(Math.random() * 8) + 3;
            this.rotations.push(r);
            this.activeEggs.push(true); // all eggs are in their inital postions at the beginning

            // create nEggs positions for the eggs to be place in the nest
            x = Math.cos(ang) + this.nest[0];
            z = Math.sin(ang) + this.nest[2];
            ang += angStep;
            this.nestPositions.push([x,-6.5,z]) // -5.5 is the chosen value for the bottom of the nest
            this.eggsInNest.push(false); // all eggs are in their inital postions at the beginning
        }
    }
    getEggPositions() {
        return this.positions;
    }
    getEggNestPositions() {
        return this.nestPositions;
    }
    setInactiveEgg(index) {
        this.activeEggs[index] = false;
    }
    setEggInNest(index) {
        this.eggsInNest[index] = true;
    }

    display() {
        for(var i = 0; i < this.nEggs; i++) {
            
            if(this.activeEggs[i]){
                this.scene.pushMatrix();
                this.scene.translate(this.positions[i][0], this.positions[i][1], this.positions[i][2]);
                if (i % 2 == 0)
                    this.scene.rotate(Math.PI/this.rotations[i],1,0,0);
                else if (i % 3 == 0)
                    this.scene.rotate(Math.PI/this.rotations[i],0,1,0);
                else
                    this.scene.rotate(Math.PI/this.rotations[i],0,0,1);

                this.egg.display();
                this.scene.popMatrix();
            }
            else if(this.eggsInNest[i]) {
                    this.scene.pushMatrix();
                    this.scene.translate(this.nestPositions[i][0], this.nestPositions[i][1], this.nestPositions[i][2]);
                    if (i % 2 == 0)
                        this.scene.rotate(Math.PI/this.rotations[i],1,0,0);
                    else if (i % 3 == 0)
                        this.scene.rotate(Math.PI/this.rotations[i],0,1,0);
                    else
                        this.scene.rotate(Math.PI/this.rotations[i],0,0,1);

                    this.egg.display();
                    this.scene.popMatrix();

            }
        }

    }


    distanceFromBird(birdPosition) {
        for (var i = 0; i < this.positions.length; i++) {
            if(this.activeEggs[i]) {
                var distance = Math.sqrt(Math.pow((this.positions[i][0] - birdPosition[0]), 2) + Math.pow((this.positions[i][1] - birdPosition[1]), 2) + Math.pow((this.positions[i][2] - birdPosition[2]), 2));
                if (distance < 2.5) {
                    this.setInactiveEgg(i);
                    return {
                        boolean: true,
                        index: i,
                    }
                } 
            }
        }

        return {
            boolean: false,
            index: undefined,
        }
    }




}