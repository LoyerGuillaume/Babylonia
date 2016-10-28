class BallSpread extends FireBall {


    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super(pScene, pPosition, pRotation, pPlayer, BallSpread._upgrade);
    }

    public static upgrade (params:IAttackUpgrade) {
        super.upgrade(params, BallSpread._upgrade);
    }


}
