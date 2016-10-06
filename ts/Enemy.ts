class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    protected constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);

        Enemy.list.push(this);
    }

}
