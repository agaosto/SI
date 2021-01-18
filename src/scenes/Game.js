import Phaser from '../lib/phaser.js'

import Item from '../game/Item.js'

export default class Game extends Phaser.Scene {
    itemsCollected = 0
    player
    platforms
    cursors
    items
    itemsCollectedText

    constructor() {
        super({
            key: 'game',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
        })
    }

    init() {
        this.itemsCollected = 0
    }

    preload() {
        this.load.image('background', 'assets/bg_layer1.png')
        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('char-stand', 'assets/adventurer_stand.png')
        this.load.image('char-jump', 'assets/adventurer_cheer2.png')
        this.load.image('weight', 'assets/weight.png')
        this.load.audio('jump', 'assets/soundfx/phaseJump1.ogg')
        this.load.audio("music", "assets/soundfx/title.wav")

        this.cursors = this.input.keyboard.createCursorKeys()

        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        var config = {
            google: {
                families: ['Bangers::latin-ext']
            }
        };
        this.load.rexWebFont(config);
    }

    create() {
        this.add.image(240, 320, 'background')
        .setScrollFactor(0, 0)
        this.platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            const body = platform.body
            body.updateFromGameObject()
            body.checkCollision.down = false;
            body.checkCollision.left = false;
            body.checkCollision.right = false;
        }
        this.player = this.physics.add.sprite(240, 320, 'char-stand')

        this.items = this.physics.add.group({
            classType: Item
        })

        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.platforms, this.items)
        this.physics.add.overlap(
            this.player,
            this.items,
            this.handleCollectItem,
            undefined,
            this
        )

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        
        this.itemsCollectedText = this.add.text(240, 640, 'Punkty: 0', {
            fontFamily: 'Bangers',
            fontSize: '24px',
            color: '#000'
        })
        .setScrollFactor(0)
        .setOrigin(0.5, 1)
        .setPadding(10, 5)
        .setShadow(1, 1, '#fff')
        
        this.add.text(240, 0, 'Poziooooom 1 - masa, kilogram [kg]', {
            fontFamily: 'Bangers',
            fontSize: '24px',
            color: '#000'
        })
        .setScrollFactor(0)
        .setOrigin(0.5, 0)
        .setPadding(10, 5)
        .setShadow(1, 1, '#fff')

        this.add.text(this.scale.width * 0.5, this.scale.height * 0.25, 'MASA,\nKILOGRAM', {
            fontFamily: 'Bangers',
            fontSize: '64px',
            color: '#000',
            align: 'center'
        })
        .setOrigin(0.5)
        .setPadding(10, 16)
        .setShadow(3, 5, '#fff')

        this.music = this.sound.add("music");
        this.music.play({
            mute: false,
            volume: 0.1,
            loop: true
        })
    }

    update() {
        const touchingDown = this.player.body.touching.down

        if (touchingDown) {
            this.player.setVelocityY(-300)
            this.player.setTexture('char-jump')
            this.sound.play('jump', {volume: 0.2})
        }

        const velocityY = this.player.body.velocity.y
        if (velocityY > 0 && this.player.texture.key !== 'char-stand') {
            this.player.setTexture('char-stand')
        }

        this.platforms.children.iterate(child => {
            const platform = child

            const scrollY = this.cameras.main.scrollY

            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()

                this.addItemAbove(platform)
            }
        })

        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        } else {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform()
        if (this.player.y > bottomPlatform.y + 200) {
            this.music.stop()
            this.scene.start('game-over')
        }

        if(this.itemsCollected > 9) {
            this.cameras.main.fadeOut(1000);
            this.scene.start('game2', {itemsCollected: this.itemsCollected})
        }
    }

    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addItemAbove(sprite) {
        const y = sprite.y - sprite.displayHeight
        const whereItem = sprite.x + sprite.displayWidth/2 - Phaser.Math.Between(40, sprite.displayWidth-40)
        const item = this.items.get(whereItem, y, 'weight')
        item.setActive(true)
        item.setVisible(true)
        this.add.existing(item).setScale(0.5)
        item.body.setSize(item.width, item.height)
        this.physics.world.enable(item)
        return item
    }

    handleCollectItem(player, item) {
        this.items.killAndHide(item)
        this.physics.world.disableBody(item.body)
        this.itemsCollected++

        const value = `Punkty: ${this.itemsCollected}`
        this.itemsCollectedText.text = value
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]
        for (let i = 1; i < platforms.length; ++i) {
            const platform = platforms[i]

            if (platform.y > bottomPlatform.y) {
                bottomPlatform = platform
            } 
        }
        return bottomPlatform
    }
}
