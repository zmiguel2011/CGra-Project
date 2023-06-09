import { CGFobject, CGFappearance, CGFtexture, CGFshader } from '../lib/CGF.js';
import { MyEllipsoid } from './MyEllipsoid.js';
import { MyPyramid } from './MyPyramid.js';
import { MyTriangle } from './MyTriangle.js';
import { MyBirdEgg } from './MyBirdEgg.js';


/**
 * @method constructor
 * @param  {CGFscene} scene - MyScene object 
 * @param  {path} bodyTexture - path to the texture image intended for the body
 * @param  {path} wingTexture -path to the texture image intended for the wings
 * @param  {path} tailTexture - path to the texture image intended for the tail
 * @param  {vector} neckColor - vector with the 3 rbg values the control the color of the neck
 */
export class MyBird extends CGFobject {
    constructor(scene, bodyTexture, wingTexture, tailTexture, neckColor) {
        super(scene);
        this.birdBodyTex = new CGFtexture(this.scene, bodyTexture);
        this.birdWingTex = new CGFtexture(this.scene, wingTexture);
        this.birdTailTex = new CGFtexture(this.scene, tailTexture);
        this.neckColor = neckColor;
        

        this.createMaterials();
        this.createPieces();
        this.createShaders();
        this.initBuffers();

        //----Interface Variables
        this.scaleFactor = 1;
        this.speedFactor = 1;

        //----Animation Variables
        this.prevtime = -1;
        this.flyingdown = true;  // flying down is used both for the animations and for the egg grabbing movements
        this.wingAngle = 0.0;
        
        //----Movement variables
        this.oscilatingDistance = 0.0;
        this.orientationAngle = 0.0;
        this.speed = 0.0;
        this.position = [0.0, 3.0, 0.0]; // Bird coordinates
        
        //----Bird States
        this.states = {
            FLYING : 0, // - FLYING is the default state
            GRABBING : 1, // - GRABBING is the state where the bird tries to grab the egg, while flying down 
            GRABBED : 2, // - GRABBED is the state where the bird succeeds in grabbing the egg and is flying back up
            TRANSPORTING: 3, // - TRANSPORTING is the state where the bird is transporting (holding) the egg
            DROPPING: 4 // - DROPPING is the state where the bird is dropping the egg
        };
        
        this.currentState = this.states.FLYING;
        
        //----Constant Values
        this.MAX_HEIGHT = 3.0;   // max height for the bird
        this.MIN_HEIGHT = 2.5;   // min height for the bird when oscilating
        this.GROUND = -7.0;   // height chosen for the ground
        this.NEST = -6.5;   // height close enough to the nest
        this.GRAVITIC_ACCELERATION = -9.8;
        this.HALF_GRAVITIC_ACCELERATION = -4.9;
        
        //----Egg related variables
        this.eggPosition = [];   // Egg coordinates
        this.grabbedEggIndex;   // Index of the grabbed egg the in the eggset

        this.dy = 0;    // distance in x
        this.dx = 0;    // distance in y
        this.dy = 0;    // distance in z
        this.speedx = 0.0; // speed in x
        this.speedz = 0.0; // speed in z
        // t = sqrt( (-2 * h) / g ); h being the abosulte value of the distance traveled by the egg when it's falling -->  h = MAX_HEIGHT + NEST = 3.0 + 6.5 = 9.5
        this.eggdropTime = Math.sqrt(-2 * 9.5 / this.GRAVITIC_ACCELERATION);
    }               
    createMaterials() {
        
        // ----- Textures

        // Body
        this.bodyMaterial = new CGFappearance(this.scene);
        this.bodyMaterial.setAmbient(this.neckColor[0], this.neckColor[1], this.neckColor[2], 1.0);
        this.bodyMaterial.setSpecular(this.neckColor[0], this.neckColor[1], this.neckColor[2], 1.0);
        this.bodyMaterial.setDiffuse(this.neckColor[0], this.neckColor[1], this.neckColor[2], 1.0);
        this.bodyMaterial.setShininess(10.0);
        this.bodyMaterial.setTexture(this.birdBodyTex);

        // Wings
        this.wingMaterial = new CGFappearance(this.scene);
        this.wingMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.wingMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.wingMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.wingMaterial.setShininess(10.0);
        this.wingMaterial.setTexture(this.birdWingTex);
        
        //Head
        this.greyMaterial = new CGFappearance(this.scene);
        this.greyMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.greyMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.greyMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.greyMaterial.setShininess(10.0);

        // Eyes
        this.blackMaterial = new CGFappearance(this.scene);
        this.blackMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.blackMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.blackMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.blackMaterial.setShininess(10.0);

        // Beak
        this.yellowMaterial = new CGFappearance(this.scene);
        this.yellowMaterial.setAmbient(1.0, 1.0, 0.0, 1.0);
        this.yellowMaterial.setDiffuse(1.0, 1.0, 0.0, 1.0);
        this.yellowMaterial.setSpecular(1.0, 1.0, 0.0, 1.0);
        this.yellowMaterial.setShininess(10.0);

        // Tail
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.tailMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.tailMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.tailMaterial.setShininess(10.0);
        this.tailMaterial.setTexture(this.birdTailTex);

    }
    createShaders() {
        this.birdBodyShader = new CGFshader(this.scene.gl, "./Shaders/BirdBodyPart.vert", "./Shaders/BirdBodyPart.frag");
        this.birdBodyShader.setUniformsValues({ scalesSampler : 0});
        this.birdBodyShader.setUniformsValues({ ratio : 0.3 }); // Head/body ratio --> Used to paint the neck so it ressembles an eagle
        this.birdBodyShader.setUniformsValues({ r : this.neckColor[0] });
        this.birdBodyShader.setUniformsValues({ g : this.neckColor[1] });
        this.birdBodyShader.setUniformsValues({ b : this.neckColor[2] });
    }
    createPieces() {
        this.body = new MyEllipsoid(this.scene, 16, 10, this.bodyMaterial,0.5,1.0,0.6);
        this.head = new MyEllipsoid(this.scene,16,10,this.greyMaterial,1,1,1);
        this.beak = new MyPyramid(this.scene, 3, 5, 3,this.yellowMaterial);
        this.wing = new MyEllipsoid(this.scene, 16, 10, this.wingMaterial,0.5,1.0,2.0);
        this.eye = new MyEllipsoid(this.scene,16,10,this.blackMaterial,1,1,1);
        this.tail = new MyTriangle(this.scene, this.tailMaterial);
        this.egg = new MyBirdEgg(this.scene, 0.25, 'textures/bird-egg.jpg', 1.0, 0.95);
    }
    initBuffers() {
        this.body.initBuffers();
        this.head.initBuffers();
        this.beak.initBuffers();
        this.wing.initBuffers();
        this.eye.initBuffers();
        this.tail.initBuffers();
        this.egg.initBuffers();
    }
    display() {
        
        //---- START of Bird
        this.scene.pushMatrix();
        //Rotates and travels depending on its orientation and position
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.orientationAngle, 0, 1, 0);
        
        this.scene.scale(0.5/0.9, 0.5/0.9, 0.5/0.9);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        
        //Interface Scale Factor
        this.scene.scale(this.scene.scaleFactor, this.scene.scaleFactor, this.scene.scaleFactor);
        
        //----Body
        this.scene.setActiveShader(this.birdBodyShader);
        this.body.display();
        this.scene.setActiveShader(this.scene.defaultShader);

        //----Head 
        this.scene.pushMatrix();
        this.scene.scale(0.4, 0.4, 0.4);
        this.scene.translate(0.0,3.0,-1.0);
        this.head.display();
        this.scene.popMatrix();

        //----Beak 
        this.scene.pushMatrix();
        this.scene.scale(0.15, 0.15, 0.15);
        this.scene.translate(0.0,9.5,-2.5);
        this.beak.display();
        this.scene.popMatrix();

        //----Eyes
        this.scene.pushMatrix();
        this.scene.scale(0.12,0.12,0.12);
        this.scene.translate(-2.55,11.5,-3.35);
        this.eye.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.12,0.12,0.12);
        this.scene.translate(2.55,11.5,-3.35);
        this.eye.display();
        this.scene.popMatrix();


        //----Tail
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/9,1,0,0);
        this.scene.translate(0.0,-1.7,-0.5);
        this.scene.scale(0.7,0.7,0.7);
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/9,1,0,0);
        this.scene.translate(0.0,-1.7,-0.5);
        this.scene.scale(0.7,0.7,0.7);
        this.scene.rotate(-Math.PI,0,0,1);
        this.scene.rotate(-Math.PI,1,0,0);
        this.tail.display();
        this.scene.popMatrix();

        //----Wings
        //---Left Wing
        this.scene.pushMatrix();
        this.scene.scale(0.3,0.3,0.3);
        // Left Wing Animation
        this.scene.rotate(Math.sin(-this.wingAngle) / 3.0, 0, 1, 0); // tweak the divisor to adjust the wing animation
        this.scene.translate(3.0,0.3,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.wing.display();
        this.scene.popMatrix();

        //---Right Wing
        this.scene.pushMatrix();
        this.scene.scale(0.3,0.3,0.3);
        // Right Wing Animation
        this.scene.rotate(Math.sin(this.wingAngle) / 3.0, 0, 1, 0); // tweak the divisor to adjust the wing animation
        this.scene.translate(-3.0,0.3,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.wing.display();
        this.scene.popMatrix();

        this.scene.popMatrix(); //---- END of of Bird
        
        // draws the egg it the state is grabbed/transporting/dropping
        if(this.currentState === this.states.GRABBED || this.currentState === this.states.TRANSPORTING || this.currentState === this.states.DROPPING){
            this.scene.pushMatrix();
    
            this.scene.translate(this.eggPosition[0], this.eggPosition[1], this.eggPosition[2]);

            //Interface Scale Factor
            this.scene.scale(this.scene.scaleFactor, this.scene.scaleFactor, this.scene.scaleFactor);
            
            this.egg.display();
            
            this.scene.popMatrix();
        } 



    }
    
    enableNormalViz() {
        this.body.enableNormalViz();
        this.head.enableNormalViz();
        this.beak.enableNormalViz();
        this.wing.enableNormalViz();
        this.eye.enableNormalViz();
        this.tail.enableNormalViz();
        this.egg.enableNormalViz();
    }
    disableNormalViz() {
        this.body.disableNormalViz();
        this.head.disableNormalViz();
        this.beak.disableNormalViz();
        this.wing.disableNormalViz();
        this.eye.disableNormalViz();
        this.tail.disableNormalViz();
        this.egg.disableNormalViz();
    }

    update(t) {
        //Updates bird position with terms to speed and orientation
        this.position[0] += this.speed * this.scene.speedFactor * Math.sin(this.orientationAngle);
        this.position[2] += this.speed * this.scene.speedFactor * Math.cos(this.orientationAngle);

        this.updateAnimations(t);
        this.updateBird();
        this.updateEgg();
    }
    updateAnimations(t) {
        // Update previous time and calculte dt
        if(this.prevtime === -1) this.prevtime = t;
        let dt = t - this.prevtime;
        let dtSeconds = dt / 1000;
        this.prevtime = t;


        // Calculates distance for the oscilating animation
        // velocity: 0.5 / 1 = 0.5 which is the distance traveled divided by the time it should take --> 1 second
        // speedFactor: the max operations assure that the speed value used is between 1 and 2
        this.oscilatingDistance = 0.5 * dtSeconds * Math.max(Math.max(this.speed/0.1, 1), 2)  * this.scene.speedFactor;

        // Calculates the distance  for the bird to ascend/descend (for each second) when trying to grab the egg
        this.grabbingDistance = (this.position[1] - this.GROUND) / 1 * dtSeconds * Math.max(Math.max(this.speed/0.1, 1), 2)  * this.scene.speedFactor;

        // Calculates wing angle for the wings animation
        this.wingAngle += this.speed/3 * dt * this.scene.speedFactor; // tweak the divisor to make the animation more smooth

        // Update speed of falling egg
        this.dy += this.HALF_GRAVITIC_ACCELERATION * dtSeconds * dtSeconds; // height = ut + -1/2gt^2, being u the inital velocity in y, which is 0
        this.dx = this.speedx * dtSeconds;
        this.dz = this.speedz * dtSeconds;
    }  
    turn(value) {
        //Changes orientation
        this.orientationAngle += value;
        this.orientationAngle %= 2*Math.PI;
    }
    accelerate(value) {
        //Increases speed
        this.speed += value;
    }
    decelerate(value) {
        //Decreases speed
        if(this.speed - value >= 0)
            this.speed -= value;
        else this.speed = 0;
    }
    up(value) {
        //Increases altitude
        this.position[1] += value;
    }
    down(value) {
        //Decreases altitude
        this.position[1] -= value;
    }

    eggdown(value){
        // decreases altitude of the egg
        this.eggPosition[1] -= value;
    }

    reset() {
        //Resets initial position
        this.speed = 0.0;
        this.orientationAngle = 0.0;
        this.position = [0.0, 3.0, 0.0];
    }
    setVelocity(speed){
        this.speed = speed;
    }
    setAngle(angle){
        this.orientationAngle = angle;
    }

    updateBird() {
        // Flying Animation - active when state is FLYING, TRANSPORTING or DROPPING
        if (this.currentState === this.states.FLYING || this.currentState === this.states.TRANSPORTING || this.currentState === this.states.DROPPING) {
            if(this.flyingdown) {
                this.down(this.oscilatingDistance);
                if (this.position[1] <= this.MIN_HEIGHT) 
                    this.flyingdown = false; // reaches min height, ascends
            }
            else {
                this.up(this.oscilatingDistance);
                if (this.position[1] >= this.MAX_HEIGHT)
                    this.flyingdown = true; // reaches max height, descends
            }
        }
        // Grabbing Animation - active when state is GRABBING (descends until it reaches the "ground")
        else if (this.currentState === this.states.GRABBING) {
            if(this.flyingdown) {
                this.down(this.grabbingDistance);
                if (this.position[1] <= this.NEST) { // tries grabbing the egg
                    const {boolean, index} = this.scene.eggset.distanceFromBird(this.position);
                    if(boolean) { // grabbed the egg
                        this.currentState = this.states.GRABBED;
                        this.grabbedEggIndex = index; // saves egg index in eggset for later (draw in nest)
                    }

                    this.flyingdown = false;
                }
            }
            else {
                this.up(this.grabbingDistance);
                if (this.position[1] >= this.MAX_HEIGHT) {
                    this.flyingdown = true; // reaches max height, descends
                    this.currentState = this.states.FLYING; // didn't grab the egg

                }
            }
        }
        // Grabbed Animation - active when state is GRABBED (ascends to normal height and restarts default flying animation)
        else if (this.currentState === this.states.GRABBED) {
            this.up(this.grabbingDistance);
            if (this.position[1] >= this.MAX_HEIGHT) {
                this.flyingdown = true; // reaches max height, descends
                this.currentState = this.states.TRANSPORTING; // grabbed the egg and is now transporting it
            }
        }
    }
   
    // functionality using P key to make the bird go down to floor level and go back up to original height in a 2 second period 
    handleEggGrab() {
        // Can only grab again if the bird is not transporting/dropping an egg
        if(this.currentState !== this.states.GRABBED && this.currentState !== this.states.TRANSPORTING && this.currentState !== this.states.DROPPING)
            this.currentState = this.states.GRABBING;
    }

    // functionality using O key to make the bird drop the egg inside the nest
    handleEggDrop() {
        // Can only drop if the bird is transporting an egg
        if(this.currentState === this.states.TRANSPORTING){
            //now if we are in a distance near the nest, we are able to drop the egg
            if(this.scene.nest.distanceFromNest(this.eggPosition, this.grabbedEggIndex, this.scene.eggset.getEggNestPositions())) {
                this.currentState = this.states.DROPPING; // dropping the egg in the nest
                var distCoords = this.scene.nest.distanceFromNestCoords(this.eggPosition, this.grabbedEggIndex, this.scene.eggset.getEggNestPositions());
                this.dy = 0;
                this.dx = 0;    // reset distance values for x, y and z
                this.dy = 0;
                this.speedx = distCoords[0]/ (this.eggdropTime * this.speedFactor) // initialize speed in x according to the distance from the nest
                this.speedz = distCoords[2]/ (this.eggdropTime * this.speedFactor); // initialize speed in z according to the distance from the nest
            }
        }
    }

    updateEgg() {
        // Updates egg position according to the bird
        if(this.currentState !== this.states.DROPPING){
            this.eggPosition = [this.position[0], this.position[1] - 0.6, this.position[2]];
        }
        else { // Updates egg position according to its velocity
            this.eggPosition = [this.eggPosition[0] + this.dx, this.eggPosition[1] + this.dy, this.eggPosition[2] + this.dz];

            if(this.eggPosition[1] <= this.NEST){ // egg is close enough to the ground --> place in nest
                this.scene.eggset.setEggInNest(this.grabbedEggIndex);
                this.currentState = this.states.FLYING;
            }
        }
    }

    distanceFromBird(eggPosition) {
        var distance = Math.sqrt(Math.pow((eggPosition[0] - this.position[0]), 2) + Math.pow((eggPosition[1] - this.position[1]), 2) + Math.pow((eggPosition[2] - this.position[2]), 2));
        if (distance < 2.5) { // give some error margin
            return true;
        }
        return false;
    }

    

}