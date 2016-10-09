class CollisionBoxCreator {

    private static get DEBUG_COLLISION_BOX():boolean { return true; };

    private static collisionBoxes = {
        'water well' : new BABYLON.Vector3(1, 1, 1)
    };

    public static createCollisionBox(pElem: ICollisionable, pParent:BABYLON.Mesh, scale:BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)) {
        pElem.collisionBox                 = BABYLON.Mesh.CreateBox("collision", 2, pParent.getScene());
        pElem.collisionBox.parent          = pParent;
        pElem.collisionBox.checkCollisions = true;
        pElem.collisionBox.scaling         = scale;
        pElem.collisionBox.isVisible       = CollisionBoxCreator.DEBUG_COLLISION_BOX;
    }

    public static createAuto (pElem: ICollisionable, pMesh:BABYLON.AbstractMesh) {
        if (CollisionBoxCreator.collisionBoxes[pMesh.name]) {
            CollisionBoxCreator.createCollisionBox(pElem, pMesh as BABYLON.Mesh, CollisionBoxCreator.collisionBoxes[pMesh.name]);
        } else {
            console.warn('Oula ! Il manque la définition d\'une box de collision dans CollisionBoxCreator.');
        }
    }

}
