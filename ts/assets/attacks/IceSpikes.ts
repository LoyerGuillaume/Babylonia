class IceSpikes extends PlayerAttack {

    private static get ASSET_NAME()   :string { return 'IceSpikes'; };
    private static get MAX_LIFE_TIME():number { return 300;};

    protected collisionRange:number = 0.8;
    protected damageDeal:number = 0.02;
    protected malusSpeed:number = 0.75;

    private targetPosition:BABYLON.Vector3;
    private isDestroy:boolean = false;

    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pPlayer) {
        super(IceSpikes.ASSET_NAME, pScene, pPosition, pPlayer, IceSpikes._upgrade)

        this.malusSpeed += IceSpikes._upgrade.malusSpeedUp;

        this.maxLifeTime = IceSpikes.MAX_LIFE_TIME;
    }

    public start () {
        super.start();
        this.targetPosition = this.position.clone();
        this.position.y -= 0.7;
        this.doAction = this.doActionMove
        this.rotation.y = Math.random() * 2 * Math.PI;
    }

    private doActionMove () {
        this.doActionNormal();
        this.position = BABYLON.Vector3.Lerp(this.position, this.targetPosition, 0.1);
        if (Math.abs(this.targetPosition.y - this.position.y) < 0.01) {
            if (this.isDestroy) {
                super.destroy();
            } else {
                this.doAction = this.doActionNormal;
            }
        }
    }

    public static upgrade (params:IAttackUpgrade) {
        super.upgrade(params, IceSpikes._upgrade);
    }

    protected malus (pEnemy:Enemy) {
        pEnemy.setMalusSpeed(this.malusSpeed);
        new Timeout(function () {
            pEnemy.setMalusSpeed(1);
        }, 1500);
    }

    public onHit () {};

    public destroy () {
        if (this.isDestroy) {
            return;
        }
        this.targetPosition.y -= 0.7;
        this.isDestroy = true;
        this.doAction = this.doActionMove;
    }
}
