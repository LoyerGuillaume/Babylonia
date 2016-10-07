class Tree extends AssetGraphic {

    public static list: Tree[] = [];


    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);

        this.scaling = new BABYLON.Vector3(100, 100, 100);

        this.initCollision();
    }
}
