class UIManager {

    private static get FONT()              :string { return "Montserrat"; };
    private static get HEART_SIZE()        :number { return 64; };
    private static get SCORE_SIZE()        :number { return 40; };
    private static get BEST_SCORE_SIZE()   :number { return 36; };
    private static get BEST_SCORE_OFFSET() :number { return 18; };
    private static get COINS_SIZE()        :number { return 40; };
    private static get COINS_OFFSET()      :number { return 30; };
    private static get COINS_OFFSET_X()    :number { return 400; };
    private static get MESSAGE_SIZE()      :number { return 20; };
    private static get CAPACITY_OFFSET()   :number { return 250; };

    private static heartTexture:BABYLON.Texture;
    private static heartScale:number;
    private static heartsContainer:BABYLON.Group2D;

    private static score:BABYLON.Text2D;
    private static bestScoreText:BABYLON.Text2D;
    private static babyCoins:BABYLON.Group2D;
    private static textCoins:BABYLON.Text2D;

    private static popinShop :BABYLON.ScreenSpaceCanvas2D;

    private static displayText:BABYLON.Text2D;
    private static displayTextPanel:BABYLON.Rectangle2D;

    private static hudContainer:BABYLON.ScreenSpaceCanvas2D;

    private static capacityGroup:BABYLON.Group2D;

    private static scene :BABYLON.Scene;

    public static init (pScene :BABYLON.Scene) {

        UIManager.scene = pScene;

        UIManager.initHud(pScene);

        UIManager.heartTexture = Babylonia.getLoadedContent('heart.png', true);
        UIManager.heartScale = UIManager.HEART_SIZE / UIManager.heartTexture.getSize().width;

        UICapacity.initTextures();
    }

    /**
     * DEPRECATED
     */
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

        var textScore:BABYLON.Text2D = new BABYLON.Text2D('Score : ', {
            id      : 'textScore',
            parent  : UIManager.hudContainer,
            fontName: UIManager.SCORE_SIZE + "pt " + UIManager.FONT
        });

        UIManager.score = new BABYLON.Text2D('0', {
            id      : 'score',
            parent  : UIManager.hudContainer,
            fontName: UIManager.SCORE_SIZE + "pt " + UIManager.FONT,
            x: textScore.width
        });

        UIManager.bestScoreText = new BABYLON.Text2D('Best score : 0', {
            id      : 'best_score',
            parent  : UIManager.hudContainer,
            fontName: UIManager.BEST_SCORE_SIZE + "pt " + UIManager.FONT,
            y       : UIManager.score.height - UIManager.BEST_SCORE_OFFSET
        });

        UIManager.babyCoins = new BABYLON.Group2D({
            id      : 'babycoins',
            parent  : UIManager.hudContainer,
            y       : window.innerHeight - UIManager.COINS_OFFSET - UIManager.COINS_SIZE,
            x       : window.innerWidth  - UIManager.COINS_OFFSET_X
        })

        var text = new BABYLON.Text2D('Babycoins : ', {
            id      : 'babycoinsText',
            parent  : UIManager.babyCoins,
            fontName: UIManager.COINS_SIZE + "pt " + UIManager.FONT
        })

        var group:BABYLON.Group2D = new BABYLON.Group2D({
            id    : 'textCoinsContainer',
            parent: UIManager.hudContainer,
            origin  : new BABYLON.Vector2(0.5, 0.7),
            y       : window.innerHeight - UIManager.COINS_OFFSET - UIManager.COINS_SIZE,
            x       : window.innerWidth  - UIManager.COINS_OFFSET_X + text.width
        })

        UIManager.textCoins = new BABYLON.Text2D('0', {
            id      : 'textCoins',
            parent  : group,    //need to put text in group2D because Text2D can't scale and I can't use group babyCoins because a group can't be scaled if it's in another group
            fontName: UIManager.COINS_SIZE + "pt " + UIManager.FONT
        })


        UIManager.heartsContainer = new BABYLON.Group2D({
            parent: UIManager.hudContainer,
            origin: new BABYLON.Vector2(0, 0),
            y     : window.innerHeight - UIManager.HEART_SIZE
        })

        BEvent.on(PlayerEvent.GOT_COIN, UIManager.updateCoins, UIManager);
        BEvent.on(PlayerEvent.HIT, UIManager.looseLife, UIManager);
        BEvent.on(PlayerEvent.GAIN_LIFE, UIManager.gainLife, UIManager);
        window.onresize = UIManager.onResize;
    }

    public static closeShopPopin () {
        if (UIManager.popinShop) {
            UIManager.popinShop.levelVisible = false;
            UIManager.popinShop = undefined;
        }
    }

    public static openShopPopin (pTitle:string, pText:string, pPrice:number, pLevelRequired:number, pBuyKey = 'E') {
        UIManager.closeShopPopin();
        UIManager.popinShop = new BABYLON.ScreenSpaceCanvas2D(UIManager.scene, {
            id: "PopinShopCanvas",
            size: new BABYLON.Size(400, 230),
            backgroundFill: "#4040408F",
            backgroundRoundRadius: 10,
            x : 400,
            y : 300,
            children: [
                new BABYLON.Text2D(pTitle, {
                    id: "SHOP_Title",
                    fontName: "20pt " + UIManager.FONT,
                    x : 30,
                    y : 175
                }),
                new BABYLON.Text2D(pText, {
                    id: "SHOP_Text",
                    marginAlignment: "h: center, v:center",
                    fontName: "12pt " + UIManager.FONT,
                    x : 0,
                    y : 10,
                }),
                new BABYLON.Text2D('Press '+pBuyKey+' for buy', {
                    id: "SHOP_Info",
                    marginAlignment: "h: center",
                    fontName: "12pt " + UIManager.FONT,
                    defaultFontColor: new BABYLON.Color4(183, 183, 183, 183),
                    y : 50
                }),

                new BABYLON.Text2D('Price : ', {
                    id: "SHOP_Price",
                    fontName: "14pt " + UIManager.FONT,
                    x : 40,
                    y : 20
                }),
                new BABYLON.Text2D(pPrice.toString(), {
                    id: "SHOP_PriceValue",
                    fontName: "14pt " + UIManager.FONT,
                    defaultFontColor: new BABYLON.Color4(192, 159, 79, 1),
                    x : 100,
                    y : 20
                }),

                new BABYLON.Text2D('Level : ', {
                    id: "SHOP_Level",
                    fontName: "14pt " + UIManager.FONT,
                    x : 220,
                    y : 20
                }),
                new BABYLON.Text2D(pLevelRequired.toString(), {
                    id: "SHOP_LevelValue",
                    fontName: "14pt " + UIManager.FONT,
                    x : 280,
                    y : 20
                })
            ]
        });

    }

    private static onResize () {
        UIManager.heartsContainer.y = window.innerHeight - UIManager.HEART_SIZE;
        UIManager.babyCoins.y = window.innerHeight - UIManager.COINS_OFFSET - UIManager.COINS_SIZE;
        UIManager.babyCoins.x = window.innerWidth  - UIManager.COINS_OFFSET_X;
        UIManager.textCoins.parent.y = window.innerHeight - UIManager.COINS_OFFSET - UIManager.COINS_SIZE;
        UIManager.textCoins.parent.x = window.innerWidth  - UIManager.COINS_OFFSET_X + UIManager.babyCoins.children[0].width    //Group2D.width equals 0 so I need to use child's width
        UIManager.placeCapacityContainer();
        if (typeof UIManager.displayTextPanel !== 'undefined') {
            UIManager.displayTextPanel.y = window.innerHeight / 2 - UIManager.displayTextPanel.height / 2;
        }
    }


    private static addHeart () {
        new BABYLON.Sprite2D(UIManager.heartTexture, {
            id: 'heart' + UIManager.heartsContainer.children.length,
            parent: UIManager.heartsContainer,
            x: UIManager.HEART_SIZE * UIManager.heartsContainer.children.length,
            scale: UIManager.heartScale,
            origin: new BABYLON.Vector2(0, 0)
        });
    }


    public static looseLife (pAmount:number) {
        if (typeof pAmount !== 'number') {
            pAmount = 1;
        }
        for (var i = 0; i < pAmount; i++) {
            var sprite = UIManager.heartsContainer.children.pop();
            //UGLY but .dispose() is full buggy
            sprite.y = 1500;
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
        UIManager.score.text = pScore.toString(10);
    }

    public static setBestScore (pBestScore:number) {
        UIManager.bestScoreText.text = "Best score : " + pBestScore;
    }


    private static updateCoins (pPlayerEventParams:any) {
        UIManager.textCoins.text = pPlayerEventParams.coins.toString(10);
        UIManager.textCoins.parent.scale = 1;
        Tools.bump({
            prim2D : UIManager.textCoins.parent,
            scale  : 2.5
        });
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
                fontName: UIManager.MESSAGE_SIZE + "pt Arial"   //can't use custom font, it brokes UICapacity texts
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
