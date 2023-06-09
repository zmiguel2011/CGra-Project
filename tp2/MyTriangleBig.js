import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			-2, 0, 0,	//0
			2, 0, 0,	//1
			0, 2, 0,	//2
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

		this.texCoords0 = [ // blue
			1.0, 0.0, //0
			0.0, 0.0, //1
			0.5, 0.5 //2
		];

		this.texCoords1 = [ // orange
			1.0, 1.0, //0
			1.0, 0.0, //1
			0.5, 0.5 //2
		];

		this.texCoords = this.texCoords0;
		this.currTexCoords = 0;

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
	 * @method toggleTexCoords
	 * Updates the list of texture coordinates of the quad (toogles between texCoords0 and texCoords1)
	 */
	toggleTexCoords() {
		if (this.currTexCoords == 0) {
			this.texCoords = this.texCoords1;
			this.currTexCoords = 1;
		}
		else {
			this.texCoords = this.texCoords0;
			this.currTexCoords = 0;
		}

		this.updateTexCoordsGLBuffers();
	}
}

