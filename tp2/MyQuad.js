import {CGFobject} from '../lib/CGF.js';
/**
 * MyQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyQuad extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			-0.5, -0.5, 0,	    //Bottom front left - 0
			0.5, -0.5, 0,	    //Bottom front right - 1
			-0.5, 0.5, 0,	    //Top front left - 2
            0.5, 0.5, 0,	    //Top front right - 3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2,
            3, 2, 1,
            
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}
