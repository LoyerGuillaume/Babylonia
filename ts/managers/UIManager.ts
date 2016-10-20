class UIManager {

    private static get HEART_SIZE():number { return 64 };
    private static get SCORE_SIZE():number { return 40 };

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;
    private static heartsSprites:BABYLON.Sprite2D[] = [];

    private static scoreText:BABYLON.Text2D;

    private static hudContainer:BABYLON.ScreenSpaceCanvas2D;


    public static loadTextures(scene:BABYLON.Scene, pCallback:any) {
        UIManager.heartTexture = new BABYLON.Texture('../assets/heart.png', scene, false, true, 0, function () {
            UIManager.heartScale = UIManager.HEART_SIZE / UIManager.heartTexture.getSize().width;
            pCallback();
        });
    }


    public static initHud(scene:BABYLON.Scene) {
        UIManager.hudContainer = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: 'hudContainer'
        });

        UIManager.scoreText = new BABYLON.Text2D('Score : 0', {
            id: 'score',
            parent:UIManager.hudContainer,
            fontName: UIManager.SCORE_SIZE + "pt Arial"
        })

        BEvent.on(PlayerEvent.HIT, UIManager.looseLife);
        window.onresize = UIManager.onResize;
    }


    private static onResize () {
        for (var i in UIManager.heartsSprites) {
            UIManager.heartsSprites[i].y = window.innerHeight - UIManager.HEART_SIZE;
        }
    }


    private static addHeart () {
        var sprite = new BABYLON.Sprite2D(UIManager.heartTexture, {
            id: 'heart' + UIManager.heartsSprites.length,
            parent: UIManager.hudContainer,
            y: window.innerHeight - UIManager.HEART_SIZE,
            x: UIManager.HEART_SIZE * UIManager.heartsSprites.length,
            scale: UIManager.heartScale,
            origin: new BABYLON.Vector2(0, 0)
        });
        UIManager.heartsSprites.push(sprite);
    }


    public static looseLife (pAmount:number) {
        if (typeof pAmount !== 'number') {
            pAmount = 1;
        }
        for (var i = 0; i < pAmount; i++) {
            var sprite = UIManager.heartsSprites.splice(-1, 1);
            sprite[0].dispose();
        }
    }


    public static gainLife (pAmount:number) {
        if (typeof pAmount !== 'number') {
            pAmount = 1;
        }
        for (var i = 0; i < pAmount; i++) {
            UIManager.addHeart();
        }
    }

    public static setScore (pScore:number) {
        console.log(pScore);
        UIManager.scoreText.text = "Score : " + pScore;
    }

}
