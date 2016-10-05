
class AssetGraphic {

    private static objects: {} = {};
    private static meshesList: {} = {};
    private static skeletonsList: {} = {};
    private static particlesSystemsList: {} = {};

    protected meshes: BABYLON.Mesh[];
    protected skeletons: any[];
    protected particleSystems: any[];

    protected assetName: string;

    constructor(pAssetName: string, pScene: BABYLON.Scene) {
        this.setAsset(pAssetName, pScene);
    }

    public static addObject(id: string, pMeshes: BABYLON.Mesh[] = [], pSkeletons : any[] = [], pParticleSystems: any[] = []) {
        AssetGraphic.meshesList[id] = pMeshes;
        AssetGraphic.skeletonsList[id] = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;
        
        this.meshes = AssetGraphic.meshesList[pAssetName] || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        this.skeletons = AssetGraphic.skeletonsList[pAssetName] || [];
        this.particleSystems = AssetGraphic.particlesSystemsList[pAssetName] || [];
    }
}