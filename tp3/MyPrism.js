import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
	constructor(scene, slices, stacks)
    {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.size = 1; // var used to control the height of the prism
        this.initBuffers();
    }
	initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var stackSize = this.size / this.stacks;
        var vertexPerSlice = 2 * this.stacks + 2;


        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var saa=Math.sin(ang+alphaAng);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+alphaAng);
            
            var normal= [ // normal calculated with the midpoint formula in space
                (ca + caa) / 2.0,
                (-sa - saa) / 2.0,
                0
            ];

            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]
            );
            normal[0]/=nsize;
            normal[1]/=nsize;
            normal[2]/=nsize;


            for(var j = 0; j < this.stacks; j++){
                if (j == 0) {
                    this.vertices.push(ca, -sa, stackSize * 0); // "bottom right" vertex
                    this.vertices.push(caa, -saa, stackSize * 0); // "bottom left" vertex
                    this.vertices.push(ca, -sa, stackSize * 1);  // "top right" vertex
                    this.vertices.push(caa, -saa, stackSize * 1); // "bottom left" vertex
                    // push normal once for each vertex
                    this.normals.push(...normal);
                    this.normals.push(...normal);
                    this.normals.push(...normal);
                    this.normals.push(...normal);
                    this.indices.push((vertexPerSlice*i+2), (vertexPerSlice*i+1), vertexPerSlice*i);
                    this.indices.push((vertexPerSlice*i+1), (vertexPerSlice*i+2), (vertexPerSlice*i+3));
                }
                else {
                    this.vertices.push(ca, -sa, stackSize * (j+1));
                    this.vertices.push(caa, -saa, stackSize * (j+1));
    
                    // push normal once for each vertex
                    this.normals.push(...normal);
                    this.normals.push(...normal);
                    
                    this.indices.push((vertexPerSlice*i+2+j*2), (vertexPerSlice*i+1+j*2), (vertexPerSlice*i+j*2));
                    this.indices.push((vertexPerSlice*i+1+j*2), (vertexPerSlice*i+2+j*2), (vertexPerSlice*i+3+j*2));
                }
                
            }

            ang+=alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
