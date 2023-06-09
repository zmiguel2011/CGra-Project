import {CGFobject} from '../lib/CGF.js';
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			0, 0, 0,	//0
			2, 0, 0,	//1
			1, 1, 0,	//2
            3, 1, 0	    //3

		];

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2,
            1, 3, 2,
            2, 3, 1,
			1, 0, 2
		];

		// Generating normals
        /*
        As this plane is being drawn on the xy plane, the normal to the plane will be along the positive z axis.
        So all the vertices will have the same normal, (0, 0, 1).
        */
        this.normals = [];
        for (var i = 0; i < 4; i++) {
            this.normals.push(0, 0, -1);
        }

		this.texCoords = [
			1.0, 1.0, //0
			0.5, 1.0, //1
			0.75, 0.75, //2
			0.25, 0.75 //3
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

