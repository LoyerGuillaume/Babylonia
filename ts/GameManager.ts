class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;

    private playerOne:Player;

    private static get ASSETS_NAME() { return [
        'elf'
    ];};

    private static get LEVELS_NAME() { return [
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

        var loadedCount = 2;
        var loadedCounter = 0;

        var self:GameManager = this;
        function onAssetLoaded () {
            if (++loadedCounter >= loadedCount) self.startGame();
        }

        this.loadAssets(GameManager.ASSETS_NAME, true, onAssetLoaded);
        this.loadAssets(GameManager.LEVELS_NAME, false, onAssetLoaded);
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
        this.playerOne.position.y = 120;
        this.playerOne.start();
        CameraManager.setTarget(this.playerOne);
    }


    private initLevel() {
        this.levelManager.build();
    }


    private initCamera() {
        CameraManager.init(this.mainScene, this.engine);
    }


    private loadAssets(pSources:string[], pInstantiable:boolean, pCallback) {

        var loader = new BABYLON.AssetsManager(this.mainScene);

        var assetIndex;
        for (assetIndex in pSources) {

            var assetName: string = pSources[assetIndex];
            var meshTask = loader.addMeshTask(assetName, '', Config.ASSET_PATH, assetName + '.babylon');

            meshTask.onSuccess = (pInstantiable) ? onSuccess : onLevelMeshSuccess;
        }

        function onSuccess(pTask:BABYLON.MeshAssetTask): void {

            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                AssetGraphic.addObject(pTask.loadedMeshes[i].name, pTask.loadedMeshes[i], pTask.loadedSkeletons[i], pTask.loadedParticleSystems[i]);
            }
        }

        function onLevelMeshSuccess(pTask:BABYLON.MeshAssetTask): void {

            console.log(pTask);

            var lElems:BABYLON.AbstractMesh[] = [];

            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                if (pTask.loadedMeshes[i].name == 'BOX') {
                    CollisionBoxCreator.addBox(pTask.loadedMeshes[i] as BABYLON.Mesh);
                } else {
                    lElems.push(pTask.loadedMeshes[i]);
                }
            }

            lLen = lElems.length;
            for (var i = 0; i < lLen; i++) {
                new LDElement(pTask.loadedMeshes[i] as BABYLON.Mesh);
            }

        }

        loader.onFinish = pCallback;

        loader.useDefaultLoadingScreen = false; // FIXME : Path loading screen
        loader.load();
    }


    private gameLoop () {
        this.engine.runRenderLoop(() => {
            this.mainScene.render();

            var deltaTime:number = this.engine.getDeltaTime();

            for (var i in Tree.list) {
                Tree.list[i].doAction(deltaTime);
            }

            for (var j in FireBall.list) {
                FireBall.list[j].doAction(deltaTime);
            }

            for (var k in Enemy.list) {
                Enemy.list[k].doAction(deltaTime);
            }
            this.playerOne.doAction(deltaTime);
            CameraManager.updatePosition();

        });
    }

}
