class FireBall extends AssetGraphic {

    public static list: FireBall[] = [];

    private static get ASSET_NAME():string { return 'elf';};
    private static get SPEED():number { return 2;};

    private direction:BABYLON.Vector3;

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion) {
        super(FireBall.ASSET_NAME, pScene);
        FireBall.list.push(this);
        this.position = pPosition;
        this.rotationQuaternion = pRotation;
    }

    protected doActionNormal () {
        this.move();
    }

    private move() {
        var v         = new BABYLON.Vector3(0, 0, -1);
        this.computeWorldMatrix(true);
        var m         = this.getWorldMatrix();
        var movement  = BABYLON.Vector3.TransformCoordinates(v, m);
        movement.subtractInPlace(this.position).normalize().scaleInPlace(10);
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }

    public destroy () {
        super.destroy();
        FireBall.list.splice(FireBall.list.indexOf(this), 1);
    }
}
