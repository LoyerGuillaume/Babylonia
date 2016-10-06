class Player extends AssetGraphic {

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 10;};

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        this.controller = new ControllerKeyboard();


        this.getMesh().position.x += 10;
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
        var rotate = Math.atan2(this.controller.vertical, this.controller.horizontal) * MathTools.RAD2DEG;
        if (this.controller.vertical != 0 || this.controller.horizontal != 0) {
            rotate -= 90;
        }
        console.log(rotate);
        this.rotation = new BABYLON.Vector3(0, rotate, 0);

    }

    protected doActionNormal() {
        // this.move();
        this._rotate();
    }

    public getMesh():BABYLON.Mesh {
        return this.meshes[0];
    }

}
