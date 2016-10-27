class KnifeHurtle extends Ball {

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super('KnifeHurtle', pScene, pPosition, pRotation, pPlayer);

        this.maxLifeTime    = 5;
        this.speed          = 1;
        this.collisionRange = 1;
        this.damageDeal     = 1.5;
    }

}
