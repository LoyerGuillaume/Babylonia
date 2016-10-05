
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
        super();
        this.setAsset(pAssetName, pScene);
    }

    public static addObject(id: string, pMeshes: BABYLON.Mesh[] = [], pSkeletons : any[] = [], pParticleSystems: any[] = []) {
        pMeshes = AssetGraphic.invisibleAllMesh(pMeshes);
        AssetGraphic.meshesList[id] = pMeshes;
        AssetGraphic.skeletonsList[id] = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    }

    private static invisibleAllMesh(pMeshes:BABYLON.Mesh[]): BABYLON.Mesh[] {
        for (var i = 0; i < pMeshes.length; i++) {
            pMeshes[i].isVisible = false;
        }

        return pMeshes;
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;

        this.meshes = AssetGraphic.meshesList[pAssetName] || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        this.skeletons = AssetGraphic.skeletonsList[pAssetName] || [];
        this.particleSystems = AssetGraphic.particlesSystemsList[pAssetName] || [];
    }
}
