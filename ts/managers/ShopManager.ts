class ShopManager {


    private static PEDESTRAL_NAME: string = 'pedestral';

    private pedestralPos:BABYLON.Vector3[];

    constructor (pLevelManager:LevelManager) {
        this.initPositionItemShop(pLevelManager);
    }

    private initPositionItemShop (pLevelManager:LevelManager) {
        this.pedestralPos = [];
        this.pedestralPos.push(pLevelManager.getGameplayPositionUnique(ShopManager.PEDESTRAL_NAME + '01'));
        this.pedestralPos.push(pLevelManager.getGameplayPositionUnique(ShopManager.PEDESTRAL_NAME + '02'));
        this.pedestralPos.push(pLevelManager.getGameplayPositionUnique(ShopManager.PEDESTRAL_NAME + '03'));
    }

}
