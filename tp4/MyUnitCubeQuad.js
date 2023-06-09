import {CGFobject, CGFtexture, CGFappearance} from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
	constructor(scene, Ymais, Zmais, Xmais, Ymenos, Zmenos, Xmenos) {
        super(scene);
        this.scene = scene;
        this.quad = new MyQuad(scene);
        this.Ymais = new CGFtexture(this.scene, Ymais); // Top
        this.Zmais = new CGFtexture(this.scene, Zmais); // Front
        this.Xmais = new CGFtexture(this.scene, Xmais); // Right
        this.Zmenos = new CGFtexture(this.scene, Zmenos); // Back
        this.Xmenos = new CGFtexture(this.scene, Xmenos); // Left
        this.Ymenos = new CGFtexture(this.scene, Ymenos); // Bottom
        this.linearFiltering = false;
        this.initBuffers();
       
	}
    initBuffers() {
        this.scene.quad = new MyQuad(this.scene);

        //Material
        this.ucqmaterial = new CGFappearance(this.scene);
        this.ucqmaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.ucqmaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.ucqmaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.ucqmaterial.setShininess(10.0);

    }

    changeFiltering() {
        if (this.linearFiltering)
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.LINEAR);
        else {
            this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        }
    }

    display() {
        // Front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Zmais);
        this.ucqmaterial.apply()
        
        this.quad.display();
        this.scene.popMatrix();

        // Back
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.5);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Zmenos);
        this.ucqmaterial.apply()

        this.quad.display();
        this.scene.popMatrix();

        // Right
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI/2.0, 0, 1, 0);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Xmais);
        this.ucqmaterial.apply()

        this.quad.display();
        this.scene.popMatrix();

        // Left
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI/2.0, 0, 1, 0);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Xmenos);
        this.ucqmaterial.apply()

        this.quad.display();
        this.scene.popMatrix();

        // Top
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI/2.0, 1, 0, 0);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Ymais);
        this.ucqmaterial.apply()

        this.quad.display();
        this.scene.popMatrix();

        // Bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI/2.0, 1, 0, 0);
        this.changeFiltering();
        this.ucqmaterial.setTexture(this.Ymenos);
        this.ucqmaterial.apply()

        this.quad.display();
        this.scene.popMatrix();

    }
}