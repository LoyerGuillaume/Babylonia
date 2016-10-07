class Tree extends AssetGraphic {

    public static list: Tree[] = [];


    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);

        this.scaling = new BABYLON.Vector3(100, 100, 100);

        this.createCollisionBox();
    }

    public destroy () {
        super.destroy();
        Tree.list.splice(Tree.list.indexOf(this), 1);
    }
}
