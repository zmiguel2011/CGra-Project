import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-0.5, -0.5, 0.5,	//0
			0.5, -0.5, 0.5,	    //1
			0.5, 0.5, 0.5,	    //2
            -0.5, 0.5, 0.5,		//3
            -0.5, -0.5, -0.5,	//4
			0.5, -0.5, -0.5,	//5
			0.5, 0.5, -0.5,	    //6
            -0.5, 0.5, -0.5		//7
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,  // front face of the cube
			2, 3, 0,  // front face of the cube
            6, 5, 4,  // back face of the cube
			4, 7, 6,   // back face of the cube
            1, 5, 6,  // right face of the cube
			6, 2, 1,   // right face of the cube
            4, 0, 3,  // left face of the cube
			3, 7, 4,   // left face of the cube
            3, 2, 6,  // top face of the cube
			6, 7, 3,   // top face of the cube
            4, 5, 1,  // down face of the cube
			1, 0, 4   // down face of the cube

			
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

