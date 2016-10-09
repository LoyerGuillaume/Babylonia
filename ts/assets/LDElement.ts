class LDElement implements ICollisionable {

    public collisionBox:BABYLON.Mesh;
    public mesh:BABYLON.Mesh;

    constructor(pMesh:BABYLON.Mesh) {
        this.mesh = pMesh;
        CollisionBoxCreator.createAuto(this, this.mesh);
    }
}
