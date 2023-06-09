import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyBillboard
 * @constructor
 * @param scene - Reference to MyScene object
 */


export class MyBillboard extends CGFobject {

    constructor(scene, x, y, z, texture, scaleX, scaleY, scaleZ) {
        super(scene);
        this.position = {x: x, y: y, z: z};
        this.texture = new CGFtexture(this.scene, texture);
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
        this.billboard = new MyQuad(this.scene);
        this.createMaterials();
        this.initBuffers();
    }
    
    initBuffers() {
        this.billboard.initBuffers();
    }

    createMaterials() {
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(10.0);
        this.material.setTexture(this.texture);         
    }


    display() {

        // Camera position
        let cameraPos = vec3.fromValues(this.scene.camera.position[0], this.scene.camera.position[1], this.scene.camera.position[2]);
        // Object position
        let pos = vec3.fromValues(this.position.x, this.position.y, this.position.z);
      
        // Calculate the vector from object to camera
        let v = vec3.create();
        vec3.subtract(v, cameraPos, pos);
        vec3.normalize(v, v);
      
        // Calculate the normal vector of the billboard
        let n = vec3.fromValues(this.billboard.normals[0], this.billboard.normals[1], this.billboard.normals[2]);
        vec3.normalize(n, n);
      
        // Project v and n onto the horizontal plane (set the Y component to 0)
        v[1] = 0;
        n[1] = 0;
        vec3.normalize(v, v);
        vec3.normalize(n, n);
      
        // Calculate the perpendicular vector
        let u = vec3.create();
        vec3.cross(u, n, v); // changed orientation to positive angle
        vec3.normalize(u, u);
      
        // Calculate the angle between v and n
        let cosAngle = vec3.dot(n, v);
        let angle = Math.acos(cosAngle);

        this.scene.pushMatrix();
        
        // Translate to the given position
        this.scene.translate(this.position.x, this.position.y, this.position.z);

        // Rotate the billboard so that it faces the camera
        this.scene.rotate(angle, u[0], u[1], u[2]);

        // Scale the billboard 
        this.scene.scale(this.scaleX,this.scaleY,this.scaleZ);

        // Display the billboard
        this.material.apply();
        this.billboard.display();

        this.scene.popMatrix();
    }
    

    /**
     * Enables visualization of billboard's normals
     */
    enableNormalViz() {
        this.billboard.enableNormalViz()
    }
    /**
     * Disables visualization of billboard's normals
     */
    disableNormalViz() {
        this.billboard.disableNormalViz()
    }

}