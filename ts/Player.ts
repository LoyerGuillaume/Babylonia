class Player extends AssetGraphic {

    public static list:Player[] = [];

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 10;};
    private static get ROTATION_SPEED():number { return 0.3;};
    private static get COUNTDOWN_ATTACK():number { return 30;};

    private countFrameAttack:number = 0;

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        Player.list.push(this);
        this.controller = new ControllerKeyboard();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);
        this.initAnimation();
        this.initCollision();
    }

    protected initCollision() {
        this.checkCollisions = true;
        this.ellipsoid = new BABYLON.Vector3(50, 50, 50);
        // Tools.displayEllipsoid(this.getScene(), this);
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

    private move() {
        var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.controller.horizontal, 0, this.controller.vertical);
        vectorMovement.normalize();

        this.moveWithCollisions(vectorMovement.scaleInPlace(-Player.MOVE_SPEED));
    }


//checkCollision = true
//Elipsoid
//InterceptMesh
//
    private _rotate() {
        if (this.controller.vertical != 0 || this.controller.horizontal != 0) {
            this.runAnimationName('Run');
            var rotation = BABYLON.Tools.ToDegrees(Math.atan2(this.controller.vertical, this.controller.horizontal));
            rotation -= 90;
            var q = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(-rotation));
            this.rotationQuaternion = BABYLON.Quaternion.Slerp(this.rotationQuaternion.clone(), q, Player.ROTATION_SPEED);
        } else {
            this.stopAnimation();
        }
    }

    protected doActionNormal() {
        this.countFrameAttack++;

        this.move();
        this._rotate();
        this.attack();
    }

    private attack() {
        if (this.controller.attack) {
            if (this.countFrameAttack >= Player.COUNTDOWN_ATTACK) {
                this.countFrameAttack = 0;
                this.createFireBall();
            }
        }
    }

    private createFireBall() {
        var fireBall = new FireBall(this.getScene(), this.position, this.rotationQuaternion);
        fireBall.start();
    }

}
