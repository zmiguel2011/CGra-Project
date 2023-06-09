import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyDiamond } from "../tp2/MyDiamond.js";
import { MyTriangle } from "../tp2/MyTriangle.js";
import { MyParallelogram } from "../tp2/MyParallelogram.js";
import { MyTriangleSmall } from "../tp2/MyTriangleSmall.js";
import { MyTriangleBig } from "../tp2/MyTriangleBig.js";
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
        this.createMaterials();
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
	
    createMaterials() {
        this.materials = [];
        
        //MATERIALS - (Colors for different objects)

        //RED
        this.scene.materialRed = new CGFappearance(this.scene);
        this.scene.materialRed.setAmbient(0.3, 0.0, 0.0, 1.0);
        this.scene.materialRed.setDiffuse(0.7, 0.0, 0.0, 1.0);
        this.scene.materialRed.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.scene.materialRed.setShininess(10.0);

        //GREEN
        this.scene.materialGreen = new CGFappearance(this.scene);
        this.scene.materialGreen.setAmbient(0.0, 0.3, 0.0, 1.0);
        this.scene.materialGreen.setDiffuse(0.0, 0.7, 0.0, 1.0);
        this.scene.materialGreen.setSpecular(0.0, 1.0, 0.0, 1.0);
        this.scene.materialGreen.setShininess(10.0);

        //ORANGE
        this.scene.materialOrange = new CGFappearance(this.scene);
        this.scene.materialOrange.setAmbient(0.3, 0.25, 0.0, 1.0);
        this.scene.materialOrange.setDiffuse(0.7, 0.25, 0.0, 1.0);
        this.scene.materialOrange.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.scene.materialOrange.setShininess(10.0);

        //YELLOW
        this.scene.materialYellow = new CGFappearance(this.scene);
        this.scene.materialYellow.setAmbient(0.3, 0.3, 0.0, 1.0);
        this.scene.materialYellow.setDiffuse(0.7, 0.7, 0.0, 1.0);
        this.scene.materialYellow.setSpecular(1.0, 1.0, 0.0, 1.0);
        this.scene.materialYellow.setShininess(10.0);

        //PINK
        this.scene.materialPink = new CGFappearance(this.scene);
        this.scene.materialPink.setAmbient(0.3, 0.0, 0.3, 1.0);
        this.scene.materialPink.setDiffuse(0.7, 0.0, 0.7, 1.0);
        this.scene.materialPink.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.scene.materialPink.setShininess(10.0);

        //PURPLE
        this.scene.materialPurple = new CGFappearance(this.scene);
        this.scene.materialPurple.setAmbient(0.15, 0.0, 0.3, 1.0);
        this.scene.materialPurple.setDiffuse(0.35, 0.0, 0.7, 1.0);
        this.scene.materialPurple.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.scene.materialPurple.setShininess(10.0);

        //BLUE
        this.scene.materialBlue = new CGFappearance(this.scene);
        this.scene.materialBlue.setAmbient(0.0, 0.0, 0.3, 1.0);
        this.scene.materialBlue.setDiffuse(0.0, 0.0, 0.7, 1.0);
        this.scene.materialBlue.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.scene.materialBlue.setShininess(10.0);

        this.materials = [this.scene.materialGreen, this.scene.materialPink, this.scene.materialYellow, this.scene.materialPurple,
            this.scene.materialRed, this.scene.materialBlue, this.scene.materialOrange];
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
            this.materials[0].apply();  // green 
            this.diamond.display();
            this.scene.popMatrix();
    
            /* Exercise 2 */
    
            // BASE - 2 Big Triangles
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI / 4, 0, 0, 1);
            // Draw first triangle
            this.materials[5].apply();  // blue
            this.trianglebig1.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.rotate(3* Math.PI / 4, 0, 0, 1);
            // Draw second triangle
            this.materials[6].apply(); // orange 
            this.trianglebig2.display();
            this.scene.popMatrix();
            
            // Parallellogram
    
            this.scene.pushMatrix();
            this.scene.translate(0.7, 2.85, 0);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.rotate(-Math.PI / 4, 0, 0, 1);
            // Draw parallelogram
            this.materials[2].apply(); // yellow 
            this.parallelogram.display();
            this.scene.popMatrix();
    
    
            // Medium Triangle
    
            this.scene.pushMatrix();
            this.scene.translate(0.75, 1.45, 0);
            this.scene.scale(1.4,1.4,1.4);
            // Draw medium triangle
            this.materials[1].apply(); // pink 
            this.trianglemedium.display();
            this.scene.popMatrix();
    
            // TOP - 2 Small Triangles
    
            // Repeat rotations defined earlier for the big triangles
            // and then move them up
    
            this.scene.pushMatrix();
            this.scene.translate(0,5,0);
            this.scene.rotate(-Math.PI / 4, 0, 0, 1);
            // Draw first triangle
            this.materials[3].apply(); // purple
            this.trianglesmall1.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
            this.scene.translate(0,5,0);
            this.scene.rotate(3* Math.PI / 4, 0, 0, 1);
            // Draw second triangle
            this.materials[4].apply(); // red 
            this.trianglesmall2.display();
            this.scene.popMatrix();
        
            // ---- END Matrix Transformation section
        }

        /**
         * Called when user interacts with GUI to change object's complexity.
         * @param {integer} complexity - changes number of nDivs
         */
        updateBuffers(complexity){
             // ---- To Complete
        }

        /**
         * Called when user interacts with GUI to display normals.
         */
        enableNormalViz(){ 
            // overide default function in order to enable normals visibility in all elements
            this.diamond.enableNormalViz();
            this.triangle.enableNormalViz();
            this.parallelogram.enableNormalViz();
            this.trianglesmall1.enableNormalViz();
            this.trianglesmall2.enableNormalViz();
            this.trianglemedium.enableNormalViz();
            this.trianglebig1.enableNormalViz();
            this.trianglebig2.enableNormalViz();
        }

        disableNormalViz() { // NOT WORKING
            // overide default function in order to disable normals visibility in all elements
            this.diamond.disableNormalViz;
            this.triangle.disableNormalViz;
            this.parallelogram.disableNormalViz;
            this.trianglesmall1.disableNormalViz;
            this.trianglesmall2.disableNormalViz;
            this.trianglemedium.disableNormalViz;
            this.trianglebig1.disableNormalViz;
            this.trianglebig2.disableNormalViz;
        }

}

