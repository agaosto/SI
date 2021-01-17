import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('game-over')
    }

    preload() {
        this.load.audio("warning", "assets/soundfx/warning.wav")
    }

    create() {
        this.add.image(240, 320, 'background')

        this.sound.play('warning')

        const width = this.scale.width
        const height = this.scale.height

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('game')
        })

        this.add.text(this.scale.width * 0.5, this.scale.height * 0.4, 'GAME OVER', {
            fontFamily: 'Bangers',
            fontSize: '64px',
            color: '#000'
        })
        .setOrigin(0.5)
        .setPadding(10, 16)
        .setShadow(3, 5, '#fff')

        this.add.text(width * 0.5, height * 0.5, 'Naciśnij spację, aby zagrać ponownie', {
            fontFamily: 'Bangers',
            fontSize: '32px',
            color: '#000'
        })
        .setOrigin(0.5)
        .setPadding(10, 16)
        .setShadow(2, 4, '#fff')
    }
}