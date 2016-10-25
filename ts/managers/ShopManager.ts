class ShopManager {


    private static PEDESTRAL_NAME: string = 'pedestral';

    private pedestralPos:BABYLON.Vector3[];
    private mainScene:BABYLON.Scene;

    constructor (pScene:BABYLON.Scene, pLevelManager:LevelManager) {
        this.mainScene = pScene;
        this.initPositionItemShop(pLevelManager);

        this.popItem();
    }



    private initPositionItemShop (pLevelManager:LevelManager) {
        this.pedestralPos = [];
        for (var i = 1; i <= 3; i++) {
            this.pedestralPos.push(pLevelManager.getGameplayObjectUnique(ShopManager.PEDESTRAL_NAME + '0' + i).mesh.position.clone());
        }

        console.log(this.pedestralPos);
    }

    private popItem () {
        var addPosition:BABYLON.Vector3 = new BABYLON.Vector3(0, 1, 0);
        var itemShop1 = new ItemShop(this.mainScene, 'Bottle_Health', this.pedestralPos[0].clone().add(addPosition));
        itemShop1.start();
        var itemShop2 = new ItemShop(this.mainScene, 'Bottle_Health', this.pedestralPos[1].clone().add(addPosition));
        itemShop2.start();
        var itemShop3 = new ItemShop(this.mainScene, 'Bottle_Health', this.pedestralPos[2].clone().add(addPosition));
        itemShop3.start();
    }

}
