class Tree extends AssetGraphic {

    public static list: Tree[] = [];

    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);
    }
}