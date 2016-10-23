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

    constructor (pScene, pEngine) {

        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);
        this.gameManager = new GameManager(pScene, pEngine, this.levelManager);

        CameraManager.init(this.mainScene, this.engine);
        UIManager.initHud(this.mainScene);

        // loading
        this.loadAssets();
    }

    public destroy () {
        this.gameManager.destroy();
        this.levelManager.destroy();
        AssetGraphic.clear();
    }

    public static getLoadedContent (pName:string, pRemoveReferense:boolean = false): any {
        return Babylonia.loadedContent[pName];
    }

    private loadAssets () {
        var loadedCount = 2;
        var loadedCounter = 0;

        var loader = new BABYLON.AssetsManager(this.mainScene);

        UIManager.loadTextures(this.mainScene, onAssetLoaded);
        this.loadUnityAssets(loader, Babylonia.ASSETS_NAME, true);
        this.loadUnityAssets(loader, Babylonia.LEVELS_NAME, false);
        this.loadJsons(loader, Babylonia.JSON_NAMES);

        loader.onFinish = onAssetLoaded;
        loader.useDefaultLoadingScreen = true;
        loader.load();

        var self:Babylonia = this;
        function onAssetLoaded (p) {
            if (++loadedCounter >= loadedCount) self.onAssetsLoaded();
        }
    }

    private onAssetsLoaded () {
        this.gameManager.start();
    }

    private loadUITexture (pLoader:BABYLON.AssetsManager, pSource: string) {

        var lTask = pLoader.addTextFileTask(pSource, Config.JSON_PATH + pSource + '.json');
        lTask.onSuccess = onSucces;

        function onSucces (pTask:BABYLON.TextFileAssetTask) {
            Babylonia.addLoadedContent(pTask.name, pTask.text);
        }
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
