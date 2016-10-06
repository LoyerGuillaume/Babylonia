class Player extends AssetGraphic {

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 10;};

    private currentRotation:number;

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        this.controller = new ControllerKeyboard();
        this.currentRotation = 0;
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

}
