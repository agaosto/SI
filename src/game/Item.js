import Phaser from '../lib/phaser.js'

export default class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        
        //this.setScale(0.5)
    }
}