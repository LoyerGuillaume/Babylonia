class Enemy extends Character {

    public static list:Enemy[] = [];

    protected hitFeedbackTime:number;

    private static get MOVE_SPEED():number { return 0.003;};
    private static get ROTATION_SPEED():number { return 0.3;};

    private lastPlayerHitMe:Player;
    private lastPlayerPosition:BABYLON.Vector3;
    private speedMalus:number = 1;

    constructor(pAssetName:string, pPosition:BABYLON.Vector3, pScene:BABYLON.Scene, pLifePoint:number, pInvincibilityTime:number) {
        super(pScene, pAssetName, pPosition, pLifePoint);
        this.hitFeedbackTime    = pInvincibilityTime;
        this.lastPlayerPosition = new BABYLON.Vector3(0, 0, 0);

        this.initCollision();

        Enemy.list.push(this);
    }


    public get getScore () {
        return 0;
    }


    public get getDropedCoinsNumber () {
        return 0;
    }


    private initCollision () :void {
        this.checkCollisions = true;
        this.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    }


    private move(deltaTime:number) {
        if (Player.list.length != 0) {
            this.lastPlayerPosition = Player.list[0].position;
        }

        var vectorMovement:BABYLON.Vector3 = this.lastPlayerPosition.subtract(this.position);

        vectorMovement.normalize();

        this.moveWithCollisions(vectorMovement.scaleInPlace(Enemy.MOVE_SPEED * deltaTime * this.speedMalus));

        this._rotate(vectorMovement, Enemy.ROTATION_SPEED);

    }


    public setMalusSpeed (pRatio:number):void {
        this.speedMalus = pRatio;
    }


    protected checkPlayerAttacksCollision ():void {
        for (var i in PlayerAttack.list) {
            var attack:PlayerAttack = PlayerAttack.list[i];
            if (Tools.intersectOnHorizontalPlan(this.position, attack.position, attack.collisionSize)) {
                this.lastPlayerHitMe = PlayerAttack.list[i].getLauncher;
                attack.onHit();
                attack.debuff(this);
                if (this.onHit(attack.damage)) {
                    return;
                }
            }
        }
    }


    protected doActionNormal (deltaTime:number):void {
        this.animationMovement(deltaTime);
        if (this.isHit) {
            this.hitFeedbackCooldown(this.hitFeedbackTime);
        }
        this.checkPlayerAttacksCollision();
        this.move(deltaTime);
    }


    private dropCoins ():void {
        for (var i = 0; i < this.getDropedCoinsNumber; i++) {
            var minRand        :number          = -1;
            var vectorDirection:BABYLON.Vector3 = new BABYLON.Vector3(minRand + Math.random() * 2, 0, minRand + Math.random() * 2);
            vectorDirection.normalize();
            var coin           :Coin            = new Coin(this.getScene(), this.position, vectorDirection);
            coin.start();
        }
    }


    protected die ():void {
        BEvent.emit(new PlayerEvent(PlayerEvent.HAS_HIT, {
            player: this.lastPlayerHitMe,
            score : this.getScore
        }));

        this.dropCoins();
        this.destroy();
    }


    public destroy ():void {
        Enemy.list.splice(Enemy.list.indexOf(this), 1);

        if (!Enemy.list[0]) {
            BEvent.emit( new EnemyEvent(EnemyEvent.ALL_DEAD) );
        }

        super.destroy();
    }

}
