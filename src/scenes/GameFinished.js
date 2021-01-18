import Phaser from '../lib/phaser.js'

export default class GameFinished extends Phaser.Scene {
    constructor() {
        super('game-finished')
    }

    preload() {
        this.load.audio("winner", "assets/soundfx/nextLevel.wav")
    }

    create() {
        this.add.image(240, 320, 'background')

        this.sound.play('winner', {volume: 0.4})

        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width * 0.5, height * 0.1, 'Brawo!', {
            fontFamily: 'Bangers',
            fontSize: '64px',
            color: '#000'
        })
        .setOrigin(0.5)
        .setPadding(10, 16)
        .setShadow(3, 5, '#fff')

        this.add.text(width * 0.5, height * 0.5, 'Znasz już podstawowe\njednostki układu SI:\nKILOGRAM\nAMPER\nSEKUNDA\nMETR\nKELWIN\nKANDELA\nMOL', {
            fontFamily: 'Bangers',
            fontSize: '40px',
            align: 'center',
            color: '#000'
        })
        .setOrigin(0.5)
        .setPadding(10, 16)
        .setShadow(2, 4, '#fff')
    }
}
