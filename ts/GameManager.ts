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
        this.initPlayer(0);

        new EnemySpawner('EnemyOne', this.mainScene);

        BEvent.on(PlayerEvent.DEATH, this.onPlayerDeath, this);

        this.gameLoop();
    }


    private onPlayerDeath (pEvent:PlayerEvent) {
        var playerIndex = pEvent.player.getPlayerIndex();
        console.log('playerIndex : ' + playerIndex);
        pEvent.player.destroy();
        // Player.list[playerIndex] = null;
        //pPlayer.destroy();
        console.log('Before : ' + Player.list.length);
        Player.list.splice(playerIndex, 1);
        console.log('After : ' + Player.list.length);
        this.initPlayer(playerIndex);
    }


    private initPlayer(indexPlayer) {
        var lPos = this.levelManager.getSpwanerPosition();
        lPos.y += 250;
        Player.list[indexPlayer] = new Player(this.mainScene, lPos);
        Player.list[indexPlayer].start();
        CameraManager.setTarget(Player.list[indexPlayer]);
    }


    private initLevel(pMeshes:BABYLON.Mesh[]) {
        this.levelManager.build(pMeshes);
    }

    private initCamera() {
        CameraManager.init(this.mainScene, this.engine);
    }


    private loadAssets(pSources:string[], pInstantiable:boolean, pCallback) {

        var self:GameManager = this;
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

            for (var l in Player.list) {
                Player.list[l].doAction(deltaTime);
            }

            CameraManager.updatePosition();

        });
    }

}
