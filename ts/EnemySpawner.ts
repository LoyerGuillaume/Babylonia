class EnemySpawner {

    private static get SPAWN_INTERVAL():number { return 3000; };
    private static get SPAWN_NUMBER():number { return 5; };

    private interval:number;
    private enemySpawned:number = 0;

    private scene:BABYLON.Scene;

    private enemyConstructors: {};

    private positions:BABYLON.Vector3[];

    // difficulty system
    private baseEnemyCount:number;
    private baseEnemyIndex:number;

    private enemyDiversityCount:number;

    public currentDifficulty:number;

    /**
     * @params pScene
     * @params pPositions
     * @params pEnemyClasses
     * @params pBaseEnemyIndex Sélectionne les enemis de `pEnemyClasses` pour la base de la difficultéde. Sélectionne les enemis de l'index 0 jusqu'à celui donné (ex pour 2: 0, 1 et 2)
     * @params pBaseEnemyCount Nombre d'enemi utiliser comme base pour la difficulté
     */
    constructor(pScene:BABYLON.Scene, pEnemyClasses:string[], pPositions:BABYLON.Vector3[], pBaseEnemyCount:number, pBaseEnemyIndex:number) {

        this.scene = pScene;
        this.positions = pPositions;

        // difficulty system
        this.baseEnemyCount = Math.ceil(pBaseEnemyCount);
        this.baseEnemyIndex = Math.ceil(pBaseEnemyIndex);

        this.enemyDiversityCount = pEnemyClasses.length;

        // set constructors
        this.enemyConstructors = [];
        for (var i = 0; i < this.enemyDiversityCount; i++) {
            this.enemyConstructors[pEnemyClasses[i]] = Type.getConstructorByName(pEnemyClasses[i]);
        }

    }

    /**
     * start at 0
     */
    public startWave (pDifficulty:number = undefined) {

        this.currentDifficulty = pDifficulty || this.currentDifficulty + 1;

        var lEnemiesSelected = {};

        // choose count
        var lEnemyWaveCount = this.chooseEnemyCount(this.currentDifficulty);

        // choose enemies
        var lDiversityCount = this.chooseEnemyCountByEnemyType(lEnemyWaveCount, this.baseEnemyIndex); // FIXME : rise this.baseEnemyIndex with difficulty level

        // TODO : choose positions

        // start
        var lEnemyTypes = Object.keys(lDiversityCount);
        var lLen = lEnemyTypes.length;
        for (var i = 0; i < lLen; i++) {
            var lEnemyType = lEnemyTypes[i];
            var lEnemyCount = lDiversityCount[lEnemyType];
            this.spawnEnemies(lEnemyType, lEnemyCount);
        }

    }

    private spawnEnemies (pEnemyTypeIndex, pCount) {
/*
        //FIX : position
        var enemyPosition = this.position.clone();
        enemyPosition = enemyPosition.add(new BABYLON.Vector3(0, 100, 0));
        var enemy = new this.enemyConstructor(enemyPosition, this.scene);
        enemy.start();*/
    }

    private chooseEnemyCount (pDifficulty:number) {
        var lEnemyWaveCount = Math.ceil(this.baseEnemyCount + Math.LN2 * pDifficulty * 2);
        lEnemyWaveCount += Math.ceil( Math.abs(Math.random() - Math.random()) * pDifficulty); // rand +/-
        return lEnemyWaveCount;
    }

    // nombre d'enemy => index du type d'ennemi
    private chooseEnemyCountByEnemyType (pEnemyCount:number, pEnemyDiversity:number) {
        var lSelectionByEnemyIndex = {};
        for (var i = 0; i < pEnemyCount; i++) {
            var lEnemyTypeIndex = Math.floor(Math.random() * (pEnemyDiversity+1));

            if (!lSelectionByEnemyIndex[lEnemyTypeIndex]) {
                lSelectionByEnemyIndex[lEnemyTypeIndex] = 0;
            }

            lSelectionByEnemyIndex[lEnemyTypeIndex]++;
        }
        return lSelectionByEnemyIndex;
    }

    public destroy () {
        clearInterval(this.interval);
    }

}
