class IceSpikes extends PlayerAttack {

    private static get ASSET_NAME()   :string { return 'IceSpikes'; };
    private static get MAX_LIFE_TIME():number { return 400;};

    protected collisionRange:number = 1.2;
    protected damageDeal:number = 0.02;

    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pPlayer) {
        super(IceSpikes.ASSET_NAME, pScene, pPosition, pPlayer)

        this.maxLifeTime = IceSpikes.MAX_LIFE_TIME;
    }

    public onHit() {};
}
