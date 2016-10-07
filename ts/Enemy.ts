class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    protected constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Enemy.list.push(this);

        this.position = pPosition.clone();
    }

    protected checkProjectilesCollision ():void {
        for (var i in FireBall.list) {
            if (this.meshe.intersectsMesh(FireBall.list[i], false)) {
                this.destroy();
            }
        }
    }

    protected doActionNormal ():void {
        this.checkProjectilesCollision();
    }

    public destroy ():void {
        super.destroy();
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
    }

}
