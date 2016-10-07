class Tree extends AssetGraphic {

    public static list: Tree[] = [];

    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);

        this.scaling.x = 100;
        this.scaling.y = 100;
        this.scaling.z = 100;
    }

    public destroy () {
        super.destroy();
        Tree.list.splice(Tree.list.indexOf(this), 1);
    }
}
