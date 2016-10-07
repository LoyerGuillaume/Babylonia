class LevelManager {

    private assets: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    constructor(pScene: BABYLON.Scene) {
        this.scene = pScene;
    }

    public build(): void {
        var lTree: Tree = new Tree('tree_a', this.scene);
        lTree.position = new BABYLON.Vector3(500, 0, 10);
        lTree.start();
    }

}
