class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;

    private playerOne:Player;

    private static get ASSETS_NAME() { return ['elf'];};


    constructor(pScene, pEngine) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);
    }


    public start() {
        this.loadAssets(this.startGame.bind(this));
    }

    public startGame () {

        this.initLevel();
        this.initPlayer();
        this.initCamera();

        this.gameLoop();
    }


    private initPlayer() {
        this.playerOne = new Player();
    }


    private initLevel() {
        this.levelManager.build();
    }


    private initCamera() {
        new CameraManager(this.mainScene, this.engine);
    }


    private loadAssets(pCallback) {

        var loader = new BABYLON.AssetsManager(this.mainScene);

        var assetIndex;

        for (assetIndex in GameManager.ASSETS_NAME) {
            var assetName: string = GameManager.ASSETS_NAME[assetIndex];

            var meshTask = loader.addMeshTask(assetName, assetName, Config.ASSET_PATH, assetName + '.babylon');
            meshTask.onSuccess = onSuccess.bind(this, assetName);
        }

        function onSuccess(pAssetName, pTask): void {
            AssetGraphic.addObject(pAssetName, pTask.loadedMeshes, pTask.loadedSkeletons, pTask.loadedParticleSystems);

            // var skeletons = task.loadedSkeletons;

            // skeletons.forEach(function(s) {
            //     pScene.beginAnimation(s, 0, 100, true);
            // });
        }


        loader.onFinish = pCallback;

        loader.useDefaultLoadingScreen = false; // FIXME : Path loading screen
        loader.load();
    }


    private gameLoop () {
        this.engine.runRenderLoop(() => {
            this.mainScene.render();
        });
    }

}
