interface IPlayerProfile {
    coins       ?:number;
    score       ?:number;
    bestScore   ?:number;
    xp          ?:number;
    level       ?:number;
    upgradeLife ?:number;

    /**
     * percentage ex : 10 for 10%
     */
    bonusCoins  ?:number;

    /**
     * in ms
     */
    bonusCoinsTime  ?:number;

    /**
     * reset when the player die
     */
    bonusLife       ?:number;

}


interface IPlayerAttack {
    name            : string,
    key             : string,
    cooldown        : number,
    attackFunction  : any,
    countFrameAttack: number
}


interface PlayerAttacksDictionnary {
    [naem:string]:IPlayerAttack
}


class Player extends Character {

    public static list:Player[] = [];

    public controller:Controller;
    private static get ASSET_NAME()             :string { return 'ChaWitch';};
    private static get MOVE_SPEED()             :number { return 0.007;};
    private static get ROTATION_SPEED()         :number { return 0.5;};
    private static get INVICIBILITY_TIME()      :number { return 120;};
    private static get ANGLE_SPECIAL_ATTACK_1() :number { return 10;};
    private static get ICE_WALKING_DURATION()   :number { return 120;};
    public static  get LIFE_POINT()             :number { return 1;};
    public static  get XP_BY_COIN()             :number { return 0.5;};
    public static  get XP_BY_SCORE()            :number { return 10;};
    public static  get LEVEL_XP_SIZE()          :number { return 1000;};

    private _profile:IPlayerProfile;

    private iceWalkingCount:number = 0;

    private bonusCoinsTimeout:Timeout;

    private arenaLimitPos:BABYLON.Vector3;
    private arenaStartPos:BABYLON.Vector3;

    private lastDoAction: (deltaTime:number) => void;

    private attacks:PlayerAttacksDictionnary = {
        attack: {
            name            : 'BabyBoule',
            key             : 'A',
            cooldown        : 30,
            attackFunction  : this.shotOneFireBall,
            countFrameAttack: 30
        },
        special_1: {
            name            : 'BabySpread',
            key             : 'Z',
            cooldown        : 120,
            attackFunction  : this.shotThreeFireBalls,
            countFrameAttack: 120
        },
        special_2: {
            name            : 'BabyGel',
            key             : 'E',
            cooldown        : 500,
            attackFunction  : this.launchIceWalking,
            countFrameAttack: 500
        },
        special_3: {
            name            : 'BabyBoum',
            key             : 'R',
            cooldown        : 3000,
            attackFunction  : this.launchAOE,
            countFrameAttack: 3000
        }
    };

    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pArenaLimite:BABYLON.Vector3, pArenaStart:BABYLON.Vector3, pProfile:IPlayerProfile = undefined) {
        super(pScene, Player.ASSET_NAME, pPosition, Player.LIFE_POINT);
        Player.list.push(this);

        this.profile    = pProfile;
        this.arenaStartPos = pArenaStart;
        this.arenaLimitPos = pArenaLimite;
        this.controller = new ControllerKeyboard();

        this.initCollision();
        this.initEvents();

        UIManager.initCapacities(this.attacks);
    }

    public setModeNormal() {
        this.doAction = this.doActionShop;
    }

    public getPlayerIndex ():number {
        return Player.list.indexOf(this);
    }

    public set profile (pValue:IPlayerProfile) {

        pValue              = pValue || {};
        this._profile       = pValue;

        this.score          = 0;
        this.bestScore      = pValue.bestScore   || 0;
        this.level          = pValue.level       || 0;
        this.xp             = pValue.xp          || 0;
        this.upgradeLife    = pValue.upgradeLife || 0;

        this.bonusCoins     = pValue.bonusCoins     || 0;
        this.bonusCoinsTime = pValue.bonusCoinsTime || 0;
        this.bonusLife      = 0;

        this._profile.coins = pValue.coins      || 0;
    }

    /**
     * WARNING : do not modify the profile please.
     */
    public get profile () {
        return this._profile;
    }

    public get score ():number {
        return this._profile.score;
    }

    public set score (pValue) {
        UIManager.setScore(pValue);
        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_SCORE, {
            score: pValue
        }));
        this.xp += ((pValue - this._profile.score) * Player.XP_BY_SCORE) / this.level;
        this._profile.score = pValue;
    }

    public get bestScore ():number {
        return this._profile.bestScore;
    }

    public set bestScore (pValue) {
        UIManager.setBestScore(pValue);
        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_BEST_SCORE, {
            bestScore: pValue
        }));
        this._profile.bestScore = pValue;
    }

    public get coins ():number {
        return Math.floor(this._profile.coins);
    }

    public gainCoin (pValue) {

        pValue *= this.bonusCoins;
        pValue = Math.floor(pValue);

        this.xp += ((pValue - this._profile.coins) * Player.XP_BY_COIN) / this.level;
        this._profile.coins += pValue;

        BEvent.emit(new PlayerEvent(PlayerEvent.UPDATE_COIN, {
            coins: this._profile.coins
        }));

    }

    public lostCoin (pValue) {

        pValue = Math.floor(pValue);

        this._profile.coins -= pValue;

        BEvent.emit(new PlayerEvent(PlayerEvent.UPDATE_COIN, {
            coins: this._profile.coins
        }));

    }

    public get xp ():number {
        return this._profile.xp;
    }

    public set xp (pValue) {

        if (pValue >= Player.LEVEL_XP_SIZE) {
            pValue = 0;
            this.level++;
        }

        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_XP, {
            xp: pValue
        }));
        this._profile.xp = pValue;
    }

    public get level ():number {
        return this._profile.level;
    }

    public set level (pValue) {
        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_LEVEL, {
            level: pValue
        }));
        this._profile.level = pValue;
    }

    public get upgradeLife ():number {
        return this._profile.upgradeLife;
    }

    public set upgradeLife (pValue) {
        this._profile.upgradeLife = this._profile.upgradeLife || 0;
        this.lifePoint += pValue;
        BEvent.emit(new PlayerEvent(PlayerEvent.GAIN_LIFE, {
            amount: pValue
        }))
        this._profile.upgradeLife += pValue;
    }

    // BONUS

    public get bonusCoins ():number {
        return this._profile.bonusCoins;
    }

    public set bonusCoins (pValue) {
        this._profile.bonusCoins = 1 + pValue / 100;
    }

    public get bonusCoinsTime ():number {
        return this._profile.bonusCoinsTime;
    }

    public set bonusCoinsTime (pValue) {

        if (this.bonusCoinsTimeout) {
            this.bonusCoinsTimeout.destroy();
            this.bonusCoinsTimeout = undefined;
        }

        this._profile.bonusCoinsTime = pValue;

        if (pValue > 0) {
            this.bonusCoinsTimeout = new Timeout(this.resetBonusCoins.bind(this), this._profile.bonusCoinsTime);
        }
    }

    public get bonusLife ():number {
        return this._profile.bonusLife;
    }

    public set bonusLife (pValue) {
        this._profile.bonusLife = this._profile.bonusLife || 0;
        this.lifePoint += pValue;
        this._profile.bonusLife += pValue;
    }

    // PRIVATE IMPLEMENTATION

    private resetBonusCoins () {
        this.bonusCoins = 0;
    }

    protected initEvents () {
        BEvent.on(PlayerEvent.HAS_HIT, this.hasHit, this);
    }


    protected initCollision () {
        this.checkCollisions = true;
        this.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
        // Tools.displayEllipsoid(this.getScene(), this);
    }


    private hasHit (pPlayerEventParams:any) {
        if (this === pPlayerEventParams.player) {
            this.score += pPlayerEventParams.score;
            this.updateBestScore();
        }
    }


    private updateBestScore () {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
        }
    }

    protected doActionShop (deltaTime:number) {
        this._doActionBase(deltaTime);
        this.checkArenaEnter();
    }

    protected doActionNormal (deltaTime:number) {

        this._doActionBase(deltaTime);

        if (this.position.x < this.arenaLimitPos.x) {
            this.position.x = this.arenaLimitPos.x;
        }
    }


    private move (deltaTime:number) {
        var vectorMovement:BABYLON.Vector3 = new BABYLON.Vector3(this.controller.horizontal, 0, this.controller.vertical);
        vectorMovement.normalize();

        vectorMovement.scaleInPlace(-Player.MOVE_SPEED * deltaTime);
        this.moveWithCollisions(vectorMovement);

        if (this.controller.vertical != 0 || this.controller.horizontal != 0) {
            // this.runAnimationName('Run');
            super._rotate(vectorMovement.clone(), Player.ROTATION_SPEED);
        } else {
            // this.stopAnimation();
        }
    }


    private checkAttack () {
        var attackName:string;
        for (attackName in this.attacks) {
            if (this.controller[attackName]) {
                var attack = this.attacks[attackName];
                if (attack.countFrameAttack >= attack.cooldown) {
                    BEvent.emit(new PlayerEvent(PlayerEvent.ATTACK, {
                        name: attack.name
                    }));
                    attack.countFrameAttack = 0;
                    attack.attackFunction.apply(this);
                }
            }
        }
    }


    private addFrameAttack () {
        var attackName:string;
        for (attackName in this.attacks) {
            this.attacks[attackName].countFrameAttack++;
        }
    }

//==== ATTACKS ====

    private createFireBall (pRotationQuaternion:BABYLON.Quaternion) {
        var fireBall = new FireBall(this.getScene(), this.position, pRotationQuaternion, this);
        fireBall.start();
    }

    private createSpreadBall (pRotationQuaternion:BABYLON.Quaternion) {
        var spreadBall = new BallSpread(this.getScene(), this.position, pRotationQuaternion, this);
        spreadBall.start();
    }

    private createKnifeHurtle (pRotationQuaternion:BABYLON.Quaternion) {
        var knifeHurtle = new KnifeHurtle(this.getScene(), this.position, pRotationQuaternion, this);
        knifeHurtle.start();
    }

    /**
     * Attack SIMPLE
     */
    private shotOneFireBall () {
        Babylonia.getSoundLoaded('BabyBoule').play();
        this.createFireBall(this.rotationQuaternion);
    }

    /**
     * Attack SIMPLE PLUS
     */
    private shotThreeFireBalls () {
        Babylonia.getSoundLoaded('BabySpread').play();
        var rotationQuaternion:BABYLON.Quaternion = this.rotationQuaternion;
        this.createSpreadBall(rotationQuaternion);
        this.createSpreadBall(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians( Player.ANGLE_SPECIAL_ATTACK_1))));
        this.createSpreadBall(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(-Player.ANGLE_SPECIAL_ATTACK_1))));
    }

    /**
     * Attack SIMPLE
     */
    private shotOneKnifeHurtle () {
        this.createKnifeHurtle(this.rotationQuaternion);
    }

    /**
     * Attack SIMPLE PLUS
     */
    private shotThreeKnifeHurtles () {
        var rotationQuaternion:BABYLON.Quaternion = this.rotationQuaternion;
        this.createKnifeHurtle(rotationQuaternion);
        this.createKnifeHurtle(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(  Player.ANGLE_SPECIAL_ATTACK_1       ))));
        this.createKnifeHurtle(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians( -Player.ANGLE_SPECIAL_ATTACK_1       ))));
        this.createKnifeHurtle(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(  Player.ANGLE_SPECIAL_ATTACK_1 * 2   ))));
        this.createKnifeHurtle(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians( -(Player.ANGLE_SPECIAL_ATTACK_1 * 2) ))));
    }

    private _doActionBase (deltaTime:number) {
        this.addFrameAttack();
        this.animationMovement(deltaTime);

        this.move(deltaTime);
        this.checkAttack();

        if (this.isHit) {
            super.hitFeedbackCooldown(Player.INVICIBILITY_TIME);
        } else {
            this.checkEnemyCollision();
        }

        this.checkCoinCollision();
    }

    private launchIceWalking () {
        Babylonia.getSoundLoaded('BabyGel').play();
        this.iceWalkingCount = 0;
        this.lastDoAction = this.doAction;
        this.doAction = this.doActionIceWalking;
    }

    private doActionIceWalking (deltaTime:number) {
        this.lastDoAction(deltaTime);
        if (this.iceWalkingCount % 6 === 0) {
            this.createIce();
        }
        if (++this.iceWalkingCount >= Player.ICE_WALKING_DURATION) {
            Babylonia.getSoundLoaded('BabyGel').stop();
            this.doAction = this.lastDoAction;
        }
    }

    private createIce () {
        var position:BABYLON.Vector3 = this.position.clone();
        position.y = 0;
        var iceSpikes:AssetGraphic = new IceSpikes(this.getScene(), position, this);
        iceSpikes.start();
    }


    private launchAOE () {
        Babylonia.getSoundLoaded('BabyBoom').play();
        var position:BABYLON.Vector3 = this.position.clone();
        var aoe:AOE = new AOE(this.getScene(), position, this);
        aoe.start();
    }


    private checkEnemyCollision () {
        for (var i in Enemy.list) {
            if (Tools.minusVector3(this.position, Enemy.list[i].position).length() < 0.5) {
                BEvent.emit(new PlayerEvent(PlayerEvent.HIT));
                this.onHit();
                return;
            }
        }
    }


    private checkArenaEnter () {
        if (Tools.minusVector3(this.position, this.arenaStartPos).length() < 5) {
            this.onArenaEntred();
        }
    }

    private checkCoinCollision () {
        for (var i in Coin.list) {
            if (Tools.minusVector3(this.position, Coin.list[i].position).length() < 0.95) {
                Coin.list[i].destroy();
                this.onCoinCollision();
            }
        }
    }


    private onCoinCollision ():void {
        this.gainCoin(1);
    }

    private onArenaEntred () {
        if (this.doAction === this.doActionShop) {
            BEvent.emit(new PlayerEvent(PlayerEvent.READY_TO_FIGHT));
            this.doAction = this.doActionNormal;
        }
    }

    protected die () {
        BEvent.emit(new PlayerEvent(PlayerEvent.DEATH, {
            player: this
        }));
    }


    public destroy () {
        this.controller.destroy();
        super.destroy();
    }

}
