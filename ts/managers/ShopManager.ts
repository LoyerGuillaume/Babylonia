class ShopManager {


    private static PEDESTRAL_NAME: string = 'pedestral';

    private itemShopList:ItemShop[];

    private pedestralPos:BABYLON.Vector3[];
    private mainScene:BABYLON.Scene;

    constructor (pScene:BABYLON.Scene, pLevelManager:LevelManager) {
        this.mainScene = pScene;

        this.initPositionItemShop(pLevelManager);
        this.initItemShopList();

        this.popItem();
    }

    private initItemShopList ():void {
        this.itemShopList = [];

        this.itemShopList[0] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);
        this.itemShopList[1] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);
        this.itemShopList[2] = new ItemShop(this.mainScene, 'Bottle_Health', 10, this.addHealth);

    }

    private addHealth (pPlayer:Player):void {
        console.log('addHealth');
    }



    private initPositionItemShop (pLevelManager:LevelManager) {
        this.pedestralPos = [];
        for (var i = 1; i <= 3; i++) {
            console.log(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i));
            this.pedestralPos.push(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i).mesh.position.clone());
        }

        console.log(this.pedestralPos);
    }

    private popItem () {
        var addPosition:BABYLON.Vector3 = new BABYLON.Vector3(0, 1, 0);
        this.itemShopList[0].setPosition(this.pedestralPos[0].clone().add(addPosition));
        this.itemShopList[0].start();
        this.itemShopList[1].setPosition(this.pedestralPos[1].clone().add(addPosition));
        this.itemShopList[1].start();
        this.itemShopList[2].setPosition(this.pedestralPos[2].clone().add(addPosition));
        this.itemShopList[2].start();
    }

}
