import {CGFobject} from '../lib/CGF.js';
import { MyCylinder } from "./MyCylinder.js";
/**
* @method constructor
* @param {CGFscene} scene - MyScene object
* @param {integer} nSticks - number of sticks
* @param {integer} nLayers - number of layers (height)
* @param {integer} scale - value between 0.0 and 1.0 used to scale the nest
* @param {path} texture - path to the desired texture
* @param {vector} position - vector of values for x, y and z to draw the nest
*/
export class MyNest extends CGFobject{
    constructor(scene, nSticks, nLayers, scale, texture, position){
        super(scene);
        this.nSticks = nSticks;
        this.nLayers = nLayers > 2 ? nLayers : 2;
        this.scale = scale;
        this.position = position;
        this.stick = new MyCylinder(this.scene, 4, 6, 10, texture);
        this.initBuffers();
        
    }
    initBuffers() {
        this.stick.initBuffers();
    }
    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position[0],this.position[1],this.position[2]);
        this.scene.scale(this.scale,this.scale,this.scale);

        var ang = 0;
        var alphaAng = 2*Math.PI/this.nSticks;
        for (var s = 0; s < this.nSticks; s++) {
            this.scene.pushMatrix();
            this.scene.rotate(ang, 0, 1, 0);
            this.stick.display();
            this.scene.popMatrix();
            for (var l = 0; l < this.nLayers; l++) {
                this.scene.pushMatrix();
                this.scene.rotate(ang, 0, 1, 0);
                this.scene.translate(10,l,0);
                this.stick.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                this.scene.scale(-1,1,1);
                this.scene.rotate(ang, 0, 1, 0);
                this.scene.translate(10,l,0);
                this.stick.display();
                this.scene.popMatrix();

            }

            ang+=alphaAng;

        }
        this.scene.popMatrix();
    }

    getPosition() {
        return this.position;
    }

    enableNormalViz() {
        this.stick.enableNormalViz();
    }
    disableNormalViz() {
        this.stick.disableNormalViz();
    }
    

    
    // returns true if the distance if below 5 (tweak this value to make the animation more smooth) between the egg and the nest
    distanceFromNest(eggPosition, grabbedEggIndex, eggNestPositions){
        var distance = Math.sqrt(Math.pow(eggPosition[0]-eggNestPositions[grabbedEggIndex][0],2) + Math.pow(eggPosition[2]-eggNestPositions[grabbedEggIndex][2],2));
        if (distance < 4)
            return true;
            
        return false;
    }

    // returns the distance between the egg and the nest
    distanceFromNestCoords(eggPosition, grabbedEggIndex, eggNestPositions) {
        var coords = [];
        coords[0] = eggNestPositions[grabbedEggIndex][0] - eggPosition[0];
        coords[1] = eggNestPositions[grabbedEggIndex][1] - eggPosition[1];
        coords[2] = eggNestPositions[grabbedEggIndex][2] - eggPosition[2];
        return coords;
    }


    }
