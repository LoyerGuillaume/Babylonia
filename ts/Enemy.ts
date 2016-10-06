class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    protected constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Enemy.list.push(this);

        this.position = pPosition.clone();
    }

}
