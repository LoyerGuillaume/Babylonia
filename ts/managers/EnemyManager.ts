class EnemyManager {

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
    constructor(pScene:BABYLON.Scene, pEnemyClasses:string[], pBaseEnemyCount:number, pBaseEnemyIndex:number) {

        this.scene = pScene;

        this.positionsGrouped = [];
        this.allPositions     = [];

        // difficulty system
        this.currentDifficulty = 0;
        this.baseEnemyCount = Math.ceil(pBaseEnemyCount);
        this.baseEnemyIndex = Math.ceil(pBaseEnemyIndex);

        this.enemies             = pEnemyClasses;
        this.enemyDiversityCount = pEnemyClasses.length;

        // set constructors
        this.enemyConstructors = [];
        for (var i = 0; i < this.enemyDiversityCount; i++) {
            this.enemyConstructors[pEnemyClasses[i]] = Type.getConstructorByName(pEnemyClasses[i]);
        }
    }

    public addPositionsGroup (pLocations: (LDElement[]|BABYLON.Vector3[]) ) {

        if ((pLocations[0] as BABYLON.Vector3).x) {
            this._addPositionsGrouped(pLocations as BABYLON.Vector3[]);
        } else {

            var lPositions:BABYLON.Vector3[] = [];

            var lLen:number = pLocations.length;
            for (var i = 0; i < lLen; i++) {
                lPositions.push((pLocations[i] as LDElement).mesh.position);
            }

            this._addPositionsGrouped(lPositions);
        }
    }

    private _addPositionsGrouped (pPositions: BABYLON.Vector3[]) {
        this.positionsGrouped.push(pPositions);
        this.allPositions = this.allPositions.concat(pPositions);
    }

    /**
     * start at 0
     */
    public startWave (pDifficulty:number = undefined) {

        console.log('start wave');

        this.currentDifficulty = pDifficulty || this.currentDifficulty + 1;

        var lEnemiesSelected = {};

        // choose count
        var lEnemyWaveCount = this.chooseEnemyCount(this.currentDifficulty);

        // choose enemies
        var lDiversityCount = this.chooseEnemyCountByEnemyType(lEnemyWaveCount, this.baseEnemyIndex); // FIXME : rise this.baseEnemyIndex with difficulty level


        // TODO : choose positions

        console.info(this.allPositions);

        // start
        var lEnemyTypes = Object.keys(lDiversityCount);
        var lLen = lEnemyTypes.length;
        console.info('enemy selected count:', lLen);
        for (var i = 0; i < lLen; i++) {
            var lEnemyType = lEnemyTypes[i];
            var lEnemyCount = lDiversityCount[lEnemyType];
            this.spawnEnemies(lEnemyType, lEnemyCount);
        }

    }

    private spawnEnemies (pEnemyTypeIndex, pCount) {


        console.info('Spawn '+pCount+' enemies of type: '+pEnemyTypeIndex);

        var lPositionsSelected = this.allPositions.slice(0);
        var lPosCount = lPositionsSelected.length;

        for (var i = 0; i < pCount; i++) {
            var lPosIndex = Math.floor(Math.random() * lPosCount--);
            var lPos:BABYLON.Vector3 = lPositionsSelected.splice(lPosIndex, 1)[0];

            this.spawnEnemy(this.enemies[pEnemyTypeIndex], lPos);
        }

        //FIX : position

    }

    public spawnEnemy (pEnemy:string, pPos: BABYLON.Vector3) {

        console.info('Spawn of: '+pEnemy, pPos);

        pPos = pPos.add(new BABYLON.Vector3(0, 100, 0)); // FIXME

        var lEnemy = new this.enemyConstructors[pEnemy](pPos, this.scene);
        lEnemy.start();
    }

    private chooseEnemyCount (pDifficulty:number) {
        var lEnemyWaveCount = Math.ceil(this.baseEnemyCount + Math.LN2 * pDifficulty * 2);
        lEnemyWaveCount += Math.ceil( Math.abs(Math.random() - Math.random()) * pDifficulty); // rand +/-
        return lEnemyWaveCount;
    }

    // nombre d'enemy => index du type d'ennemi
    private chooseEnemyCountByEnemyType (pEnemyCount:number, pEnemyDiversity:number) {
        console.warn('chooseEnemyCountByEnemyType', pEnemyCount, pEnemyDiversity);
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
