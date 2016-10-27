class EnemyManager {

    public static ON_WAVE_END: string = 'ONWAVEEND';

    private canceled:boolean;

    /**
     * @params pScene
     * @params pPositions
     * @params pEnemyClasses
     * @params pBaseEnemyIndex Sélectionne les enemis de `pEnemyClasses` pour la base de la difficultéde. Sélectionne les enemis de l'index 0 jusqu'à celui donné (ex pour 2: 0, 1 et 2)
     * @params pBaseEnemyCount Nombre d'enemi utiliser comme base pour la difficulté
     */
    constructor(pScene:BABYLON.Scene, pLevelManager:LevelManager) {

        this.scene = pScene;
        this.levelManager = pLevelManager;

        this.currentWaveNumber = 0;
        this.canceled = false;

        this.enemyStack = [];
        this.isStackPlaying = false;

        // set constructors
        this.enemyConstructors = {};

    }

    public destroy () {
        this.enemyStack = [];
        this.enemyConstructors = {};
        this.waves = undefined;
    }

    public setWavesDescription (pJson:any) {
        this.reset();
        this.waves = pJson;
    }

    public getCurrentWaveNumber (): number {
        return this.currentWaveNumber;
    }

    public startWave (pWaveName:string|number) {
        if (this.waveExists(pWaveName)) {
            BEvent.once( EnemyEvent.ALL_DEAD, this.onEnemiesDead, this );
            this._startWave(pWaveName);
        } else {
            console.warn('The wave named "'+pWaveName+'" does not exists.');
        }
    }

    public clearCurrentWave () {
        this.canceled = true;
        this.reset();
        this.enemyStack = [];
        this.isStackPlaying = false;
    }

    public waveExists (pWaveName:string|number): boolean {
        return this.waves[pWaveName] != undefined;
    }

    public spawnEnemy (pEnemy:string, pPos: BABYLON.Vector3) {

        if ( !this.enemyConstructors[pEnemy] ) {
            this.enemyConstructors[pEnemy] = Type.getConstructorByName(pEnemy);
        }

        pPos = pPos.add(new BABYLON.Vector3(0, .5, 0)); // FIXME

        var lEnemy = new this.enemyConstructors[pEnemy](pPos, this.scene);
        lEnemy.start();
    }


    // PRIVATE OPERATIONS

    private static NEXT_SITUATION_KEY: string = 'nextSituation';

    private scene: BABYLON.Scene;
    private levelManager: LevelManager;

    private waves: any;

    private enemyStack:any[];
    private currentStackStep: any;
    private isStackPlaying: boolean;
    private currentTimeout: Timeout;

    private currentWaveNumber: number;

    private enemyConstructors: {};

    private _startWave (pWaveName:string|number) {

        this.canceled = false;

        var lSituations = this.getSituationsFromWave(this.waves[pWaveName]);

        var lSIndex = this.getRandomIndexFromArray(lSituations);
        var lSituation = lSituations[lSIndex];

        this.fillStackRecursively( lSituation );

        if (!this.isStackPlaying) {
            this.playCurrentStack();
        }
    }

    private fillStackRecursively (pSituation: any) {
        this.enemyStack = this.enemyStack.concat( this.getStackFromSituation( pSituation ) );

        if (pSituation.nextSituation) {
            this.enemyStack.push( EnemyManager.NEXT_SITUATION_KEY );
            this.fillStackRecursively( pSituation.nextSituation );
        }
    }

    private getRandomIndexFromArray (pArray:any[]) {
        return Math.floor(Math.random() * pArray.length);
    }

    private getStackFromSituation (pSituation:any):any[] {

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

        return lEnemyStack;
    }

    private delaySortting (pEnemyA:any, pEnemyB:any) {
        if (pEnemyA.delay < pEnemyB.delay) return -1;
        else if (pEnemyA.delay > pEnemyB.delay) return 1;
        else return 0;
    }

    private getSituationsFromWave (pWave:any): any[] {
        return pWave.situations;
    }

    private playCurrentStack () {

        if (this.canceled) return;

        if (this.enemyStack[0]) {
            this.isStackPlaying = true;
            this.playStackStep( this.enemyStack.shift() );
        } else {
            this.forgetTimeout();
            this.isStackPlaying = false;
        }
    }

    private playStackStep (pStep:any) {
        this.currentStackStep = pStep;

        if (this.currentStackStep === EnemyManager.NEXT_SITUATION_KEY) {
            BEvent.once(EnemyEvent.ALL_DEAD, this.playCurrentStack, this);
        } else {
            this.currentTimeout = new Timeout(this.execCurrentStep.bind(this), this.currentStackStep.delay);
        }
    }

    private execCurrentStep () {

        var lPos = this.getRandomPositionFromLevel( this.currentStackStep );

        if (lPos) {
            this.spawnEnemy(this.currentStackStep.enemy, lPos);
        }

        this.currentStackStep = undefined;
        this.forgetTimeout();

        this.playCurrentStack();
    }

    private onEnemiesDead (pEvent:EnemyEvent = null) {

        if (this.canceled) return;

        if (!this.enemyStack[0]) {
            this.reset();
            BEvent.emit(new BEvent(EnemyManager.ON_WAVE_END));
        } else {
            BEvent.once( EnemyEvent.ALL_DEAD, this.onEnemiesDead, this );
        }
    }

    private forgetTimeout () {
        this.currentTimeout = undefined;
    }

    private reset () {
        if (this.currentTimeout) {
            this.currentTimeout.destroy();
            this.forgetTimeout();
        }
    }

    private getRandomPositionFromLevel (pGameplayItemName:string) {
        var lPoppers = this.levelManager.getGameplayObjects( this.currentStackStep.spawner );
        var lIndex = this.getRandomIndexFromArray(lPoppers);

        var lPos = undefined;

        if (!lPoppers[lIndex]) {

            var lPositions = this.levelManager.getGameplayPositions( this.currentStackStep.spawner );
            lIndex = this.getRandomIndexFromArray(lPoppers);

            if (!lPositions[lIndex]) {
                console.warn('The spawner named "'+this.currentStackStep.spawner+'" does not exists. You should modify the enemy waves description file.');
                return;
            } else {
                lPos = lPositions[lIndex].clone();
            }

        } else {
            lPos = lPoppers[lIndex].mesh.position.clone();
        }

        return lPos;
    }

}
