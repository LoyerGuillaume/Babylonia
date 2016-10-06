class EnemyOne extends Enemy {

    private static get ASSET_NAME():string { return 'elf';};

    constructor(pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pScene);
    }

}
