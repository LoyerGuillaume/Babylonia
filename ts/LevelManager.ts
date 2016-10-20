class LevelManager {

    private assets: BABYLON.Mesh;
    private scene: BABYLON.Scene;

    private static GP_OBJECTS_PREFFIX: string = 'OBJ_';
    private static GP_POSITION_PREFFIX: string = 'POS_';

    // list of ld elements by name
    private gameplayObjects: {};

    // list of positions by name
    private gameplayPositions: {};

    /**
    * list of ld elements
    */
    public ldElements: LDElement[];

    constructor(pScene: BABYLON.Scene) {
        this.scene = pScene;
        this.ldElements = [];
        this.gameplayObjects = {};
        this.gameplayPositions = {};
    }

    /**
     * initialise level boxes and data
     */
    public build (pMeshes:BABYLON.Mesh[]): void {

        var lElems:BABYLON.AbstractMesh[] = [];

        // get all boxes
        var lLen = pMeshes.length;
        for (var i = 0; i < lLen; i++) {
            if (pMeshes[i].name == 'BOX') {
                CollisionBoxCreator.addBox(pMeshes[i]);
            } else {
                lElems.push(pMeshes[i]);
            }
        }

        // require to be done after all boxes
        lLen = lElems.length;
        for (var i = 0; i < lLen; i++) {
            this.addLDElement(lElems[i]);
        }
    }

    /**
     * return positions of objects tagged with `GP_POSITIONS_PREFFIX` with name `pName`
     */
    public getGameplayPositions (pName:string) {
        return this.gameplayPositions[pName] || [];
    }

    /**
     * return the position of the unique object tagged with `GP_OBJECTS_PREFFIX` with name `pName`
     */
    public getGameplayPositionUnique (pName:string) {
        var lPoss = this.getGameplayPositions(pName);
        if (lPoss[1]) console.error('The gameplay position "'+pName+'" should not be duplicate.');
        return lPoss[0];
    }

    /**
     * return objects tagged with `GP_OBJECTS_PREFFIX` with name `pName`
     */
    public getGameplayObjects (pName:string): LDElement[] {
        return this.gameplayObjects[pName] || [];
    }

    /**
     * return the unique object tagged with `GP_OBJECTS_PREFFIX` with name `pName`
     */
    public getGameplayObjectUnique (pName:string): LDElement {
        var lElems = this.getGameplayObjects(pName);
        if (lElems[1]) console.error('The gameplay element "'+pName+'" should not be duplicate.');
        return lElems[0];
    }

    // PRIVATE OPERATIONS

    private addLDElement (pMesh:BABYLON.AbstractMesh) {

        var lPreffix: string = pMesh.name.substr(0, LevelManager.GP_OBJECTS_PREFFIX.length);

        if (lPreffix == LevelManager.GP_POSITION_PREFFIX) {
            this.addGameplayPosition( pMesh.name, pMesh.position.clone() );
            pMesh.dispose(false);
            return;
        }

        var lLDElem = new LDElement(pMesh as BABYLON.Mesh);

        if (lPreffix == LevelManager.GP_OBJECTS_PREFFIX) {
            this.addGameplayObject( lLDElem );
        }

        this.ldElements.push( lLDElem );
    }

    private addGameplayPosition (pName:string, pPos:BABYLON.Vector3) {

        this.gameplayPositions[pName] = this.gameplayPositions[pName] || [];
        this.gameplayPositions[pName].push(pPos);

    } 

    private addGameplayObject (pMesh:LDElement) {

        var lName:string = pMesh.name.substr(pMesh.name.indexOf('_') + 1);

        this.gameplayObjects[lName] = this.gameplayObjects[lName] || [];
        this.gameplayObjects[lName].push(pMesh);
    }

}
