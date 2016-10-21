class EnemyOne extends Enemy {

    private static get ASSET_NAME()       :string { return 'elf';};
    private static get LIFE_POINT()       :number { return 2;};
    private static get INVICIBILITY_TIME():number { return 30;};
    private static get SCORE_GET()        :number { return 100;};

    constructor(pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pPosition, pScene, EnemyOne.LIFE_POINT, EnemyOne.INVICIBILITY_TIME);
        this.initAnimation();
    }


    public get getScore () {
        return EnemyOne.SCORE_GET;
    }


    private initAnimation() {

        //Saut 22-48
        //run 0-21
        //double saut 49-73
        //Mort 74-138
        //
        this.addAnimation('Run', 0, 21);
        this.addAnimation('Jump', 22, 48);
        this.addAnimation('Double Jump', 49, 73);
        this.addAnimation('Death', 74, 138);

        // this.runAnimationName('IDLE');


        //IDLE 0-39
        //Run 45-85
    }

}
