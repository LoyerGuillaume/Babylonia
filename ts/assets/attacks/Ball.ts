class Ball extends PlayerAttack {

    private direction:BABYLON.Vector3;

    protected speed:number = 0.25;

    constructor(pAssetName:string, pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer, upgrade:IAttackUpgrade) {
        super(pAssetName, pScene, pPosition, pPlayer, upgrade);

        this.computeWorldMatrix(true);
        this.rotationQuaternion = pRotation;
        this.addOffset();
        this.maxLifeTime = this.maxLifeTime;

        this.meshe.isVisible = true;
    }

    private addOffset ():void {
        this.computeWorldMatrix(true);
        var movement  = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0.2, -1), this.getWorldMatrix());

        movement.subtractInPlace(this.position).normalize();
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }

    protected doActionNormal () {
        super.doActionNormal();
        this.move();
    }


    private move() {
        var v         = new BABYLON.Vector3(0, 0, -1);
        var m         = this.getWorldMatrix();
        var movement  = BABYLON.Vector3.TransformCoordinates(v, m);
        movement.subtractInPlace(this.position).normalize().scaleInPlace(this.speed);
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }

}
