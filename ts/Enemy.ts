class Enemy extends Character {

    public static list:Enemy[] = [];

    private invincibilityTime:number;

    private static get MOVE_SPEED():number { return 0.25;};
    private static get ROTATION_SPEED():number { return 0.3;};

    constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene, pLifePoint:number, pInvincibilityTime:number) {
        super(pScene, pAssetName, pPosition, pLifePoint);
        this.invincibilityTime = pInvincibilityTime;
        Enemy.list.push(this);
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

        super._rotate(vectorMovement, Enemy.ROTATION_SPEED);
    }


    protected checkProjectilesCollision ():void {
        for (var i in FireBall.list) {
            if (this.meshe.intersectsMesh(FireBall.list[i], false)) {
                FireBall.list[i].destroy();
                super.onHit();
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

    public destroy ():void {
        super.destroy();
        Enemy.list.splice(Enemy.list.indexOf(this), 1);
    }

}
