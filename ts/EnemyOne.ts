class EnemyOne extends Enemy {

    private static get ASSET_NAME():string { return 'elf';};

    constructor(pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pPosition, pScene);
    }

}
