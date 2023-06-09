import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../lib/CGF.js';
import { MyPlane } from "./MyPlane.js";

/**
* MyPyramid
* @constructor
*/
export class MyTerrain extends CGFobject {
    constructor(scene) {
        super(scene);

        this.plane = new MyPlane(this.scene, 30);
        this.plane.initBuffers();    
		this.init();
	}

init(){	
		//shaders connected
		this.appearance = new CGFappearance(this.scene);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);
		
		this.terrainTex = new CGFtexture(this.scene, "images/terrain.jpg");
		this.terrainMap = new CGFtexture(this.scene, "images/heightmap.jpg");
		this.altimetry = new CGFtexture(this.scene, "images/altimetry.png");
		this.appearance.setTexture(this.terrainTex);

		
		this.testShaders = [
					new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag"),
				];
		
		this.testShaders[0].setUniformsValues({ uSampler2: 1 });
		this.testShaders[0].setUniformsValues({ uSampler3: 2 });
    }
	
	
	
	display() {

		// aplly main appearance
		this.appearance.apply();
		
		// activate selected shader
        this.scene.setActiveShader(this.testShaders[0]);

		this.terrainMap.bind(1);
		this.altimetry.bind(2);	 

		this.scene.pushMatrix();
		this.scene.rotate(-0.5*Math.PI, 1, 0, 0);
		this.scene.translate(0, 0, -15);
		this.scene.scale(400, 400, 4);
		this.plane.display();
		this.scene.popMatrix();
		this.scene.setActiveShader(this.scene.defaultShader);
    }

}
