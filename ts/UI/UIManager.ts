class UIManager {

    private static get HEART_SIZE()     :number { return 64 };
    private static get SCORE_SIZE()     :number { return 40 };
    private static get MESSAGE_SIZE()   :number { return 20 };
    private static get CAPACITY_OFFSET():number { return 150 };

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;
    private static heartsSprites:BABYLON.Sprite2D[] = [];

    private static scoreText:BABYLON.Text2D;
    private static displayText:BABYLON.Text2D;

    private static hudContainer:BABYLON.ScreenSpaceCanvas2D;

    private static capacityGroup:BABYLON.Group2D;


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
        });

        UIManager.capacityGroup = new BABYLON.Group2D({
            parent: UIManager.hudContainer,
            x: window.innerWidth / 2
        })

        BEvent.on(PlayerEvent.HIT, UIManager.looseLife);
        window.onresize = UIManager.onResize;
    }


    private static onResize () {
        for (var i in UIManager.heartsSprites) {
            UIManager.heartsSprites[i].y = window.innerHeight - UIManager.HEART_SIZE;
        }
        UIManager.placeCapacityContainer();
        if (typeof UIManager.displayText !== 'undefined') {
            UIManager.displayText.position = new BABYLON.Vector2(window.innerWidth / 2 - UIManager.displayText.width / 2, window.innerHeight / 2);
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
        UIManager.scoreText.text = "Score : " + pScore;
    }


    public static displayMessage (pMessage:string) {
        if (typeof UIManager.displayText === 'undefined') {
            UIManager.displayText = new BABYLON.Text2D(pMessage, {
                id: 'displayedMessage',
                parent:UIManager.hudContainer,
                fontName: UIManager.MESSAGE_SIZE + "pt Arial"
            });
        } else {
            UIManager.displayText.text = pMessage;
        }

        UIManager.displayText.position = new BABYLON.Vector2(window.innerWidth / 2 - UIManager.displayText.width / 2, window.innerHeight / 2);
    }


    public static removeMessage () {
        if (typeof UIManager.displayText !== 'undefined') {
            UIManager.displayText.text = '';
        }
    }


    public static addCapacity (pName:string) {
        var length:number = UIManager.capacityGroup.children.length;
        var text:BABYLON.Text2D = new BABYLON.Text2D(pName, {
            id: pName,
            parent: UIManager.capacityGroup,
            fontName: UIManager.MESSAGE_SIZE + "pt Arial",
        })
        text.x = length * UIManager.CAPACITY_OFFSET - text.width / 2;
        UIManager.placeCapacityContainer();
    }


    private static placeCapacityContainer () {
        UIManager.capacityGroup.x = window.innerWidth / 2 - (UIManager.capacityGroup.children.length - 1) / 2 * UIManager.CAPACITY_OFFSET;
    }
}
