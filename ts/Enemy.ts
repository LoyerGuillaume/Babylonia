class Enemy extends AssetGraphic {

    public static list:Enemy[] = [];

    private static get MOVE_SPEED():number { return 0.25;};
    private static get ROTATION_SPEED():number { return 0.3;};

    constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene) {
        super(pAssetName, pScene);
        Enemy.list.push(this);

        this.position = pPosition.clone();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);
    }


    public setModeNormal() {
        super.setModeNormal();
        this.runAnimationName('Run');
    }


    private move(deltaTime:number) {
        var target = Player.list[0];
        var vectorMovement:BABYLON.Vector3 = target.position.subtract(this.position);

        vectorMovement.normalize();

        this.moveWithCollisions(vectorMovement.scaleInPlace(Enemy.MOVE_SPEED * deltaTime));

        this._rotate(vectorMovement);
    }


    private _rotate (vectorMovement:BABYLON.Vector3) {
        vectorMovement = vectorMovement.multiplyByFloats(-1, -1, -1);
        var rotation = BABYLON.Tools.ToDegrees(Math.atan2(vectorMovement.z, vectorMovement.x));
        rotation -= 90;
        var q = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(-rotation));
        this.rotationQuaternion = BABYLON.Quaternion.Slerp(this.rotationQuaternion.clone(), q, Enemy.ROTATION_SPEED);
    }


    protected checkProjectilesCollision ():void {
        for (var i in FireBall.list) {
            if (this.meshe.intersectsMesh(FireBall.list[i], false)) {
                FireBall.list[i].destroy();
                this.destroy();
            }
        }
    }

    protected doActionNormal (deltaTime:number):void {
        this.checkProjectilesCollision();
        this.move(deltaTime);
    }

    public destroy ():void {
        super.destroy();
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
    }

}
