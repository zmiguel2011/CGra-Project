import {CGFobject} from '../lib/CGF.js';
import { MyBillboard } from './MyBillboard.js';


export class MyTreeGroupPatch extends CGFobject {
  constructor(scene, position) {
      super(scene);
      this.position = position;
      this.trees = this.createTreeGroup();
    }

// draws 9 trees with random textures and random coordinates on the X and Z axis, while forming a grid shape (3x3)
createTreeGroup() {
  var aux = this.randomize_textures();
  var trees = [];

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var offsetX = Math.random() * 4 - 2; // Random offset within -2 to 2 range
      var offsetZ = Math.random() * 4 - 2; // Random offset within -2 to 2 range

      var x = -10 - i * 7 + offsetX; // Adjusted X position
      var z = 5 + j * 7 + offsetZ; // Adjusted Z position

      trees.push(new MyBillboard(this.scene, x, -4, z, this.select_texture(aux[(i * 3 + j) % 3]), 3, 8 + (i * j), 1));
    }
  }

  return trees;
}


  // Creates an array with 3 random numbers between 1 and 3 which helps choosing random textures for the trees
  randomize_textures(){
      var textaux = [0,0,0];
      const min = 1;
      const max = 3;
      
      while(textaux[0] == 0){
          var randomNumInRange = Math.floor(Math.random() * (max - min + 1)) + min;
          textaux[0] = randomNumInRange;
      }
      while(textaux[1] == 0 || textaux[1] == textaux[0]){
          var randomNumInRange = Math.floor(Math.random() * (max - min + 1)) + min;
          textaux[1] = randomNumInRange;
      }
      while(textaux[2] == 0 || textaux[2] == textaux[1] || textaux[2] == textaux[0]){
          var randomNumInRange = Math.floor(Math.random() * (max - min + 1)) + min;
          textaux[2] = randomNumInRange;
      }
      return textaux;
  }
  
  // Displays the 3x3 trees
  display(){
    this.scene.pushMatrix();
    this.scene.translate(this.position[0], this.position[1], this.position[2]);

    for(var i = 0; i < 9; i++){
      this.trees[i].display();
    }

    this.scene.popMatrix();
  }


// Selects the texture based on the number given
  select_texture(texture){
      var path;
      switch(texture){
          case 1:
              path = 'images/billboardtree.png';
              break;
          case 2:
              path = 'images/tree2.png';
              break;
          case 3:
              path = 'images/tree3.png';
              break;
      }
      return path;
  }
}
