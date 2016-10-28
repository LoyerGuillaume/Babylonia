class EnemyOne extends Enemy {

    private static get ASSET_NAME()          :string { return 'Mummy_char';};
    private static get LIFE_POINT()          :number { return 3.5;};
    private static get HIT_FEEDBACK_TIME()   :number { return 30;};
    private static get SCORE_GET()           :number { return 100;};
    private static get DROPED_COINS_NUMBER() :number { return 2;};

    constructor(pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pPosition, pScene, EnemyOne.LIFE_POINT, EnemyOne.HIT_FEEDBACK_TIME);
        // this.initAnimation();
        // console.log(this.meshe.rotation);
        // console.log(this.rotation);
    }


    public get getScore () {
        return EnemyOne.SCORE_GET;
    }


    public get getDropedCoinsNumber () {
        return EnemyOne.DROPED_COINS_NUMBER;
    }


    //FIXME
    // protected _rotate (vectorMovement:BABYLON.Vector3, rotationSpeed:number) {
    //     vectorMovement = vectorMovement.multiplyByFloats(-1, -1, -1);
    //     super._rotate(vectorMovement, rotationSpeed);
    // }

    private initAnimation() {

        //Saut 22-48
        //run 0-21
        //double saut 49-73
        //Mort 74-138
        //
        // this.addAnimation('Run', 0, 21);
        // this.addAnimation('Jump', 22, 48);
        // this.addAnimation('Double Jump', 49, 73);
        // this.addAnimation('Death', 74, 138);

        // this.runAnimationName('IDLE');


        //IDLE 0-39
        //Run 45-85
    }

}
