class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    protected constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Enemy.list.push(this);

        this.position = pPosition.clone();
    }

    public destroy () {
        super.destroy();
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
    }

}
