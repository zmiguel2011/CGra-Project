import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
/**
 * MyParallelogram
 * @constructor
 * @param scene - Reference to MyTangram object
 */
export class MyTangram extends CGFobject {
	constructor(scene) {
		super(scene);
        this.scene = scene;
        this.initObjects();
	}

    initObjects(){
        //Initialize scene objects
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.trianglesmall1 = new MyTriangleSmall(this.scene);
        this.trianglesmall2 = new MyTriangleSmall(this.scene);
        this.trianglemedium = new MyTriangleSmall(this.scene);
        this.trianglebig1 = new MyTriangleBig(this.scene);
        this.trianglebig2 = new MyTriangleBig(this.scene);
    }
	

    display() {
        // ---- BEGIN Matrix Transformation section

        /* Exercise 1 - Diamond */

        var D1 =[ // Rotation matrix of -1/4 PI rad
        Math.cos(-Math.PI / 4), - Math.sin(-Math.PI / 4), 0, 0,
        Math.sin(-Math.PI / 4), Math.cos(-Math.PI / 4), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
        ];

        var D2 =[ // Translation Matrix
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 3.6, 0, 1
        ];

        this.scene.pushMatrix();
        this.scene.multMatrix(D2);
        this.scene.multMatrix(D1);
        // Draw diamond
        this.diamond.display();
        this.scene.popMatrix();

        /* Exercise 2 */

        // BASE - 2 Big Triangles
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        // Draw first triangle
        this.trianglebig1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(3* Math.PI / 4, 0, 0, 1);
        // Draw second triangle
        this.trianglebig2.display();
        this.scene.popMatrix();
        
        // Parallellogram

        this.scene.pushMatrix();
        this.scene.translate(0.7, 2.85, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        // Draw parallelogram
        this.parallelogram.display();
        this.scene.popMatrix();


        // Medium Triangle

        this.scene.pushMatrix();
        this.scene.translate(0.75, 1.45, 0);
        this.scene.scale(1.4,1.4,1.4);
        // Draw medium triangle
        this.trianglemedium.display();
        this.scene.popMatrix();

        // TOP - 2 Small Triangles

        // Repeat rotations defined earlier for the big triangles
        // and then move them up

        this.scene.pushMatrix();
        this.scene.translate(0,5,0);
        this.scene.rotate(-Math.PI / 4, 0, 0, 1);
        // Draw first triangle
        this.trianglesmall1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,5,0);
        this.scene.rotate(3* Math.PI / 4, 0, 0, 1);
        // Draw second triangle
        this.trianglesmall2.display();
        this.scene.popMatrix();
    
        // ---- END Matrix Transformation section
    }
}

