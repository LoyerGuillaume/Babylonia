class Player extends AssetGraphic {

    private controller:Controller;
    private static get ASSET_NAME():string { return 'elf';};
    private static get MOVE_SPEED():number { return 2;};

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);
        this.controller = new ControllerKeyboard();
    }

    public start() {

    }

    private move() {
        this.getMesh().position.x -= this.controller.horizontal * Player.MOVE_SPEED;
        this.getMesh().position.z += this.controller.vertical * Player.MOVE_SPEED;
    }

    protected doActionNormal() {
        this.move();
    }

    public getMesh():BABYLON.Mesh {
        return this.meshes[0];
    }

}
