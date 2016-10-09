class EnemySpawner {

    private static get SPAWN_INTERVAL():number { return 3000; };
    private static get SPAWN_NUMBER():number { return 5; };

    private interval:number;
    private enemySpawned:number = 0;

    private scene:BABYLON.Scene;
    private enemyConstructor:any;

    private position:BABYLON.Vector3;

    constructor(pEnemyClassName:string, pScene:BABYLON.Scene, pPosition:BABYLON.Vector3 = BABYLON.Vector3.Zero()) {
        this.enemyConstructor = Type.getConstructorByName(pEnemyClassName);
        this.scene = pScene;
        this.position = pPosition;

        var that = this;
        this.interval = setInterval(function () {
            that.spawnEnemy();
        }, EnemySpawner.SPAWN_INTERVAL);
    }

    private spawnEnemy () {
        if (++this.enemySpawned >= EnemySpawner.SPAWN_NUMBER) {
            this.destroy();
        }
        var enemy = new this.enemyConstructor(this.position.clone(), this.scene);
        enemy.start();
    }

    public destroy () {
        clearInterval(this.interval);
    }

}
