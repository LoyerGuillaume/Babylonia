class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;

    private playerOne:Player;

    private static get ASSETS_NAME() { return [
        'elf',
        'Base'
    ];};


    constructor(pScene, pEngine) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);

        this.mainScene.collisionsEnabled = true;
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

        //
        // var box = BABYLON.Mesh.CreateBox("crate", 2, this.mainScene);
        // box.position = new BABYLON.Vector3(-50, 0, 0);
        // box.checkCollisions = true;
        //
        // box.scaling.x = 100;
        // box.scaling.y = 100;
        // box.scaling.z = 100;

        // Tools.displayEllipsoid(this.mainScene, box);

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

            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                AssetGraphic.addObject(pTask.loadedMeshes[i].name, pTask.loadedMeshes[i], pTask.loadedSkeletons[i], pTask.loadedParticleSystems[i]);
            }
        }

        loader.onFinish = pCallback;

        loader.useDefaultLoadingScreen = false; // FIXME : Path loading screen
        loader.load();
    }


    private gameLoop () {
        this.engine.runRenderLoop(() => {
            this.mainScene.render();

            for (var i in Tree.list) {
                Tree.list[i].doAction();
            }

            for (var j in FireBall.list) {
                FireBall.list[j].doAction();
            }

            for (var k in Enemy.list) {
                Enemy.list[k].doAction();
            }

            this.playerOne.doAction();
            CameraManager.updatePosition();

        });
    }

}
