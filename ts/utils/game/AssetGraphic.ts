
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

    public setVisible(pState: boolean) {
        AssetGraphic.toggleVisible(this.meshes, pState);
    }

    public static addObject(id: string, pMeshes: BABYLON.Mesh[] = [], pSkeletons : any[] = [], pParticleSystems: any[] = []) {
        AssetGraphic.toggleVisible(pMeshes, false);
        AssetGraphic.meshesList[id]           = pMeshes;
        AssetGraphic.skeletonsList[id]        = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    }

    private static toggleVisible(pMeshes:BABYLON.Mesh[], isVisible:boolean):BABYLON.Mesh[] {
        for (var i = 0; i < pMeshes.length; i++) {
            pMeshes[i].isVisible = isVisible;
        }

        return pMeshes;
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;

        this.meshes          = AssetGraphic.cloneGraphicsElements(AssetGraphic.meshesList[pAssetName], "meshes_" + pAssetName)                     || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        this.skeletons       = AssetGraphic.cloneGraphicsElements(AssetGraphic.skeletonsList[pAssetName], "skeletons_" + pAssetName)               || [];
        this.particleSystems = AssetGraphic.cloneGraphicsElements(AssetGraphic.particlesSystemsList[pAssetName], "particleSystems_" + pAssetName)  || [];
    }

    private static cloneGraphicsElements(pArray:any[], pName:string):any[] {
        var newMeshes = [];
        for (var i = 0; i < pArray.length; i++) {
            newMeshes.push(pArray[i].clone(pName));
        }

        return newMeshes;
    }
}
