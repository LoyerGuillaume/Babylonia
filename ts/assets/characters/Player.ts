interface IPlayerProfile {
    coins       ?:number;
    score       ?:number;
    bestScore   ?:number;
    xp          ?:number;
    level       ?:number;

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
    public static  get LIFE_POINT()             :number { return 3;};
    public static  get XP_BY_COIN()             :number { return 0.5;};
    public static  get XP_BY_SCORE()            :number { return 10;};
    public static  get LEVEL_XP_SIZE()          :number { return 1000;};

    private _profile:IPlayerProfile;

    private iceWalkingCount:number = 0;

    private attacks:{} = {
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
            name            : 'BabyAOE',
            key             : 'R',
            cooldown        : 3000,
            attackFunction  : this.launchAOE,
            countFrameAttack: 3000
        }
    };

    //constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pCoins, pScore, pBestScore, pXp, pLevel) {
    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pProfile:IPlayerProfile = undefined) {
        super(pScene, Player.ASSET_NAME, pPosition, Player.LIFE_POINT);
        Player.list.push(this);

        this.profile    = pProfile;
        this.controller = new ControllerKeyboard();

        this.initAnimation();
        this.initCollision();
        this.initEvents();

        UIManager.initCapacities(this.attacks);
    }

    public getPlayerIndex ():number {
        return Player.list.indexOf(this);
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
        return this._profile.coins;
    }

    public set coins (pValue) {
        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_COIN, {
            coins: pValue
        }));
        this.xp += ((pValue - this._profile.coins) * Player.XP_BY_COIN) / this.level;
        this._profile.coins = pValue;
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



    public set profile (pValue:IPlayerProfile) {

        pValue              = pValue || {};
        this._profile       = {};

        this.score          = 0;
        this.bestScore      = pValue.bestScore || 0;
        this.coins          = pValue.coins     || 0;
        this.xp             = pValue.xp        || 0;
        this.level          = pValue.level     || 0;
    }

    /**
     * WARNING : do not modify the profile please.
     */
    public get profile () {
        return this._profile;
    }

    protected initEvents () {
        BEvent.on(PlayerEvent.HAS_HIT, this.hasHit, this);
    }


    protected initCollision () {
        this.checkCollisions = true;
        this.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
        // Tools.displayEllipsoid(this.getScene(), this);
    }


    private initAnimation () {

        //Saut 22-48
        //run 0-21
        //double saut 49-73
        //Mort 74-138
        //
        // this.addAnimation('Run', 0, 21);
        // this.addAnimation('Jump', 22, 48);
        // this.addAnimation('Double Jump', 49, 73);
        // this.addAnimation('Death', 74, 138);
        //
        //
        // this.skeleton.beginAnimation('Witch_Walk');
        // this.addAnimation('Run', 0, 1);
        //
        // this.runAnimationName('Run');

        //IDLE 0-39
        //Run 45-85
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


    protected doActionNormal (deltaTime:number) {
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


    private shotOneFireBall () {
        this.createFireBall(this.rotationQuaternion);
    }


    private shotThreeFireBalls () {
        var rotationQuaternion:BABYLON.Quaternion = this.rotationQuaternion;
        this.createFireBall(rotationQuaternion);
        this.createFireBall(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians( Player.ANGLE_SPECIAL_ATTACK_1))));
        this.createFireBall(rotationQuaternion.clone().multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(-Player.ANGLE_SPECIAL_ATTACK_1))));
    }


    private launchIceWalking () {
        this.iceWalkingCount = 0;
        this.doAction = this.doActionIceWalking;
    }


    private doActionIceWalking (deltaTime:number) {
        this.doActionNormal(deltaTime);
        if (this.iceWalkingCount % 6 === 0) {
            this.createIce();
        }
        if (++this.iceWalkingCount >= Player.ICE_WALKING_DURATION) {
            this.doAction = this.doActionNormal;
        }
    }


    private createIce () {
        var position:BABYLON.Vector3 = this.position.clone();
        position.y = 0;
        var iceSpikes:AssetGraphic = new IceSpikes(this.getScene(), position, this);
        iceSpikes.start();
    }


    private launchAOE () {
        var position:BABYLON.Vector3 = this.position.clone();
        var aoe:AOE = new AOE(this.getScene(), position, this);
        aoe.start();
    }


    private checkEnemyCollision () {
        for (var i in Enemy.list) {
            if (Tools.minusVector3(this.position, Enemy.list[i].position).length() < 0.5) {
                BEvent.emit(new PlayerEvent(PlayerEvent.HIT));
                super.onHit();
                return;
            }
        }
    }


    private checkCoinCollision () {
        for (var i in Coin.list) {
            if (Tools.minusVector3(this.position, Coin.list[i].position).length() < 0.8) {
                Coin.list[i].destroy();
                this.onCoinCollision();
            }
        }
    }


    private onCoinCollision ():void {
        this.coins++;
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
