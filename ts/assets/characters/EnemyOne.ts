class EnemyOne extends Enemy {

    private static get ASSET_NAME()          :string { return 'Mummy_char';};
    private static get LIFE_POINT()          :number { return 3.5;};
    private static get HIT_FEEDBACK_TIME()   :number { return 30;};
    private static get SCORE_GET()           :number { return 100;};
    private static get DROPED_COINS_NUMBER() :number { return Math.floor(Math.random() * 2) + 2;};

    constructor(pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pPosition, pScene, EnemyOne.LIFE_POINT, EnemyOne.HIT_FEEDBACK_TIME);
    }


    public get getScore () {
        return EnemyOne.SCORE_GET;
    }


    public get getDropedCoinsNumber () {
        return EnemyOne.DROPED_COINS_NUMBER;
    }

}
