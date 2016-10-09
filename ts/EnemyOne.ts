class EnemyOne extends Enemy {

    private static get ASSET_NAME():string { return 'elf';};

    constructor(pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(EnemyOne.ASSET_NAME, pPosition, pScene);
        this.initAnimation();
    }

    protected doActionNormal () {
        super.doActionNormal();
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
