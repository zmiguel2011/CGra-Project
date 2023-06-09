import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import { MyEllipsoid } from "./MyEllipsoid.js";
/**
* @method constructor
* @param {CGFscene} scene - MyScene object
* @param {integer} scale - value between 0.0 and 1.0 used to scale the egg
* @param {path} texture - path to the desired texture
* @param {float} eggFactorNorth - values between 0.0 and 1.0 to determine the deforming factor of the egg (normally it's closer to 1.0)
* @param {float} eggFactorSouth - values between 0.0 and 1.0 to determine the deforming factor of the egg  (normally it's closer to 1.0)
*/
export class MyBirdEgg extends CGFobject{
    constructor(scene, scale, texture, eggFactorNorth, eggFactorSouth){
        super(scene);
        this.scale = scale;
        this.texture = new CGFtexture(this.scene, texture);
        this.eggFactorNorth = eggFactorNorth;
        this.eggFactorSouth = eggFactorSouth;
        this.createMaterials();
        this.createPieces();
        this.initBuffers();
    }
    createMaterials() {
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(10.0);
        this.material.setTexture(this.texture);

    }
    createPieces() {
        this.egg = new MyEllipsoid(this.scene, 10, 10, this.material, 1, 1.5, 1, true, this.eggFactorNorth, this.eggFactorSouth);
    }
    initBuffers() {
        this.egg.initBuffers();
    }
    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.scale,this.scale,this.scale);
        this.egg.display();
        this.scene.popMatrix();
    }
}