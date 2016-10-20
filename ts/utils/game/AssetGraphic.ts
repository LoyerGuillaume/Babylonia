class AssetGraphic extends GameObject {

    private static objects: {} = {};
    private static meshesList: {} = {};
    private static skeletonsList: {} = {};
    private static particlesSystemsList: {} = {};

    protected meshe: BABYLON.Mesh;
    protected skeletons: any;
    protected particleSystems: any;

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

    public static addObject(id: string, pMeshes: BABYLON.AbstractMesh = undefined, pSkeletons : any = undefined, pParticleSystems: any = undefined) {
        pMeshes.setEnabled(false);

        AssetGraphic.meshesList[id]           = pMeshes;
        AssetGraphic.skeletonsList[id]        = pSkeletons;
        AssetGraphic.particlesSystemsList[id] = pParticleSystems;
    }

    public static clear () {
        AssetGraphic.meshesList           = [];
        AssetGraphic.skeletonsList        = [];
        AssetGraphic.particlesSystemsList = [];
    }

    private static toggleEnable(pMeshes: BABYLON.AbstractMesh[], pValue:boolean) {
        for (var i = 0; i < pMeshes.length; i++) {
            pMeshes[i].setEnabled(pValue);
        }
    }

    private setAsset(pAssetName: string, pScene: BABYLON.Scene): void {
        this.assetName = pAssetName;

        if (AssetGraphic.meshesList[pAssetName]) {
            this.meshe = AssetGraphic.meshesList[pAssetName].clone("meshes_" + pAssetName);
            if (AssetGraphic.meshesList[pAssetName].skeleton) {
                this.meshe.skeleton = AssetGraphic.meshesList[pAssetName].skeleton.clone();
            }
        } else {
            console.warn('The AssetGraphic with the name "'+pAssetName+'" don\'t have any loaded mesh with the same name. Is that ok ?');
            this.meshe = BABYLON.Mesh.CreateBox(pAssetName, 10, pScene);
        }

        AssetGraphic.addMesh(this.meshe, this);
    }

    private static addMesh(pMesh: BABYLON.AbstractMesh, pParent:AssetGraphic) {
        pMesh.setEnabled(true);
        pMesh.parent = pParent;
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
        this.getScene().beginAnimation(this.meshe, startFrame, endFrame, loop);
    }

    protected stopAnimation() {
        this.currentAnimationName = '';
        this.meshe.getScene().stopAnimation(this.meshe);
    }
}
