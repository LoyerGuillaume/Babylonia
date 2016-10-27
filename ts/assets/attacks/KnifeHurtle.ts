class KnifeHurtle extends Ball {

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super('KnifeHurtle', pScene, pPosition, pRotation, pPlayer, KnifeHurtle._upgrade);

        this.maxLifeTime    = 4;
        this.speed          = 1;
        this.collisionRange = 1;
        this.damageDeal     = 1.5;
    }

    public static upgrade (params:IAttackUpgrade) {
        super.upgrade(params, KnifeHurtle._upgrade);
    }

    public onHit () {
        // override for disable default behavior
    }

}
