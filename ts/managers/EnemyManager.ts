class EnemyManager {

    private waves: any;

    private currentWaveNumber: number;

    //////////////

    private static get SPAWN_INTERVAL():number { return 3000; };
    private static get SPAWN_NUMBER():number { return 5; };

    private interval:number;
    private enemySpawned:number = 0;

    private scene:BABYLON.Scene;

    private enemyConstructors: {};

    private positionsGrouped:BABYLON.Vector3[][];
    private allPositions:BABYLON.Vector3[];

    // difficulty system
    private baseEnemyCount:number;
    private baseEnemyIndex:number;

    private enemies:string[];
    private enemyDiversityCount:number;

    public currentDifficulty:number;

    /**
     * @params pScene
     * @params pPositions
     * @params pEnemyClasses
     * @params pBaseEnemyIndex Sélectionne les enemis de `pEnemyClasses` pour la base de la difficultéde. Sélectionne les enemis de l'index 0 jusqu'à celui donné (ex pour 2: 0, 1 et 2)
     * @params pBaseEnemyCount Nombre d'enemi utiliser comme base pour la difficulté
     */
    constructor(pScene:BABYLON.Scene) {

        this.scene = pScene;

        this.currentWaveNumber = 0;

        // set constructors
        //this.enemyConstructors = [];
        //for (var i = 0; i < this.enemyDiversityCount; i++) {
        //    this.enemyConstructors[pEnemyClasses[i]] = Type.getConstructorByName(pEnemyClasses[i]);
        //}
    }

    public setWavesDescription (pJson:any) {
        this.waves = pJson;
    }

    private getSituationsFromWave (pWave:any): any[] {
        return pWave.situations;
    }

    public startSpecialWave (pWaveName:string) {

        var lSituations = this.getSituationsFromWave(this.waves[pWaveName]);
        var lSituation = this.getRandomElementFromArray(lSituations);

        var lEnemyStack = this.getStackFromSituation(lSituation);
    }

    /**
     * start at 0
     */
    public startWave (pWave:number = undefined) {
        this.currentWaveNumber = pWave || this.currentWaveNumber + 1;
        this.startSpecialWave(this.currentWaveNumber.toString());
    }

    public spawnEnemy (pEnemy:string, pPos: BABYLON.Vector3) {
        pPos = pPos.add(new BABYLON.Vector3(0, 100, 0)); // FIXME
        var lEnemy = new this.enemyConstructors[pEnemy](pPos, this.scene);
        lEnemy.start();
    }

    public destroy () {
        clearInterval(this.interval);
    }

    private getRandomElementFromArray (pArray:any[]) {
        return Math.floor(Math.random() * pArray.length);
    }

    private getStackFromSituation (pSituation:any) {

        var lEnemyStack = pSituation.enemies.slice(0);

        // add delay

        pSituation.foreachDelay = pSituation.foreachDelay || 0;

        var lEnemyCount = lEnemyStack.length;
        for ( var i = 0; i < lEnemyCount; i++) {
            lEnemyStack[i].delay = lEnemyStack[i].delay || 0;
            lEnemyStack[i].delay += pSituation.foreachDelay * i;
        }

        // stack order

        lEnemyStack.sort(this.delaySortting);
    }

    private delaySortting (pEnemyA:any, pEnemyB:any) {
        if (pEnemyA.delay < pEnemyB.delay) return -1;
        else if (pEnemyA.delay > pEnemyB.delay) return 1;
        else return 0;
    }

}
