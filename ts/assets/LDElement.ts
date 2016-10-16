class LDElement implements ICollisionable {

    public name:string;

    /**
     * DEPRICATED
     */
    public collisionBox:BABYLON.Mesh;

    public mesh:BABYLON.Mesh;

    constructor(pMesh:BABYLON.Mesh) {

        this.mesh = pMesh;
        this.name = pMesh.name

        CollisionBoxCreator.getBox(this.mesh.uniqueId);
    }
}
