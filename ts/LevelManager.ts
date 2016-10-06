class LevelManager {

    private assets: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    constructor(pScene: BABYLON.Scene) {
        this.scene = pScene;
    }

    public build(): void {
        var lTree: Tree = new Tree('tree_a', this.scene);
        lTree.start();
        lTree.setEnabled(true);
    }

}
