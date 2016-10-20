class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;
    private levelManager: LevelManager;

    private onPause:boolean = false;
    private oldPausePress:boolean = false;

    private playerOne:Player;

    constructor(pScene, pEngine, pLevelManager) {
        this.mainScene = pScene;
        this.engine = pEngine;
        this.levelManager = pLevelManager;
    }

    public destroy () {
        // TODO
    }

    public start () {

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
        lPos.y += 150;
        Player.list[indexPlayer] = new Player(this.mainScene, lPos);
        Player.list[indexPlayer].start();
        CameraManager.setTarget(Player.list[indexPlayer]);
        HUDManager.gainLife(Player.LIFE_POINT);
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
