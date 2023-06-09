import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MyPanorama } from "./MyPanorama.js";
import { MySphere } from "./MySphere.js";
import { MyBird } from "./MyBird.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyNest } from "./MyNest.js";
import { MyEggSet } from "./MyEggSet.js";
import { MyTreeGroupPatch } from "./MyTreeGroupPatch.js";
import { MyTreeRowPatch } from "./MyTreeRowPatch.js";



/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    // set the scene update period 
		// (to invoke the update() method every 50ms or as close as possible to that )
		this.setUpdatePeriod(20);
    
    const default_panorama = new CGFtexture(this, "images/panorama4.jpg");

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.plane = new MyPlane(this,32);
    this.panorama = new MyPanorama(this,default_panorama,200); 
    this.sphere = new MySphere(this,50,25,1);
    this.bird = new MyBird(this, 'textures/bird-feathers-pattern-new.jpg', 'textures/bird-feathers-pattern-new.jpg', 'textures/bird-feathers-pattern-white.jpg', [0.7, 0.7, 0.7]);
    this.nest = new MyNest(this, 24, 6, 0.2, 'textures/stick.jpg', [0.0,-7.0,0.0]); // -7.0 is the chosen value for the "ground"
    this.eggset = new MyEggSet(this, 10, 0.25, 'textures/bird-egg.jpg', 1.0, 0.95, [0.0,-7.0,0.0]);
    this.treeGroup = new MyTreeGroupPatch(this, [-30.0,0.0,-20.0]);
    this.treeGroup2 = new MyTreeGroupPatch(this, [-25.0,0.0,15.0]);
    this.treeRow = new MyTreeRowPatch(this, [-20.0,0.0,-20.0]);
    this.treeRow2 = new MyTreeRowPatch(this, [20.0,0.0,25.0]);
    this.treeRow3 = new MyTreeRowPatch(this, [-45.0,0.0,-25.0]);


    
    // substitute plane for terrain
    this.terrain = new MyTerrain(this); 

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.displayBird = true;
    this.displaySphere = false;
    this.displayTerrain = true;
    this.displayPanorama = true;
    this.scaleFactor = 1.0;
    this.speedFactor = 1.0;

    this.enableTextures(true);

    //------ Earth Texture 
    this.earthTexture = new CGFtexture(this, "images/earth.jpg");
    this.earthAppearance = new CGFappearance(this);
    this.earthAppearance.setTexture(this.earthTexture);
    this.earthAppearance.setTextureWrap('REPEAT', 'REPEAT');

  

  }
  initLights() {
    this.lights[0].setPosition(15, 0, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      1.7,    // fov - change this value to achieve the best perspective
      0.1,
      1000,
      vec3.fromValues(10, 5, 5),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }



  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    // ---- BEGIN Primitive drawing section
    if(this.displayTerrain){
      this.terrain.display();
    }
    if(this.displayPanorama){
    this.panorama.display();
    }
   

    // Sphere
    if (this.displaySphere) {
      this.pushMatrix();
      this.earthAppearance.apply();
      this.sphere.display();
      this.popMatrix();
    }
    
    // Bird
    if (this.displayBird)
    this.bird.display();
    
    
    // Nest
    this.nest.display();
    
    // Eggs
    this.eggset.display();
    
    
    // trees
    this.treeGroup.display(); // --> 3x3 trees
    this.treeGroup2.display(); // --> 3x3 trees
    this.treeRow.display(); // --> 6 trees
    this.treeRow2.display(); // --> 6 trees
    this.treeRow3.display(); // --> 6 trees

    

    // ---- END Primitive drawing section
  }

  // called periodically (as per setUpdatePeriod() in init())
  update(t){
    this.checkKeys();
    this.bird.update(t);
}

  checkKeys()  {

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")){ // Speed up
        this.bird.accelerate(0.01);
    }
    if (this.gui.isKeyPressed("KeyS")){ // Speed down -- stops when speed == 0
        this.bird.decelerate(0.01);
    }
    if (this.gui.isKeyPressed("KeyA")){ // Left seen from the back
        this.bird.turn(Math.PI/16);
    }
    if (this.gui.isKeyPressed("KeyD")){ // Right seen from the back
        this.bird.turn(-Math.PI/16);
    }
    if (this.gui.isKeyPressed("KeyR")){ // Reset speed, orientation and position
        this.bird.reset();
    }
    if (this.gui.isKeyPressed("KeyP")){ // Grab egg
        this.bird.handleEggGrab();
    }
    if (this.gui.isKeyPressed("KeyO")){ // Drop egg
      this.bird.handleEggDrop();
    }

}

}
