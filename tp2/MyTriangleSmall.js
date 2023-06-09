import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleSmall extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-1, 0, 0,	//0
			1, 0, 0,	//1
			0, 1, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		// Generating normals
        /*
        As this plane is being drawn on the xy plane, the normal to the plane will be along the positive z axis.
        So all the vertices will have the same normal, (0, 0, 1).
        */
        this.normals = [];
        for (var i = 0; i < 3; i++) {
            this.normals.push(0, 0, 1);
        }

		this.texCoords = [
			0.5, 1.0, //0
			0.0, 0.5, //1
			0.0, 1.0 //2
		];

		this.texCoords1 = [ // purple
			0.0, 0.0 , //0
			0.0, 0.5, //1
			0.25, 0.25 //2
		];

		this.texCoords2 = [ // red
			0.25, 0.75, //0
			0.75, 0.75, //1
			0.5, 0.5 //2
		];

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the quad
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	/**
	 * @method setTexCoords
	 * Updates the list of texture coordinates of the quad (sets new texCoords; choose between between texCoords1 and texCoords2)
	 * @param {int} option - option for the texCoords array: 1 or 2
	*/
	setTexCoords(option) {
		if (option == 1) 
			this.texCoords = this.texCoords1;
		else if (option == 2)
			this.texCoords = this.texCoords2;
		else
			return;

		this.updateTexCoordsGLBuffers();
	}
}

