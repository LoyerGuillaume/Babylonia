class HUDManager {

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;

    private static heartContainer:BABYLON.ScreenSpaceCanvas2D;
    private static heartsSprites:BABYLON.Sprite2D[] = [];
    private static get HEART_SIZE():number { return 64 };


    public static loadTextures(scene:BABYLON.Scene, pCallback:any) {
        HUDManager.heartTexture = new BABYLON.Texture('../assets/heart.png', scene, false, true, 0, function () {
            HUDManager.heartScale = HUDManager.HEART_SIZE / HUDManager.heartTexture.getSize().width;
            pCallback();
        });
    }


    public static initHud(scene:BABYLON.Scene) {
        HUDManager.heartContainer = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: 'heartContainer',
            size: new BABYLON.Size(window.innerWidth, window.innerHeight)
        });

        BEvent.on(PlayerEvent.HIT, HUDManager.looseLife);
    }


    private static addHeart () {
        var sprite = new BABYLON.Sprite2D(HUDManager.heartTexture, {
            id: 'heart' + HUDManager.heartsSprites.length,
            parent: HUDManager.heartContainer,
            x: -window.innerWidth / 2 + HUDManager.HEART_SIZE * HUDManager.heartsSprites.length,
            y: -window.innerHeight / 2 - HUDManager.HEART_SIZE,
            scale: HUDManager.heartScale
        });
        HUDManager.heartsSprites.push(sprite);
    }


    public static looseLife (pAmount:number) {
        if (typeof pAmount !== 'number') {
            pAmount = 1;
        }
        for (var i = 0; i < pAmount; i++) {
            var sprite = HUDManager.heartsSprites.splice(-1, 1);
            sprite[0].dispose();
        }
    }


    public static gainLife (pAmount:number) {
        if (typeof pAmount !== 'number') {
            pAmount = 1;
        }
        for (var i = 0; i < pAmount; i++) {
            HUDManager.addHeart();
        }
    }

}
