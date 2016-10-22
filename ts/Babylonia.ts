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

    private static get WAVES_DESCRIPTION_NAME () { return 'waves'; };

    constructor (pScene, pEngine) {

        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);
        this.gameManager = new GameManager(pScene, pEngine, this.levelManager);

        CameraManager.init(this.mainScene, this.engine);
        UIManager.initHud(this.mainScene);

        // loading
        var loadedCount = 4;
        var loadedCounter = 0;

        this.loadAssets(Babylonia.ASSETS_NAME, true, onAssetLoaded);
        this.loadAssets(Babylonia.LEVELS_NAME, false, onAssetLoaded);
        UIManager.loadTextures(this.mainScene, onAssetLoaded);
        this.loadJson(Babylonia.WAVES_DESCRIPTION_NAME, onAssetLoaded);

        var self:Babylonia = this;
        function onAssetLoaded (p) {
            if (++loadedCounter >= loadedCount) self.gameManager.start();
        }
    }

    public static getLoadedContent (pName:string): any {
        return Babylonia.loadedContent[pName];
    }

    private static addLoadedContent (pName:string, pContent:any) {
        Babylonia.loadedContent[pName] = pContent;
    }

    public destroy () {
        this.gameManager.destroy();
        this.levelManager.destroy();
        AssetGraphic.clear();
    }

    private initLevel(pMeshes:BABYLON.Mesh[]) {
          this.levelManager.build(pMeshes);
    }

    private loadJson (pSource: string, pCallback) {

        var loader = new BABYLON.AssetsManager(this.mainScene);

        var lTask = loader.addTextFileTask(pSource, Config.JSON_PATH + pSource + '.json');
        lTask.onSuccess = onSucces;
        loader.onFinish = pCallback;
        loader.load();

        function onSucces (pTask:BABYLON.TextFileAssetTask) {
            Babylonia.addLoadedContent(pTask.name, pTask.text);
        }
    }

    private loadAssets(pSources:string[], pInstantiable:boolean, pCallback) {

        var self:Babylonia = this;
        var loader = new BABYLON.AssetsManager(this.mainScene);

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

        loader.onFinish = pCallback;

        loader.useDefaultLoadingScreen = false; // FIXME : Path loading screen
        loader.load();
    }


}
