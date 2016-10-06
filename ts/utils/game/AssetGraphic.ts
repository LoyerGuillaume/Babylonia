
class AssetGraphic extends GameObject {

    private static objects: {} = {};
    private static meshesList: {} = {};
    private static skeletonsList: {} = {};
    private static particlesSystemsList: {} = {};

    protected meshes: BABYLON.Mesh[];
    protected skeletons: any[];
    protected particleSystems: any[];

    protected assetName: string;

    constructor(pAssetName: string, pScene: BABYLON.Scene) {

        super(pAssetName, pScene);
        this.setAsset(pAssetName, pScene);
    }

    public static addObject(id: string, pMeshes: BABYLON.AbstractMesh[] = [], pSkeletons: any[] = [], pParticleSystems: any[] = []) {
        
        AssetGraphic.toggleEnable(pMeshes, false);
        
        AssetGraphic.meshesList[id]           = pMeshes;
        AssetGraphic.skeletonsList[id]        = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    }
    
    private static toggleEnable(pMeshes: BABYLON.AbstractMesh[], pValue:boolean) {
        for (var i = 0; i < pMeshes.length; i++) {
            pMeshes[i].setEnabled(pValue);
        }
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;

        this.meshes          = AssetGraphic.cloneGraphicsElements(AssetGraphic.meshesList[pAssetName], "meshes_" + pAssetName)                     || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        this.skeletons       = AssetGraphic.cloneGraphicsElements(AssetGraphic.skeletonsList[pAssetName], "skeletons_" + pAssetName)               || [];
        this.particleSystems = AssetGraphic.cloneGraphicsElements(AssetGraphic.particlesSystemsList[pAssetName], "particleSystems_" + pAssetName)  || [];
        
        Tools.forEach(this.meshes, this.addMesh.bind(this));
    }

    private addMesh(pMesh: BABYLON.AbstractMesh) {
        pMesh.setEnabled(true);
        pMesh.parent = this;
    }

    private static cloneGraphicsElements(pArray:any[], pName:string):any[] {
        var newMeshes = [];
        for (var i = 0; i < pArray.length; i++) {
            newMeshes.push(pArray[i].clone(pName));
        }

        return newMeshes;
    }
}
