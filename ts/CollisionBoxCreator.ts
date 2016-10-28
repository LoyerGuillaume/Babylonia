type BoxCollider = { scale: BABYLON.Vector3, rotation: BABYLON.Vector3, position: BABYLON.Vector3 };

class CollisionBoxCreator {

    private static get DEBUG_COLLISION_BOX():boolean { return false; };

    private static boxes:any = {};

    public static addBox (pMesh:BABYLON.Mesh) {
        pMesh.checkCollisions = true;
        pMesh.isVisible       = CollisionBoxCreator.DEBUG_COLLISION_BOX;

        if (pMesh.parent) {
            CollisionBoxCreator.boxes[pMesh.parent.uniqueId] = pMesh;
        } else {
            CollisionBoxCreator.boxes[pMesh.uniqueId] = pMesh;
        }
    }

}
