interface IAttackUpgrade {
    lifeTimeUp?   : number,
    damageUp?     : number,
    malusSpeedUp? : number
}

class PlayerAttack extends AssetGraphic {

    public static list:PlayerAttack[] = [];
    private launcher:Player;

    protected maxLifeTime:number;
    private lifeTime:number = 0;

    protected collisionRange:number = 1;
    protected damageDeal:number = 1;

    protected static _upgrade:IAttackUpgrade = {
        lifeTimeUp  : 0,
        damageUp    : 0,
        malusSpeedUp: 0
    };

    constructor (pAssetName:string, pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pPlayer, upgrade:IAttackUpgrade) {
        super(pAssetName, pScene);
        PlayerAttack.list.push(this);

        this.maxLifeTime += upgrade.lifeTimeUp;
        this.damageDeal  += upgrade.damageUp;

        this.launcher = pPlayer;
        this.position = pPosition.clone();
    }


    public static upgrade (params:IAttackUpgrade, classUpgrade:IAttackUpgrade) {
        for (var index in params) {
            params[index] = params[index] || 0;
            classUpgrade[index] += params[index];
        }
    }


    get collisionSize():number {
        return this.collisionRange;
    };

    get damage():number {
        return this.damageDeal;
    };

    get debuff() {
        return this.malus;
    }

    protected malus (pEnemy:Enemy) {}


    protected doActionNormal () {
        this.checkLifeTime();
    }


    public get getLauncher():Player {
        return this.launcher;
    }


    protected checkLifeTime () {
        if (++this.lifeTime >= this.maxLifeTime) {
            this.destroy();
        }
    }


    public onHit () {
        this.destroy();
    }


    public destroy () {
        super.destroy();
        PlayerAttack.list.splice(PlayerAttack.list.indexOf(this), 1);
    }
}
