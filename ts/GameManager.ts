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
        this.initCamera();
        this.loadAssets(this.startGame.bind(this));
    }

    public startGame () {
        this.initLevel();
        this.initPlayer();

        var enemy = new EnemyOne(new BABYLON.Vector3(500, 0, 500), this.mainScene);
        enemy.start();

        this.gameLoop();
    }


    private initPlayer() {
        this.playerOne = new Player(this.mainScene);
        this.playerOne.start();
        CameraManager.setTarget(this.playerOne);
    }


    private initLevel() {
        this.levelManager.build();
    }


    private initCamera() {
        CameraManager.init(this.mainScene, this.engine);
    }


    private loadAssets(pCallback) {

        var loader = new BABYLON.AssetsManager(this.mainScene);

        var assetIndex;
        for (assetIndex in GameManager.ASSETS_NAME) {
            var assetName: string = GameManager.ASSETS_NAME[assetIndex];

            var meshTask = loader.addMeshTask(assetName, '', Config.ASSET_PATH, assetName + '.babylon');
            meshTask.onSuccess = onSuccess;
        }

        function onSuccess(pTask:BABYLON.MeshAssetTask): void {
            AssetGraphic.addObject(pTask.name, pTask.loadedMeshes, pTask.loadedSkeletons, pTask.loadedParticleSystems);
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

            for (var i = 0; i < Tree.list.length; i++) {
                Tree.list[i].doAction();
            }

            var fireBallLength = FireBall.list.length;
            for (var k = 0; k < fireBallLength; k++) {
                FireBall.list[k].doAction();
            }

            for (var j = 0; j < Enemy.list.length; j++) {
                Enemy.list[j].doAction();
            }

            this.playerOne.doAction();
            CameraManager.updatePosition();

        });
    }

}
