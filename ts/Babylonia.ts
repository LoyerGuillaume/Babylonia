class Babylonia {

    private mainScene:BABYLON.Scene;

    private engine:BABYLON.Engine;

    private gameManager: GameManager;

    private levelManager: LevelManager;

    private onPause:boolean = false;
    private oldPausePress:boolean = false;

    private static loadedContent: any = {};

    private static get ASSETS_NAME () { return [
        'elf',
        'Instances'
    ];};

    private static get LEVELS_NAME () { return [
        'Base'
    ];};

    private static get JSON_NAMES () { return [
        'waves'
    ];};

    private static get TEXTURES_NAMES () { return [
        'heart.png',
        'babyboule.png',
        'babyspread.png',
        'babygel.png',
        'babyaoe.png',
    ];};

    constructor (pScene, pEngine) {

        this.mainScene = pScene;
        this.engine = pEngine;

        this.levelManager = new LevelManager(this.mainScene);
        CameraManager.init(this.mainScene, this.engine);

        this.loadAssets();

        window.b = this;
    }

    public destroy () {
        this.gameManager.destroy();
        this.levelManager.destroy();
        AssetGraphic.clear();
    }

    public static getLoadedContent (pName:string, pRemoveReferense:boolean = false): any {
        var lContent = Babylonia.loadedContent[pName];
        if (pRemoveReferense) delete Babylonia.loadedContent[pName];
        return lContent || console.error('The loaded content named "'+pName+'" does not exists.');
    }

    private loadAssets () {

        var loader = new BABYLON.AssetsManager(this.mainScene);

        this.loadUITexture(loader, Babylonia.TEXTURES_NAMES);
        this.loadUnityAssets(loader, Babylonia.ASSETS_NAME, true);
        this.loadUnityAssets(loader, Babylonia.LEVELS_NAME, false);
        this.loadJsons(loader, Babylonia.JSON_NAMES);

        loader.onFinish = this.onAssetsLoaded.bind(this);
        loader.useDefaultLoadingScreen = true;
        loader.load();
    }

    private onAssetsLoaded () {

        this.gameManager = new GameManager(this.mainScene, this.engine, this.levelManager);

        UIManager.init(this.mainScene);

        this.gameManager.start();
    }

    private loadUITexture (pLoader:BABYLON.AssetsManager, pSources: string[]) {

        for (var i in pSources) {
            var assetName: string = pSources[i];
            var lTask = pLoader.addTextureTask(pSources[i], Config.ASSET_PATH + pSources[i]);
            lTask.onSuccess = onSucces;
        }

        function onSucces (pTask:BABYLON.TextureAssetTask) {
            Babylonia.addLoadedContent(pTask.name, Babylonia.initTexture(pTask.texture));
        }
    }

    private static initTexture (pTexture:BABYLON.Texture):BABYLON.Texture {
        pTexture.noMipmap = false;
        pTexture._invertY = true;
        pTexture._samplingMode = 0;
        return pTexture;
    }

    private loadJsons (pLoader:BABYLON.AssetsManager, pSources: string[]) {

        for (var i in pSources) {
            var assetName: string = pSources[i];
            var lTask = pLoader.addTextFileTask(pSources[i], Config.JSON_PATH + pSources[i] + '.json');
            lTask.onSuccess = onSucces;
        }

        function onSucces (pTask:BABYLON.TextFileAssetTask) {
            Babylonia.addLoadedContent(pTask.name, pTask.text);
        }
    }

    private loadUnityAssets(pLoader:BABYLON.AssetsManager, pSources:string[], pInstantiable:boolean) {

        var self:Babylonia = this;
        var loader = pLoader;

        var assetIndex;
        for (assetIndex in pSources) {

            var assetName: string = pSources[assetIndex];
            var meshTask = loader.addMeshTask(assetName, '', Config.ASSET_PATH, assetName + '.babylon');
            meshTask.onSuccess = (pInstantiable) ? onSuccess.bind(this) : onLevelMeshSuccess.bind(this);
        }

        function onSuccess(pTask:BABYLON.MeshAssetTask): void {

            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                AssetGraphic.addObject(pTask.loadedMeshes[i].name, pTask.loadedMeshes[i], pTask.loadedSkeletons[i], pTask.loadedParticleSystems[i]);
            }
        }

        function onLevelMeshSuccess(pTask:BABYLON.MeshAssetTask): void {
            self.initLevel(pTask.loadedMeshes as BABYLON.Mesh[]);
        }
    }

    private static addLoadedContent (pName:string, pContent:any) {
        Babylonia.loadedContent[pName] = pContent;
    }

    private initLevel(pMeshes:BABYLON.Mesh[]) {
          this.levelManager.build(pMeshes);
    }

}
