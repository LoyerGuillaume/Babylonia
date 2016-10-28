class AOE extends PlayerAttack {

    private static get ASSET_NAME():string { return ''; };
    private static get MAX_LIFE_TIME():number { return 300;};

    private cylinder:BABYLON.Mesh;

    protected collisionRange = 0.1;

    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pPlayer) {
        super(AOE.ASSET_NAME, pScene, pPosition, pPlayer, AOE._upgrade);

        this.maxLifeTime = AOE.MAX_LIFE_TIME;
        this.meshe.isVisible = false;
        this.initEffectZone(pScene);
    }


    public static upgrade (params:IAttackUpgrade) {
        super.upgrade(params, AOE._upgrade);
    }


    protected doActionNormal () {
        this.increaseEffectZone();

        if (this.cylinder.material.alpha < 0.5) {
            this.collisionRange = 0;
        } else {
            this.collisionRange *= 1.3;
        }
        if (this.cylinder.material.alpha < 0.001) {
            this.destroy();
        }
    }


    private increaseEffectZone () {
        this.cylinder.scaling.x *= 1.3;
        this.cylinder.scaling.z *= 1.3;
        this.cylinder.material.alpha -= 0.02;
    }


    private initEffectZone (pScene:BABYLON.Scene) {
        this.cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', {
            diameter    : 0.2,
            height      : 0.2,
            tessellation: 25
        }, pScene);
        this.cylinder.material = new BABYLON.StandardMaterial('mat', pScene);
        this.cylinder.position = this.position.clone();
    }


    public onHit () {};


    public destroy () {
        super.destroy();
        this.cylinder.dispose();
    }

}
