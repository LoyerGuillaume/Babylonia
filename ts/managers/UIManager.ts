class UIManager {

    private static get HEART_SIZE()     :number { return 64 };
    private static get SCORE_SIZE()     :number { return 40 };
    private static get COINS_SIZE()     :number { return 40 };
    private static get COINS_OFFSET()   :number { return 20 };
    private static get MESSAGE_SIZE()   :number { return 20 };
    private static get CAPACITY_OFFSET():number { return 250 };

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;
    private static heartsSprites:BABYLON.Sprite2D[] = [];

    private static scoreText:BABYLON.Text2D;
    private static babyCoins:BABYLON.Text2D;
    private static displayText:BABYLON.Text2D;
    private static displayTextPanel:BABYLON.Rectangle2D;

    private static hudContainer:BABYLON.ScreenSpaceCanvas2D;

    private static capacityGroup:BABYLON.Group2D;


    public static loadTextures(scene:BABYLON.Scene, pCallback:any) {
        UIManager.heartTexture = new BABYLON.Texture('../assets/heart.png', scene, false, true, 0, function () {
            UIManager.heartScale = UIManager.HEART_SIZE / UIManager.heartTexture.getSize().width;
            UICapacity.loadTextures(scene, pCallback);
        });
    }


    public static initHud(scene:BABYLON.Scene) {
        UIManager.hudContainer = new BABYLON.ScreenSpaceCanvas2D(scene, {
            id: 'hudContainer'
        });

        UIManager.scoreText = new BABYLON.Text2D('Score : 0', {
            id      : 'score',
            parent  : UIManager.hudContainer,
            fontName: UIManager.SCORE_SIZE + "pt Arial"
        });

        UIManager.babyCoins = new BABYLON.Text2D('Babycoins : 0', {
            id      : 'babycoins',
            parent  : UIManager.hudContainer,
            fontName: UIManager.COINS_SIZE + "pt Arial",
            y       : UIManager.scoreText.height + UIManager.COINS_OFFSET
        })

        BEvent.on(PlayerEvent.GOT_COIN, UIManager.updateCoins, UIManager);
        BEvent.on(PlayerEvent.HIT, UIManager.looseLife, UIManager);
        window.onresize = UIManager.onResize;
    }


    private static onResize () {
        for (var i in UIManager.heartsSprites) {
            UIManager.heartsSprites[i].y = window.innerHeight - UIManager.HEART_SIZE;
        }
        UIManager.placeCapacityContainer();
        if (typeof UIManager.displayTextPanel !== 'undefined') {
            UIManager.displayTextPanel.y = window.innerHeight / 2 - UIManager.displayTextPanel.height / 2;
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


    private static updateCoins (pPlayerEventParams:any) {
        UIManager.babyCoins.text = 'Babycoins : ' + pPlayerEventParams.coins;
    }


    public static displayMessage (pMessage:string) {
        if (typeof UIManager.displayTextPanel === 'undefined') {
            UIManager.displayTextPanel = new BABYLON.Rectangle2D({
                id: 'displayTextPanel',
                parent: this.hudContainer,
                width: 600,
                height: 300,
                x: window.innerWidth / 2 - 300,
                y: window.innerHeight / 2 - 150,
                roundRadius: 20,
                fill: '#000000AF'
            })

            UIManager.displayText = new BABYLON.Text2D(pMessage, {
                id: 'displayedMessage',
                parent: UIManager.displayTextPanel,
                fontName: UIManager.MESSAGE_SIZE + "pt Arial"
            });

            UIManager.displayText.x = UIManager.displayTextPanel.width / 2 - UIManager.displayText.width / 2;
            UIManager.displayText.y = UIManager.displayTextPanel.height / 2 - UIManager.displayText.height / 2;
        } else {
            //UGLY but canvas2D is buggy
            UIManager.displayTextPanel.x = window.innerWidth / 2 - 300;
            UIManager.displayTextPanel.y = window.innerHeight / 2 - 150;
            UIManager.displayText.text = pMessage;
            UIManager.displayText.x = UIManager.displayTextPanel.width / 2 - UIManager.displayText.width / 2;
            UIManager.displayText.y = UIManager.displayTextPanel.height / 2 - UIManager.displayText.height / 2;
        }

    }


    public static removeMessage () {
        if (typeof UIManager.displayTextPanel !== 'undefined') {
            //UGLY but canvas2D is buggy
            UIManager.displayTextPanel.x = -window.innerWidth;
            UIManager.displayTextPanel.y = -window.innerHeight;
        }
    }


    public static initCapacities (pCapacities:{}) {
        if (typeof UIManager.capacityGroup !== 'undefined') {
            UIManager.capacityGroup.dispose();
        }

        UIManager.capacityGroup = new BABYLON.Group2D({
            id: 'CapacityGroup',
            parent: UIManager.hudContainer,
            x: window.innerWidth / 2
        });

        for (var name in pCapacities) {
            UIManager.addCapacity(pCapacities[name]);
        }
    }


    private static addCapacity (pCapacity:{}) {
        var length:number = UIManager.capacityGroup.children.length;
        var capacity:UICapacity = new UICapacity({
            parent: UIManager.capacityGroup
        }, pCapacity);
        capacity.x = length * UIManager.CAPACITY_OFFSET - capacity.width / 2;
        UIManager.placeCapacityContainer();
    }


    private static placeCapacityContainer () {
        UIManager.capacityGroup.x = window.innerWidth / 2 - (UIManager.capacityGroup.children.length - 1) / 2 * UIManager.CAPACITY_OFFSET;
    }
}
