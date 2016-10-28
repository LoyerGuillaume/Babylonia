class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;
    private shopManager: ShopManager;
    private lightManager:LightManager;

    private enemyManager: EnemyManager;

    private onPause:boolean = false;
    private oldPausePress:boolean = false;
    private frameCount:number = 0;
    private bridgePosInit:BABYLON.Vector3;

    // GAME RULES
    private static get RESPAWN_SECONDS() { return 3;};
    private static get WAVES_INTERVAL_MS() { return 5000;};
    private static get WAVES_SANDBOX_NAME() { return 'SANDBOX';};

    // GAME VARS
    private currentWaveNumber: number;

	constructor(pScene, pEngine, pLevelManager) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = pLevelManager;

        // GAME VARS
        this.currentWaveNumber = 1;
    }

    public destroy () {
        // TODO
    }

    public start () {
        var that = this;

        this.lightManager = new LightManager(this.mainScene);

        this.shopManager = new ShopManager(this.mainScene, this.levelManager);

        this.initPlayer(0);

        this.initEnemyManager();

        // events
        BEvent.on(PlayerEvent.DEATH, this.onPlayerDeath, this);
        BEvent.on(PlayerEvent.READY_TO_FIGHT, this.onPlayerInArena, this);
        BEvent.on(EnemyManager.ON_WAVE_END, this.onEnemyWaveEnd, this);

        // var enemy = new EnemyOne(new BABYLON.Vector3(3, 1, 3), this.mainScene);
        // enemy.start();

        this.gameLoop();
    }

    private onEnemyWaveEnd (pEvent) {

        console.info('vague vaincu !');

        if (this.enemyManager.waveExists(this.currentWaveNumber + 1)) {
            new Timeout(this.enemyManager.startWave.bind(this.enemyManager, ++this.currentWaveNumber), GameManager.WAVES_INTERVAL_MS);
        } else {
             this.onLastWaveWon();
        }
    }

    private onLastWaveWon () {
        new Timeout(this.enemyManager.startWave.bind(this.enemyManager, GameManager.WAVES_SANDBOX_NAME), GameManager.WAVES_INTERVAL_MS);
    }

    private initEnemyManager () {
        this.enemyManager = new EnemyManager(this.mainScene, this.levelManager);
        var lWavesDesc = Babylonia.getLoadedContent('waves', true);
        this.enemyManager.setWavesDescription( JSON.parse(lWavesDesc) );
    }

    private onPlayerDeath (pPlayerEvent:any) {
        var playerIndex = pPlayerEvent.player.getPlayerIndex();

        var lProfile   = pPlayerEvent.player.profile;

        pPlayerEvent.player.destroy();
        Player.list.splice(playerIndex, 1);

        var playerRemaining = Player.list.length;

        var that = this;
        var secondsRemaining = GameManager.RESPAWN_SECONDS;
        UIManager.displayMessage('Player ' + (playerIndex + 1) + ' : Vous êtes mort, respawn dans ' + secondsRemaining);
        var interval = setInterval(function () {
            secondsRemaining--;
            UIManager.displayMessage('Player ' + (playerIndex + 1) + ' : Vous êtes mort, respawn dans ' + secondsRemaining);
            if (secondsRemaining === 0) {
                UIManager.removeMessage();
                clearTimeout(interval);
                that.initPlayer(playerIndex, lProfile);
                if (playerRemaining === 0) {
                    that.onGameOver();
                }
            }
        }, 1000);

    }

    private onGameOver () {
        this.enemyManager.clearCurrentWave();
        this.destroyAllEnemies();
        this.moveBridge(true);
    }


    private initPlayer(indexPlayer, pProfile:IPlayerProfile = undefined) {
        var lPos = this.levelManager.getGameplayObjectUnique('Spawner').mesh.position.clone();
        lPos.y += 0.6;

        var lGameDeclencher = this.levelManager.getGameplayPositionUnique('GameDeclencher');
        var lArenaLimit = this.levelManager.getGameplayPositionUnique('LimiteArena');

        Player.list[indexPlayer] = new Player(this.mainScene, lPos, lArenaLimit, lGameDeclencher, pProfile);
        Player.list[indexPlayer].start();
        CameraManager.setTarget(Player.list[indexPlayer]);
        BEvent.emit(new PlayerEvent(PlayerEvent.GAIN_LIFE, {
            amount: Player.LIFE_POINT
        }));
    }

    private onPlayerInArena (pPlayerEvent:any) {
        // start game
        this.currentWaveNumber = 1;
        this.enemyManager.startWave(this.currentWaveNumber);

        this.moveBridge(false);
    }

    private moveBridge (pWalkable:boolean) {

        var lBridge = this.levelManager.getGameplayObjectUnique('Bridge');

        if (!this.bridgePosInit) {
            this.bridgePosInit = lBridge.mesh.position.clone();
        }

        if (pWalkable) {
            lBridge.mesh.position.x = this.bridgePosInit.x;
        } else {
            lBridge.mesh.position.x = this.bridgePosInit.x - 3;
        }
    }

    private checkController() {
        for (var l in Player.list) {
            if (Player.list[l].controller.pause != this.oldPausePress) {
                this.oldPausePress = Player.list[l].controller.pause;
                if (Player.list[l].controller.pause) {
                    this.onPause = !this.onPause;
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

            var deltaTime:number = this.engine.getDeltaTime();

            for (var q = Timeout.list.length - 1; q >= 0; q--) {
                Timeout.list[q].doAction(deltaTime);
            }

            for (var i in Tree.list) {
                Tree.list[i].doAction(deltaTime);
            }

            for (var j in PlayerAttack.list) {
                PlayerAttack.list[j].doAction(deltaTime);
            }

            for (var k in Enemy.list) {
                Enemy.list[k].doAction(deltaTime);
            }

            for (var l in Player.list) {
                Player.list[l].doAction(deltaTime);
            }

            for (var m in Coin.list) {
                Coin.list[m].doAction(deltaTime);
            }

            for (var n in ItemShop.list) {
                ItemShop.list[n].doAction(deltaTime);
            }

            CameraManager.updatePosition();

            if (this.frameCount % 2) {
                this.mainScene.render();
            }

            this.frameCount++;
        });
    }

    private destroyAllEnemies () {
        var enemyLength = Enemy.list.length;
        for (var i = enemyLength - 1; i >= 0; i--) {
            Enemy.list[i].destroy();
        }
    }

}
