class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    private static get MOVE_SPEED():number { return 6;};
    private static get ROTATION_SPEED():number { return 0.3;};

    protected constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Enemy.list.push(this);

        this.position = pPosition.clone();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);
    }


    public setModeNormal() {
        super.setModeNormal();
        this.runAnimationName('Run');
    }

    protected doActionNormal() {
        this.move();
    }

    private move() {
        var target = Player.list[0];
        var vectorMovement:BABYLON.Vector3 = target.position.subtract(this.position);

        // var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.control ler.horizontal, 0, this.controller.vertical);
        var vectorMovementNormalized:BABYLON.Vector3 = vectorMovement.normalize();
        // console.log(vectorMovementNormalized);

        this.moveWithCollisions(vectorMovement.scaleInPlace(Enemy.MOVE_SPEED));

        var rotation = BABYLON.Tools.ToDegrees(Math.atan2(vectorMovementNormalized.y, vectorMovementNormalized.x));
        // console.log(rotation);
        rotation -= 90;
        var q = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(rotation));
        this.rotationQuaternion = BABYLON.Quaternion.Slerp(this.rotationQuaternion.clone(), q, Enemy.ROTATION_SPEED);

    }


    public destroy () {
        super.destroy();
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
    }

}
