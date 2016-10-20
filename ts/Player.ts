class Player extends Character {

    public static list:Player[] = [];

    public controller:Controller;
    private static get ASSET_NAME()       :string { return 'elf';};
    private static get MOVE_SPEED()       :number { return 0.5;};
    private static get ROTATION_SPEED()   :number { return 0.3;};
    private static get COUNTDOWN_ATTACK() :number { return 30;};
    private static get INVICIBILITY_TIME():number { return 120;};
    public static get LIFE_POINT()        :number { return 2;};

    private countFrameAttack:number = 0;
    private score:number;


    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3) {
        super(pScene, Player.ASSET_NAME, pPosition, Player.LIFE_POINT);
        Player.list.push(this);

        this.controller = new ControllerKeyboard();
        this.initEvents();
        this.initAnimation();
        this.initCollision();
    }


    public getPlayerIndex ():number {
        return Player.list.indexOf(this);
    }


    public get getScore ():number {
        return this.score;
    }


    protected initEvents () {
        BEvent.on(PlayerEvent.HAS_HIT, this.hasHit, this);
    }


    protected initCollision () {
        this.checkCollisions = true;
        this.ellipsoid = new BABYLON.Vector3(50, 50, 50);
        // Tools.displayEllipsoid(this.getScene(), this);
    }


    private initAnimation () {

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


    private hasHit (pPlayerEvent:PlayerEvent) {
        if (this === pPlayerEvent.player) {

        }
    }


    private move (deltaTime:number) {
        var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.controller.horizontal, 0, this.controller.vertical);
        vectorMovement.normalize();

        this.moveWithCollisions(vectorMovement.scaleInPlace(-Player.MOVE_SPEED * deltaTime));

        if (this.controller.vertical != 0 || this.controller.horizontal != 0) {
            this.runAnimationName('Run');
            super._rotate(vectorMovement.clone(), Player.ROTATION_SPEED);
        } else {
            this.stopAnimation();
        }
    }


    protected doActionNormal (deltaTime:number) {
        this.countFrameAttack++;

        this.move(deltaTime);
        this.attack();

        if (this.isInvicible) {
            super.invicibilityCooldown(Player.INVICIBILITY_TIME);
        } else {
            this.checkEnemyCollision();
        }
    }


    private attack () {
        if (this.controller.attack) {
            if (this.countFrameAttack >= Player.COUNTDOWN_ATTACK) {
                this.countFrameAttack = 0;
                this.createFireBall();
            }
        }
    }


    private createFireBall () {
        var fireBall = new FireBall(this.getScene(), this.position, this.rotationQuaternion, this);
        fireBall.start();
    }


    private checkEnemyCollision () {
        for (var i in Enemy.list) {
            if (this.meshe.intersectsMesh(Enemy.list[i], false)) {
                BEvent.emit(new PlayerEvent(this, PlayerEvent.HIT));
                super.onHit();
                return;
            }
        }
    }


    protected die () {
        BEvent.emit(new PlayerEvent(this, PlayerEvent.DEATH));
    }


    public destroy () {
        console.log('Destroy');
        this.controller.destroy();
        // Player.list.splice(Player.list.indexOf(this), 1);
        super.destroy();
    }

}
