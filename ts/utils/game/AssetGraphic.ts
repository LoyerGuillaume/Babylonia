
class AssetGraphic extends GameObject {

    private static objects: {} = {};
    private static meshesList: {} = {};
    private static skeletonsList: {} = {};
    private static particlesSystemsList: {} = {};

    protected meshes: BABYLON.Mesh[];
    protected skeletons: any[];
    protected particleSystems: any[];

    protected assetName: string;

    private animationList = {};
    private currentAnimationName:string;

    constructor(pAssetName: string, pScene: BABYLON.Scene) {
        super(pAssetName, pScene);
        this.setAsset(pAssetName, pScene);
    }

    public start () {
        super.start();
        this.enable(true);
    }

    public enable(pState: boolean) {
        this.setEnabled(pState);
    }

    public static addObject(id: string, pMeshes: BABYLON.AbstractMesh[] = [], pSkeletons : any[] = [], pParticleSystems: any[] = []) {
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

        this.meshes          = AssetGraphic.cloneMeshes(AssetGraphic.meshesList[pAssetName], "meshes_" + pAssetName)                     || [BABYLON.Mesh.CreateBox(pAssetName, 1, pScene)];
        // this.skeletons       = AssetGraphic.cloneMeshes(AssetGraphic.skeletonsList[pAssetName], "skeletons_" + pAssetName)               || [];
        // this.particleSystems = AssetGraphic.cloneMeshes(AssetGraphic.particlesSystemsList[pAssetName], "particleSystems_" + pAssetName)  || [];

        // this.meshes.forEach( function (meshe))
        Tools.forEach(this.meshes, this.addMesh.bind(this));
    }

    private addMesh(pMesh: BABYLON.AbstractMesh) {
        pMesh.setEnabled(true);
        pMesh.parent = this;
    }

    private static cloneMeshes(pArray:any[], pName:string):any[] {
        var newMeshes = [];
        for (var i = 0; i < pArray.length; i++) {
            var clone = pArray[i].clone(pName);
            if (pArray[i].skeleton) {
                clone.skeleton = pArray[i].skeleton.clone();
            }
            newMeshes.push(clone);
        }

        return newMeshes;
    }


    protected addAnimation(animationName:string, startFrame:number, endFrame:number) {
        this.animationList[animationName] = {
            start: startFrame,
            end: endFrame
        };
    }

    protected runAnimationName(animationName:string, loop:boolean = true) {
        if (this.currentAnimationName != animationName) {
            this.currentAnimationName = animationName;
            var animation = this.animationList[animationName];
            if (animation == null) {
                console.error(animationName + ' doesn\'t exist in animationist, please add animation with addAnimation function');
            }
            this.runAnimation(animation.start, animation.end, loop);
        }
    }

    private runAnimation(startFrame:number, endFrame:number, loop:boolean = true) {
        var that = this;
        this.meshes.forEach(function(meshe) {
            that.getScene().beginAnimation(meshe, startFrame, endFrame, loop);
        });
    }

    protected stopAnimation() {
        this.currentAnimationName = '';
        var that = this;
        this.meshes.forEach(function(meshe) {
            that.getScene().stopAnimation(meshe);
        });
    }
}
