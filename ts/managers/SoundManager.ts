class SoundManager {

    public static SOUNDS_NAMES:any = Object.freeze({
        BATTLEMUSIC     : 'battlemusic',
        SHOPMUSIC       : 'shopmusic',
        DEATH           : 'death',
        BABYGEL         : 'BabyGel',
        BABYBOOM        : 'BabyBoom',
        MUMMYDEATH      : 'mummydeath',
        SHOPBOX         : 'shopbox',
        BABYSPREAD      : 'BabySpread',
        BABYBOULE       : 'BabyBoule',
        SHOP_POTION     : 'shoppotion',
        COIN            : 'coin'
    });

    public static getSound (pName:string) {
        return SoundManager.sounds[pName] || console.error('The sound named "'+pName+'" does not exists.');
    }

    private static sounds: any = {};

    constructor() {

    }

    public addSound (pSound:BABYLON.Sound) {
        SoundManager.sounds[pSound.name] = pSound;
    }

    public clear () {
        // TODO
    }

}
