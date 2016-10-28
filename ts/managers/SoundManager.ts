class SoundManager {

    public static SOUNDS_NAMES:any = Object.freeze({
        BATTLEMUSIC     : 'battlemusic',
        SHOPMUSIC       : 'shopmusic',
        DEATH           : 'death',
        BABYGEL         : 'BabyGel',
        BABYBOOM        : 'BabyBoom',
        MUMMYDEATH      : 'mummydeath',
        BABYSPREAD      : 'BabySpread',
        BABYBOULE       : 'BabyBoule',
        SHOP_POTION     : 'shoppotion',
        SHOPBOX         : 'shopbox',
        COIN            : 'coin'
    });

    public static getSound (pName:string):BABYLON.Sound {
        return SoundManager.sounds[pName] || console.error('The sound named "'+pName+'" does not exists.');
    }

    private static sounds: any = {};

    constructor() { }

    public addSound (pSound:BABYLON.Sound) {
        SoundManager.sounds[pSound.name] = pSound;
    }

    public initSounds () {
        this.mix();
        this.initLoops();
    }

    public clear () {
        // TODO
    }

    private mix () {
        SoundManager.getSound(SoundManager.SOUNDS_NAMES.SHOPBOX).setVolume(1.5);
    }

    private initLoops () {
        SoundManager.getSound(SoundManager.SOUNDS_NAMES.SHOPMUSIC).loop   = true;
        SoundManager.getSound(SoundManager.SOUNDS_NAMES.BATTLEMUSIC).loop = true;
    }

}
