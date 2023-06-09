import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';
/**
* @method constructor
* @param {CGFscene} scene - MyScene object
* @param {integer} slices - number of slices around Y axis
* @param {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
* @param {CGFappearance} material - material to be applied to the ellipsoid
* @param {float} x - deforming factor for x
* @param {float} y - deforming factor for y
* @param {float} z - deforming factor for z
* @param {boolean} egg - is it an egg?
* @param {float} eggFactorNorth - values between 0.0 and 1.0 to determine the deforming factor of the egg (normally it's closer to 1.0)
* @param {float} eggFactorSouth - values between 0.0 and 1.0 to determine the deforming factor of the egg  (normally it's closer to 1.0)
*/
export class MyEllipsoid extends CGFobject {
  constructor(scene, slices, stacks, material, x, y, z, egg = false, eggFactorNorth = undefined, eggFactorSouth = undefined) {
    super(scene);
    this.stacks = stacks * 2;
    this.slices = slices;
    this.x = x; 
    this.y = y;
    this.z = z;
    this.egg = egg;
    this.eggFactorNorth = eggFactorNorth;
    this.eggFactorSouth = eggFactorSouth;
    this.material = material;
    this.initBuffers();
  }
  /**
   * @method initBuffers
   * Initializes the ellipsoid buffers
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const stackStep = Math.PI / this.stacks;
    const sliceStep = (2 * Math.PI) / this.slices;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let st = 0; st <= this.stacks; st++) {
        const stackAng = st * stackStep;
        for (let sl = 0; sl <= this.slices; sl++) {
            const sliceAng = sl * sliceStep; 
            //---  vertex coordinates (x, y, z)
            if (!this.egg) {
              var x = this.x * Math.sin(stackAng) * Math.cos(+sliceAng);
              var y = this.y * Math.cos(stackAng);
              var z = this.z * Math.sin(stackAng) * Math.sin(-sliceAng);
            }
            else {
              if(st < this.stacks / 2) {
                var x = this.x * Math.sin(stackAng) * Math.cos(+sliceAng) * this.eggFactorNorth;
                var y = this.y * Math.cos(stackAng) * this.eggFactorNorth;
                var z = this.z * Math.sin(stackAng) * Math.sin(-sliceAng)  * this.eggFactorNorth;
              }
              else {
                var x = this.x * Math.sin(stackAng) * Math.cos(+sliceAng) * this.eggFactorSouth;
                var y = this.y * Math.cos(stackAng) * this.eggFactorSouth;
                var z = this.z * Math.sin(stackAng) * Math.sin(-sliceAng) * this.eggFactorSouth;
              }
            }
            this.vertices.push(x, y, z);

            //--- vertex normal (nx, ny, nz)
            var nx = x;                 // calculated with the difference between the current vertex
            var ny = y;                 // and the center of the sphere (0,0,0)
            var nz = z;                 // divided by the radius so they can be normalized
            this.normals.push(nx, ny, nz);
            
            //--- texture coordinates: texCoord(s, t) range between [0, 1]
            var s = sl / this.slices;
            var t = st / this.stacks;
            this.texCoords.push(s, t);

            //--- indices
            if (st < this.stacks && sl < this.slices) {
                var current = st * (this.slices + 1) + sl;         // pushing two triangles using indices from this round (current, current+1)
                var next = current + this.slices + 1;            // and the ones directly south (next, next+1)

                this.indices.push(current + 1, current, next);
                this.indices.push(current + 1, next, next + 1);
            }
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.material.apply();
    super.display();
  }
}