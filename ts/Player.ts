class Player extends AssetGraphic {

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 10;};

    private currentRotation:number;

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        this.controller = new ControllerKeyboard();
        this.currentRotation = 0;
        this.initAnimation();
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

        this.runAnimationName('Run');


        //IDLE 0-39
        //Run 45-85
    }

    public start() {

    }

    private move() {
        var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.controller.horizontal, 0, this.controller.vertical);
        vectorMovement.normalize();

        this.position.x -= vectorMovement.x * Player.MOVE_SPEED;
        this.position.z -= vectorMovement.z * Player.MOVE_SPEED;
    }


//checkCollision = true
//Elipsoid
//InterceptMesh
//
//
//Saut 22-48
//run 0-21
//double saut 49-73
//Mort 74-138
    private _rotate() {
        if (this.controller.vertical != 0 || this.controller.horizontal != 0) {
            var rotation = BABYLON.Tools.ToDegrees(Math.atan2(this.controller.vertical, this.controller.horizontal));
            rotation -= 90;
            this.currentRotation = rotation;
        }
        this.rotation.y = BABYLON.Tools.ToRadians(-this.currentRotation);
    }

    protected doActionNormal() {
        this.move();
        this._rotate();
    }

    public getMesh():BABYLON.Mesh {
        return this.meshes[0];
    }

}
