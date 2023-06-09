import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MySphere } from "./MySphere.js";

/**
 * @method constructor
 * @param  {CGFscene} scene - MyScene object
 * @param  {integer} texture - texture used for the panorama effect
 * @param  {integer} radius - used to control the radius of the Sphere
 */
export class MyPanorama extends CGFobject {
    constructor(scene, texture, radius) {
        super(scene);
        this.texture = texture;
        this.radius = radius;
        this.init();
	}

    init(){
        //Initialize scene objects
        this.sphere = new MySphere(this.scene, 100, 100, this.radius, true);

        //Create Sphere Material (Panorama)
        this.panorama = new CGFappearance(this.scene);
        this.panorama.setEmission(1, 1, 1, 1); // Emissive component to activate the texture
        this.panorama.setTexture(this.texture);
        this.panorama.setTextureWrap('REPEAT', 'REPEAT');
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.scene.camera.position[0],this.scene.camera.position[1],this.scene.camera.position[2]);
        this.panorama.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }
}