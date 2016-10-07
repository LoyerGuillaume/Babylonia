class Tree extends AssetGraphic {

    public static list: Tree[] = [];


    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);

        this.scaling = new BABYLON.Vector3(100, 100, 100);

        this.createCollisionBox(new BABYLON.Vector3(0.5, 1.5, 0.5));
    }

    public destroy () {
        super.destroy();
        Tree.list.splice(Tree.list.indexOf(this), 1);
    }
}
