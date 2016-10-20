class LevelManager {

    private assets: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    private static GP_ELEMENTS_PREFFIX: string = 'LD_';

    private static PLAYER_SPWANER: string = 'LD_Spawner';

    private spawner:LDElement;

    constructor(pScene: BABYLON.Scene) {
        this.scene = pScene;
    }

    public getSpwanerPosition (): BABYLON.Vector3 {
        return this.spawner.mesh.position.clone();
    }

    public build(pMeshes:BABYLON.Mesh[]): void {
        //var lTree: Tree = new Tree('water well', this.scene);
        //lTree.position = new BABYLON.Vector3(500, 0, 10);
        //lTree.start();

        var lElems:BABYLON.AbstractMesh[] = [];

        var lLen = pMeshes.length;
        for (var i = 0; i < lLen; i++) {
            if (pMeshes[i].name == 'BOX') {
                CollisionBoxCreator.addBox(pMeshes[i]);
            } else {
                lElems.push(pMeshes[i]);
            }
        }

        lLen = lElems.length;
        for (var i = 0; i < lLen; i++) {
            var lElem:LDElement = new LDElement(pMeshes[i]);

            if (pMeshes[i].name.substr(0, LevelManager.GP_ELEMENTS_PREFFIX.length) == LevelManager.GP_ELEMENTS_PREFFIX) {
                this.addGameplayElement(lElem);
            }
        }

    }

    private addGameplayElement (pMesh:LDElement) {

        switch (pMesh.name) {
            case LevelManager.PLAYER_SPWANER :
                this.spawner = pMesh;
                break;
            default:
                console.warn('Level Element not used : ' + pMesh.name);
        }
    }

}
