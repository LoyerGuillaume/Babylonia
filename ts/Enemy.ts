class Enemy extends Character {

    public static list:Enemy[] = [];

    private invincibilityTime:number;

    private static get MOVE_SPEED():number { return 0.25;};
    private static get ROTATION_SPEED():number { return 0.3;};

    private lastPlayerHitMe:Player;
    private lastPlayerPosition:BABYLON.Vector3;

    constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene, pLifePoint:number, pInvincibilityTime:number) {
        super(pScene, pAssetName, pPosition, pLifePoint);
        this.invincibilityTime = pInvincibilityTime;
        this.lastPlayerPosition = new BABYLON.Vector3(0, 0, 0);
        Enemy.list.push(this);
    }


    public get getScore () {
        return 0;
    }


    public setModeNormal() {
        super.setModeNormal();
        this.runAnimationName('Run');
    }

    private move(deltaTime:number) {
        if (Player.list.length != 0) {
            this.lastPlayerPosition = Player.list[0].position;
        }

        var vectorMovement:BABYLON.Vector3 = this.lastPlayerPosition.subtract(this.position);

        vectorMovement.normalize();

        this.moveWithCollisions(vectorMovement.scaleInPlace(Enemy.MOVE_SPEED * deltaTime));

        super._rotate(vectorMovement, Enemy.ROTATION_SPEED);

    }


    protected checkProjectilesCollision ():void {
        for (var i in FireBall.list) {
            if (this.meshe.intersectsMesh(FireBall.list[i], false)) {
                this.lastPlayerHitMe = FireBall.list[i].getLauncher;
                FireBall.list[i].destroy();
                super.onHit();
                return;
            }
        }
    }


    protected doActionNormal (deltaTime:number):void {
        if (this.isInvicible) {
            super.invicibilityCooldown(this.invincibilityTime);
        } else {
            this.checkProjectilesCollision();
        }
        this.move(deltaTime);
    }


    protected die ():void {
        BEvent.emit(new PlayerEvent(PlayerEvent.HAS_HIT, this.lastPlayerHitMe, this.getScore));
        this.destroy();
    }


    public destroy ():void {
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
        super.destroy();
    }

}
