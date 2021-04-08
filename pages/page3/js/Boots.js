export default class Boot extends Phaser.Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('loading', './assets/loading.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
