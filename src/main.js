import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'
import Game2 from './scenes/Game2.js'
import Game3 from './scenes/Game3.js'
import Game4 from './scenes/Game4.js'
import Game5 from './scenes/Game5.js'
import Game6 from './scenes/Game6.js'
import Game7 from './scenes/Game7.js'
import GameOver from './scenes/GameOver.js'
import GameFinished from './scenes/GameFinished.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scene: [Game, Game2, Game3, Game4, Game5, Game6, Game7, GameOver, GameFinished],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            //debug: true
        }
    }
})