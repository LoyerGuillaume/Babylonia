class LDElement {

    public name:string;

    public mesh:BABYLON.Mesh;

    constructor(pMesh:BABYLON.Mesh) {
        this.mesh = pMesh;
        this.name = pMesh.name;
    }
}
