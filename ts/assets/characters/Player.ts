class Player extends Character {

    public static list:Player[] = [];
 
    public controller:Controller;
    private static get ASSET_NAME()             :string { return 'ChaWitch';};
    private static get MOVE_SPEED()             :number { return 0.005;};
    private static get ROTATION_SPEED()         :number { return 0.3;};
    private static get INVICIBILITY_TIME()      :number { return 120;};
    private static get ANGLE_SPECIAL_ATTACK_1() :number { return 10;};
    private static get BOUNCING_RATIO()         :number { return 0.1;};
    private static get BOUNCING_FREQUENCE()     :number { return 15;};
    public static get LIFE_POINT()              :number { return 1;};

    private score:number;
    private coins:number;
    private startYPositionMeshe:number;
    private frameCount:number = 0;

    private attacks:{} = {
        attack: {
            name            : 'BabyBoule',
            key             : 'A',
            cooldown        : 30,
            attackFunction  : this.shotOneFireBall,
            countFrameAttack: 0
        },
        special_1: {
            name            : 'BabySpread',
            key             : 'Z',
            cooldown        : 120,
            attackFunction  : this.shotThreeFireBalls,
            countFrameAttack: 0
        }
    };



    constructor (pScene:BABYLON.Scene, pPosition:BABYLON.Vector3) {
        super(pScene, Player.ASSET_NAME, pPosition, Player.LIFE_POINT);
        Player.list.push(this);

        this.score          = 0;
        this.coins          = 0;
        this.controller     = new ControllerKeyboard();
        this.startYPositionMeshe = this.meshe.position.y;

        this.initAnimation();
        this.initCollision();
        this.initEvents();

        UIManager.initCapacities(this.attacks);
    }


    public getPlayerIndex ():number {
        return Player.list.indexOf(this);
    }


    public get getScore ():number {
        return this.score;
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
            UIManager.setScore(this.score);
        }
    }


    protected doActionNormal (deltaTime:number) {
        this.addFrameAttack();
        this.animationMovement(deltaTime);

        this.move(deltaTime);
        this.checkAttack();

        if (this.isInvicible) {
            super.invicibilityCooldown(Player.INVICIBILITY_TIME);
        } else {
            this.checkEnemyCollision();
        }

        this.checkCoinCollision();
        this.frameCount++;
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


    private animationMovement (deltaTime:number):void {
        this.meshe.position.y = this.startYPositionMeshe + Math.sin(this.frameCount / Player.BOUNCING_FREQUENCE - 0.5) * Player.BOUNCING_RATIO;
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


    private checkEnemyCollision () {
        for (var i in Enemy.list) {
            if (this.meshe.intersectsMesh(Enemy.list[i], false)) {
                BEvent.emit(new PlayerEvent(PlayerEvent.HIT));
                super.onHit();
                return;
            }
        }
    }


    private checkCoinCollision () {
        for (var i in Coin.list) {
            if (this.meshe.intersectsMesh(Coin.list[i], false)) {
                Coin.list[i].destroy();
                this.onCoinCollision();
            }
        }
    }


    private onCoinCollision ():void {
        this.coins++;
        BEvent.emit(new PlayerEvent(PlayerEvent.GOT_COIN, {
            coins: this.coins
        }))
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
