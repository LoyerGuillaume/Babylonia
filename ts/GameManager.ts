class GameManager {

    private mainScene:BABYLON.Scene;
    private engine:BABYLON.Engine;

    private playerOne:Player;

    private static get ASSETS_NAME() { return ['elf'];};



    constructor(pScene, pEngine) {
        this.mainScene = pScene;
        this.engine = pEngine;
    }


    public start () {
        console.log('Start Game');
        this.loadAssets();
        this.initPlayer();
    }


    private initPlayer () {
        this.playerOne = new Player();
    }


    private loadAssets () {
        var loader = new BABYLON.AssetsManager(this.mainScene);

        var assetIndex;
        console.log(GameManager.ASSETS_NAME);
        for (assetIndex in GameManager.ASSETS_NAME) {
            var assetName:string = GameManager.ASSETS_NAME[assetIndex];
            var meshTask = loader.addMeshTask(assetName, '', Config.ASSET_PATH, assetName + '.babylon');
        }


        // Fonction appelée quand le chargement de l’objet est terminé

        // var that = this;
        meshTask.onSuccess = (task) => {
            // var skeletons = task.loadedSkeletons;


            // skeletons.forEach(function(s) {
            //     pScene.beginAnimation(s, 0, 100, true);
            // });
        };

        loader.onFinish = (tasks) => {
            this.gameLoop();
        };

        loader.load(); // Démarre le chargement
    }


    private gameLoop () {
        this.engine.runRenderLoop(() => {
            this.mainScene.render();
        });
    }

}
