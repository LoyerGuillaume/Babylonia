interface ItemsDictionnary {
    [name: string]: ItemProperties;
}

interface ItemProperties {
    assetName:string,
    sound:string,
    cost:number,
    title:string,
    description:string,
    effect:any,
    quantity:number
}

class ShopManager {

    private static get ITEM_POOL():ItemsDictionnary { return {
        'eternalHeart' : {
            quantity    : 5,
            assetName   : ShopManager.ASSET_NAME.HEALTH,
            sound       : SoundManager.SOUNDS_NAMES.SHOP_POTION,
            cost        : 10,
            effect      : ShopManager.addHealth,
            title       : 'BabyCoeur',
            description : 'Pour être moins en mousse\nGagne un coeur permanent\n(restera même après la mort)'
        },
        'boostBabyBoule' : {
            quantity    : 3,
            assetName   : ShopManager.ASSET_NAME.BONUS1,
            sound       : SoundManager.SOUNDS_NAMES.SHOP_POTION,
            cost        : 20,
            effect      : ShopManager.upgradeBabyBoule,
            title       : 'Upgrade Babyboule',
            description : 'Augmente la puissance de tes\nBabyBoules !!!\nAugmente les dégats'
        },
        'boostBabySpread' : {
            quantity    : 3,
            assetName   : ShopManager.ASSET_NAME.BONUS2,
            sound       : SoundManager.SOUNDS_NAMES.SHOP_POTION,
            cost        : 30,
            effect      : ShopManager.upgradeBabySpread,
            title       : 'Upgrade BabySpread',
            description : 'Gotta BabySpreads \'em all !!!\nAugmente les dégats'
        },
        'boostBabyIce' : {
            quantity    : 3,
            assetName   : ShopManager.ASSET_NAME.BONUS3,
            sound       : SoundManager.SOUNDS_NAMES.SHOPBOX,
            cost        : 40,
            effect      : ShopManager.upgradeBabyIce,
            title       : 'Upgrade BabyGel',
            description : 'Babygel fixation extrême !!!\nAugmente les dégats, la durée et\nle ralentissement'
        }
    }; };

    private static get PEDESTRAL_NAME():string { return 'pedestral'; };

    private static ASSET_NAME: any = {
        HEALTH: 'Bottle_Health',
        BONUS1: 'Bottle_Mana',
        BONUS2: 'Bottle_Endurance',
        BONUS3: 'BoxOfPandora'
    };

    public static itemShopList:ItemShop[];

    public static manager:ShopManager;

    private pedestralPos:BABYLON.Vector3[];
    private mainScene:BABYLON.Scene;

    constructor (pScene:BABYLON.Scene, pLevelManager:LevelManager) {
        ShopManager.manager = this;
        this.mainScene = pScene;

        this.initPositionItemShop(pLevelManager);
        this.initItemShopList();

        ShopManager.popAllItem();

    }

    private initItemShopList ():void {
        ShopManager.itemShopList = [];

        for (var index in ShopManager.ITEM_POOL) {
            var item:ItemProperties = ShopManager.ITEM_POOL[index];
            for (var i = 0; i < item.quantity; i++) {
                this.addItemShopList(item.assetName, item.sound, item.cost, item.title, item.description, item.effect);
            }
        }

        Tools.shuffleArray(ShopManager.itemShopList);
    }

    private addItemShopList (pAssetName:string, pSound:string, pCostCoin:number, pTitle:string, pDescription:string, pCallback:any):void {
        ShopManager.itemShopList[ShopManager.itemShopList.length] = new ItemShop(this.mainScene, pAssetName, pSound, pCostCoin, pTitle, pDescription, pCallback);
    }

    public static bonusCallback(pPlayer:Player, pItemShop:ItemShop) :void {
        ShopManager.removeToItemList(pItemShop);

        pPlayer.lostCoin(pItemShop.costCoin);
        pItemShop.destroy();

        setTimeout(function () {
            ShopManager.popAllItem();

        }, 1000);

    }

    public static enoughtMoney(pPlayer:Player, pItemShop:ItemShop):boolean {
        return pItemShop.costCoin <= pPlayer.coins;
    }

    private static onItemEffect (pPlayer:Player, pItemShop:ItemShop):boolean {
        if (!ShopManager.enoughtMoney(pPlayer, pItemShop)) {
            return false;
        }

        ShopManager.bonusCallback(pPlayer, pItemShop);
        return true;
    }

    private static addHealth (pPlayer:Player, pItemShop:ItemShop):boolean {
        if (!ShopManager.onItemEffect(pPlayer, pItemShop)) {
            return false;
        }
        pPlayer.upgradeLife = 1;

        return true;
    }

    private static upgradeBabyBoule (pPlayer:Player, pItemShop:ItemShop):boolean {
        if (!ShopManager.onItemEffect(pPlayer, pItemShop)) {
            return false;
        }

        FireBall.upgrade({
            damageUp: 0.5,
            lifeTimeUp: 10
        })

        return true;
    }

    private static upgradeBabySpread (pPlayer:Player, pItemShop:ItemShop):boolean {
        if (!ShopManager.onItemEffect(pPlayer, pItemShop)) {
            return false;
        }

        BallSpread.upgrade({
            damageUp: 0.5,
            lifeTimeUp: 10
        })

        return true;
    }

    private static upgradeBabyIce (pPlayer:Player, pItemShop:ItemShop):boolean {
        if (!ShopManager.onItemEffect(pPlayer, pItemShop)) {
            return false;
        }

        IceSpikes.upgrade({
            damageUp: 0.01,
            lifeTimeUp: 100,
            malusSpeedUp: -0.2
        })

        return true;
    }

    public static removeToItemList (pItemShop:ItemShop) :void {
        ShopManager.itemShopList.splice(ShopManager.itemShopList.indexOf(pItemShop), 1);
    }


    private initPositionItemShop (pLevelManager:LevelManager) {
        this.pedestralPos = [];
        for (var i = 1; i <= 3; i++) {
            this.pedestralPos.push(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i).mesh.position.clone());
        }
    }


    public static popAllItem () {
        ShopManager.depopAllItem();
        var indexMax = Math.min(ShopManager.itemShopList.length, 3);
        for (var i = 0; i < indexMax; i++) {
            ShopManager.popItem(i, i);
        }
    }

    public static popItem (pIndex:number, pPos:number) :void {
        var addPosition:BABYLON.Vector3 = new BABYLON.Vector3(0, 1, 0);
        if (ShopManager.itemShopList[pIndex]) {
            ShopManager.itemShopList[pIndex].setPosition(ShopManager.manager.pedestralPos[pPos].clone().add(addPosition));
            ShopManager.itemShopList[pIndex].start();
        }

    }


    public static depopAllItem () :void {
        for (var i = 0; i < 3; i++) {
            ShopManager.depopItem(i);
        }
    }


    public static depopItem (pIndex:number) :void {
        if (ShopManager.itemShopList[pIndex]) {
            ShopManager.itemShopList[pIndex].enable(false);
        }
    }

}
