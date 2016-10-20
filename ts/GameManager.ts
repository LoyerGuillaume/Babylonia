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
        this.initPlayer();

        HUDManager.initHud(this.mainScene);
        new EnemySpawner('EnemyOne', this.mainScene);

        BEvent.on(PlayerEvent.DEATH, this.onPlayerDeath, this);

        this.gameLoop();
    }


    private onPlayerDeath (pEvent:PlayerEvent) {
        pEvent.player.destroy();
        //pPlayer.destroy();
        this.initPlayer();
    }


    private initPlayer() {
        var lPos = this.levelManager.getSpwanerPosition();
        lPos.y += 120;
        this.playerOne = new Player(this.mainScene, lPos);
        this.playerOne.start();
        CameraManager.setTarget(this.playerOne);
    }


    private initLevel(pMeshes:BABYLON.Mesh[]) {
        this.levelManager.build(pMeshes);
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

            meshTask.onSuccess = (pInstantiable) ? onSuccess.bind(this) : onLevelMeshSuccess.bind(this);
        }

        function onSuccess(pTask:BABYLON.MeshAssetTask): void {

            var lLen = pTask.loadedMeshes.length;
            for (var i = 0; i < lLen; i++) {
                AssetGraphic.addObject(pTask.loadedMeshes[i].name, pTask.loadedMeshes[i], pTask.loadedSkeletons[i], pTask.loadedParticleSystems[i]);
            }
        }

        function onLevelMeshSuccess(pTask:BABYLON.MeshAssetTask): void {
            this.initLevel(pTask.loadedMeshes as BABYLON.Mesh[]);
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
