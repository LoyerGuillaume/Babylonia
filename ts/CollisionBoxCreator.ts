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

    public static getBox (pMeshId:number): BABYLON.Mesh {
        return CollisionBoxCreator.boxes[pMeshId];
    }

    /**
     * remove boxes references
     */
    public static clear () {
        CollisionBoxCreator.boxes = {};
    }

    /**
     * DEPRICATED
     */
    public static createCollisionBox(pElem: ICollisionable, pParent:BABYLON.Mesh, collider: BoxCollider = null) {

        // defaults
        collider = collider || {scale:null, position:null, rotation:null};
        collider.position = collider.position || new BABYLON.Vector3(0, 0, 0);
        collider.rotation = collider.rotation || new BABYLON.Vector3(0, 0, 0);
        collider.scale    = collider.scale    || new BABYLON.Vector3(1, 1, 1);

        // rotation convert
        collider.rotation.x *= MathTools.DEG2RAD;
        collider.rotation.y *= MathTools.DEG2RAD;
        collider.rotation.z *= MathTools.DEG2RAD;

        pElem.collisionBox                 = BABYLON.Mesh.CreateBox("collision", 2, pParent.getScene());
        pElem.collisionBox.parent          = pParent;
        pElem.collisionBox.checkCollisions = true;
        pElem.collisionBox.scaling         = collider.scale;
        pElem.collisionBox.position        = collider.position;
        pElem.collisionBox.rotation        = collider.rotation;
        pElem.collisionBox.isVisible       = CollisionBoxCreator.DEBUG_COLLISION_BOX;
    }

    /**
     * DEPRICATED
     */
    private static collisionBoxes = {
        'water well' : {scale: new BABYLON.Vector3(1.8, 1.8, 1.8), position: new BABYLON.Vector3(.2, .2, -1), rotation: new BABYLON.Vector3(0, 0, 45)}
    };

    /**
     * DEPRICATED
     */
    public static createByName (pElem: ICollisionable, pMesh:BABYLON.AbstractMesh) {
        if (CollisionBoxCreator.collisionBoxes[pMesh.name]) {
            CollisionBoxCreator.createCollisionBox(pElem, pMesh as BABYLON.Mesh, CollisionBoxCreator.collisionBoxes[pMesh.name]);
        } else {
            console.warn('Oula ! Il manque la définition d\'une box de collision dans CollisionBoxCreator.');
        }
    }

}
