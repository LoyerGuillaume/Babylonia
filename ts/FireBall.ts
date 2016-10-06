class FireBall extends AssetGraphic {

    public static list: FireBall[] = [];

    private static get ASSET_NAME():string { return 'elf';};
    private static get SPEED():number { return 2;};

    private direction:BABYLON.Vector3;

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pDirection:BABYLON.Vector3) {
        super(FireBall.ASSET_NAME, pScene);
        FireBall.list.push(this);
        this.position = pPosition;
        this.direction = pDirection;
    }

    protected doActionNormal () {
        this.move();
    }

    private move() {
        var v = this.direction;
        var m = this.getWorldMatrix();
        var movement = BABYLON.Vector3.TransformCoordinates(v, m);
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }
}
