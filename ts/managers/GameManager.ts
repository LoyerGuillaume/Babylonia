class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;

    // GAME RULES
    private enemyManager: EnemyManager;

    private onPause:boolean = false;
    private oldPausePress:boolean = false;
    private frameCount:number = 0;

    private static get RESPAWN_SECONDS() { return 3;};

	constructor(pScene, pEngine, pLevelManager) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = pLevelManager;
    }

    public destroy () {
        // TODO
    }

    public start () {
        var that = this;

        this.initPlayer(0);
        this.initEnemyManager();

        BEvent.on(PlayerEvent.DEATH, this.onPlayerDeath, this);

        this.gameLoop();
    }

    private initEnemyManager () {
        this.enemyManager = new EnemyManager(this.mainScene);
        var lWavesDesc = Babylonia.getLoadedContent('waves');
        this.enemyManager.setWavesDescription( JSON.parse(lWavesDesc) );
    }

    private onPlayerDeath (pEvent:PlayerEvent) {
        var playerIndex = pEvent.player.getPlayerIndex();

        pEvent.player.destroy();
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
                that.initPlayer(playerIndex);
                if (playerRemaining === 0) {
                    that.onGameOver();
                }
            }
        }, 1000);


    }

    private onGameOver () {
        this.destroyAllEnemies();
    }


    private initPlayer(indexPlayer) {
        var lPos = this.levelManager.getGameplayObjectUnique('Spawner').mesh.position.clone();
        lPos.y += 150;
        Player.list[indexPlayer] = new Player(this.mainScene, lPos);
        Player.list[indexPlayer].start();
        CameraManager.setTarget(Player.list[indexPlayer]);
        UIManager.gainLife(Player.LIFE_POINT);
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

            for (var m in Coin.list) {
                Coin.list[m].doAction(deltaTime);
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
