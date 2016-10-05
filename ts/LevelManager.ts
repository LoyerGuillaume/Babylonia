class LevelManager {

    private assets: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    constructor(pScene: BABYLON.Scene) {
        this.scene = pScene;
    }

    public build(): void {
        var lTree: Tree = new Tree('elf', this.scene);
        lTree.start();
        lTree.setVisible(true);
    }

}
