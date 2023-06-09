import {CGFobject} from '../lib/CGF.js';
/**
 * @method constructor
 * @param  {CGFscene} scene - MyScene object
 * @param  {integer} slices - number of slices (divisions) around Y axis
 * @param  {integer} stacks - number of stacks (divisions) along Y axis, from the center to the poles (half of sphere)
 * @param  {integer} radius - used to control the radius of the Sphere
 */
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, radius, invert = false, material = undefined) {
        super(scene);
        this.stacks = stacks * 2;       // stacks corresponds to the number of divisions from the center
        this.slices = slices;           // to one of the "poles" of the sphere (semi-sphere), so we need to double it
        this.radius = radius;
        this.invert = invert;
        this.material = material;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const stackStep = Math.PI / this.stacks;
        const sliceStep = (2 * Math.PI) / this.slices;

        for (let st = 0; st <= this.stacks; st++) {
            const stackAng = st * stackStep;
            for (let sl = 0; sl <= this.slices; sl++) {
                const sliceAng = sl * sliceStep; 
                //---  vertex coordinates (x, y, z)
                var x = this.radius * Math.sin(stackAng) * Math.cos(+sliceAng);
                var y = this.radius * Math.cos(stackAng);
                var z = this.radius * Math.sin(stackAng) * Math.sin(-sliceAng);
                this.vertices.push(x, y, z);

                //--- vertex normal (nx, ny, nz)
                var nx = x  / this.radius;                 // calculated with the difference between the current vertex
                var ny = y  / this.radius;                 // and the center of the sphere (0,0,0)
                var nz = z  / this.radius;                 // divided by the radius so they can be normalized
                this.normals.push(nx, ny, nz);
                
                //--- texture coordinates: texCoord(s, t) range between [0, 1]
                var s = sl / this.slices;
                var t = st / this.stacks;
                this.texCoords.push(s, t);

                //--- indices
                if (st < this.stacks && sl < this.slices) {
                    var current = st * (this.slices + 1) + sl;         // pushing two triangles using indices from this round (current, current+1)
                    var next = current + this.slices + 1;            // and the ones directly south (next, next+1)

                    if (!this.invert) {
                        this.indices.push(current + 1, current, next);
                        this.indices.push(current + 1, next, next + 1);
                    }
                    else {
                        this.indices.push(next + 1, next, current + 1);
                        this.indices.push(next, current, current + 1);
                    }
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.material != undefined)
            this.material.apply();
        super.display();
    }
}