class Player extends AssetGraphic {

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 10;};

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        this.controller = new ControllerKeyboard();
    }

    public start() {

    }

    private move() {
        var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.controller.horizontal, 0, this.controller.vertical);
        vectorMovement.normalize();

        this.position.x -= vectorMovement.x * Player.MOVE_SPEED;
        this.position.z += vectorMovement.z * Player.MOVE_SPEED;
    }

    public rotate() { // FIXME override
        
    }

    protected doActionNormal() {
        this.move();
    }

    public getMesh():BABYLON.Mesh {
        return this.meshes[0];
    }

}
