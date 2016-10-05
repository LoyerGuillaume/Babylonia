
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
        AssetGraphic.meshesList[id] = pMeshes;
        AssetGraphic.skeletonsList[id] = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    } 

    public static invisibleAllMesh(pMeshes:BABYLON.Mesh[]): BABYLON.Mesh[] {
        return AssetGraphic.toggleVisible(pMeshes, false);
    }

    public static visibleAllMesh(pMeshes:BABYLON.Mesh[]): BABYLON.Mesh[] {
        return AssetGraphic.toggleVisible(pMeshes, true);
    }

    private static toggleVisible(pMeshes:BABYLON.Mesh[], isVisible:boolean):BABYLON.Mesh[] {
        for (var i = 0; i < pMeshes.length; i++) {
            pMeshes[i].isVisible = isVisible;
        }

        return pMeshes;
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;

        this.meshes = AssetGraphic.meshesList[pAssetName]                       || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        this.skeletons = AssetGraphic.skeletonsList[pAssetName]                 || [];
        this.particleSystems = AssetGraphic.particlesSystemsList[pAssetName]    || [];
    }
}
