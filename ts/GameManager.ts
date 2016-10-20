class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
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


    constructor(pScene, pEngine) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = new LevelManager(pScene);

        this.mainScene.collisionsEnabled = true;
    }


    public start() {
        this.initCamera();

        var loadedCount = 3;
        var loadedCounter = 0;

        var self:GameManager = this;
        function onAssetLoaded () {
            if (++loadedCounter >= loadedCount) self.startGame();
        }

        this.loadAssets(GameManager.ASSETS_NAME, true, onAssetLoaded);
        this.loadAssets(GameManager.LEVELS_NAME, false, onAssetLoaded);
        HUDManager.loadTextures(this.mainScene, onAssetLoaded);
    }

    public startGame () {
        HUDManager.initHud(this.mainScene);
        this.initPlayer(0);

        new EnemySpawner('EnemyOne', this.mainScene);

        BEvent.on(PlayerEvent.DEATH, this.onPlayerDeath, this);

        this.gameLoop();
    }


    private onPlayerDeath (pEvent:PlayerEvent) {
        var playerIndex = pEvent.player.getPlayerIndex();
        pEvent.player.destroy();
        Player.list.splice(playerIndex, 1);

        console.log(Player.list.length);
        if (Player.list.length === 0) {
            //GameOver
            this.destroyAllEnemies();
        }

        this.initPlayer(playerIndex);
    }


    private initPlayer(indexPlayer) {
        var lPos = this.levelManager.getGameplayObjectUnique('Spawner').mesh.position.clone();
        console.warn('init player ', lPos);
        lPos.y += 150;
        Player.list[indexPlayer] = new Player(this.mainScene, lPos);
        Player.list[indexPlayer].start();
        CameraManager.setTarget(Player.list[indexPlayer]);
        HUDManager.gainLife(Player.LIFE_POINT);
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


    private checkController() {
        for (var l in Player.list) {
            if (Player.list[l].controller.pause != this.oldPausePress) {
                this.oldPausePress = Player.list[l].controller.pause;
                if (Player.list[l].controller.pause) {
                    this.onPause       = !this.onPause;
                    if (this.onPause) {
                         this.engine.stopRenderLoop();
                         this.pauseGameLoop();
                    } else {
                        this.engine.stopRenderLoop();
                        this.gameLoop();
                    }
                }
            }
        }
    }

    private pauseGameLoop () {
        this.engine.runRenderLoop(() => {
            this.checkController();
        });

    }


    private gameLoop () {
        this.engine.runRenderLoop(() => {
            this.checkController();

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


    private destroyAllEnemies () {
        var enemyLength = Enemy.list.length;
        for (var i = enemyLength - 1; i >= 0; i--) {
            Enemy.list[i].destroy();
        }
    }

}
