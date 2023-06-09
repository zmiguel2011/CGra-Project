import {CGFobject} from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene,material) {
        super(scene);
        this.material=material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,	//0
		    1, 0, 0,	//1
			0, 2, 0,	//2
            0, 0, 0,	//3
			1, 0, 0,	//4
			0, 2, 0	    //5
        ]

        this.indices = [
            0, 1, 2,
            5, 4, 3
        ]

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ]

        this.texCoords = [
			1.0, 0.0,
			0.5, 0.5,
			0.5, 1.0,
			0.5, 1.0,
            0.5, 0.5,
            1.0, 0.0
		]

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    display() {
        this.material.apply();
        super.display();
    }
}