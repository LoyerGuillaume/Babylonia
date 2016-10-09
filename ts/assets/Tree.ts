class Tree extends AssetGraphic implements ICollisionable {

    public static list: Tree[] = [];

    public collisionBox:BABYLON.Mesh;

    constructor(pAssetName:string, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Tree.list.push(this);

        this.scaling = new BABYLON.Vector3(100, 100, 100);

        CollisionBoxCreator.createCollisionBox(this, this, new BABYLON.Vector3(0.5, 1.5, 0.5));
    }

    public destroy () {
        super.destroy();
        Tree.list.splice(Tree.list.indexOf(this), 1);
    }
}
