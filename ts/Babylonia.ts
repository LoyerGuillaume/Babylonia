class Babylonia {

    private mainScene:BABYLON.Scene;

    private engine:BABYLON.Engine;

    private gameManager: GameManager;

    private levelManager: LevelManager;

    private onPause:boolean = false;
    private oldPausePress:boolean = false;

    private playerOne:Player;

    private static get ASSETS_NAME() { return [
        'elf'
    ];};

    private static get LEVELS_NAME() { return [
        'Base'
    ];};

    constructor (pScene, pEngine) {

        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);
        this.gameManager = new GameManager(pScene, pEngine, this.levelManager);

        CameraManager.init(this.mainScene, this.engine);

        // loading
        var loadedCount = 2;
        var loadedCounter = 0;

        var self:Babylonia = this;
        function onAssetLoaded () {
            if (++loadedCounter >= loadedCount) self.gameManager.start();
        }

        this.loadAssets(Babylonia.ASSETS_NAME, true, onAssetLoaded);
        this.loadAssets(Babylonia.LEVELS_NAME, false, onAssetLoaded);
    }

    public destroy () {
        this.gameManager.destroy();
        this.levelManager.destroy();
        AssetGraphic.clear();
    }

    private initLevel(pMeshes:BABYLON.Mesh[]) {
          this.levelManager.build(pMeshes);
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

                console.info('-- loading succes');
            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                AssetGraphic.addObject(pTask.loadedMeshes[i].name, pTask.loadedMeshes[i], pTask.loadedSkeletons[i], pTask.loadedParticleSystems[i]);
            }
        }

        function onLevelMeshSuccess(pTask:BABYLON.MeshAssetTask): void {
            console.info('-- loading level succes');
            self.initLevel(pTask.loadedMeshes as BABYLON.Mesh[]);
        }

        loader.onFinish = pCallback;

        loader.useDefaultLoadingScreen = false; // FIXME : Path loading screen
        loader.load();
            console.info('-- loading');
    }


}
