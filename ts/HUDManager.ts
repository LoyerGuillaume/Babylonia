class HUDManager {

    private static get HEART_SIZE():number { return 64 };
    private static get SCORE_SIZE():number { return 40 };

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;
    private static heartsSprites:BABYLON.Sprite2D[] = [];

    private static scoreText:BABYLON.Text2D;

    private static hudContainer:BABYLON.ScreenSpaceCanvas2D;


    public static loadTextures(scene:BABYLON.Scene, pCallback:any) {
        HUDManager.heartTexture = new BABYLON.Texture('../assets/heart.png', scene, false, true, 0, function () {
            HUDManager.heartScale = HUDManager.HEART_SIZE / HUDManager.heartTexture.getSize().width;
            pCallback();
        });
    }


    public static initHud(scene:BABYLON.Scene) {
        HUDManager.hudContainer = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: 'hudContainer'
        });

        HUDManager.scoreText = new BABYLON.Text2D('Score : 0', {
            id: 'score',
            parent:HUDManager.hudContainer,
            fontName: HUDManager.SCORE_SIZE + "pt Arial"
        })

        BEvent.on(PlayerEvent.HIT, HUDManager.looseLife);
        window.onresize = HUDManager.onResize;
    }


    private static onResize () {
        for (var i in HUDManager.heartsSprites) {
            HUDManager.heartsSprites[i].y = window.innerHeight - HUDManager.HEART_SIZE;
        }
    }


    private static addHeart () {
        var sprite = new BABYLON.Sprite2D(HUDManager.heartTexture, {
            id: 'heart' + HUDManager.heartsSprites.length,
            parent: HUDManager.hudContainer,
            y: window.innerHeight - HUDManager.HEART_SIZE,
            x: HUDManager.HEART_SIZE * HUDManager.heartsSprites.length,
            scale: HUDManager.heartScale,
            origin: new BABYLON.Vector2(0, 0)
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

    public static setScore (pScore:number) {
        console.log(pScore);
        HUDManager.scoreText.text = "Score : " + pScore;
    }

}
