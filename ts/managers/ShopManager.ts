class ShopManager {


    private static PEDESTRAL_NAME: string = 'pedestral';

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

        ShopManager.itemShopList[0] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);
        ShopManager.itemShopList[1] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);
        ShopManager.itemShopList[2] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);
        ShopManager.itemShopList[3] = new ItemShop(this.mainScene, 'Bottle_Mana', 10, this.addHealth);

    }

    private addHealth (pPlayer:Player, pItemShop:ItemShop):void {
        console.log('addHealth');
        ShopManager.removeToItemList(pItemShop);

        setTimeout(function () {
            ShopManager.popAllItem();

        }, 1000);
    }

    public static removeToItemList (pItemShop:ItemShop) :void {
        ShopManager.itemShopList.splice(ShopManager.itemShopList.indexOf(pItemShop), 1);
    }


    private initPositionItemShop (pLevelManager:LevelManager) {
        this.pedestralPos = [];
        for (var i = 1; i <= 3; i++) {
            console.log(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i));
            this.pedestralPos.push(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i).mesh.position.clone());
        }

        console.log(this.pedestralPos);
    }

    public static popAllItem () {
        ShopManager.depopAllItem();
        ShopManager.popItem(0);
        ShopManager.popItem(1);
        ShopManager.popItem(2);
    }

    public static popItem (pIndex:number) :void {
        var addPosition:BABYLON.Vector3 = new BABYLON.Vector3(0, 1, 0);
        if (ShopManager.itemShopList[pIndex]) {
            ShopManager.itemShopList[pIndex].setPosition(ShopManager.manager.pedestralPos[pIndex].clone().add(addPosition));
            ShopManager.itemShopList[pIndex].start();
        }

    }


    public static depopAllItem () :void {
        ShopManager.depopItem(0);
        ShopManager.depopItem(1);
        ShopManager.depopItem(2);
    }


    public static depopItem (pIndex:number) :void {
        if (ShopManager.itemShopList[pIndex]) {
            ShopManager.itemShopList[pIndex].enable(false);
        }
    }

}
