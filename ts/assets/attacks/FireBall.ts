class FireBall extends AssetGraphic {

    public static list: FireBall[] = [];

    private static get ASSET_NAME()          :string { return 'elfe';};
    private static get SPEED()               :number { return 0.25;};
    private static get MAX_LIFE_TIME()       :number { return 120;};
    private static get RATIO_SCALE_PARTICLE():number { return 0.15;};

    private launcher:Player;

    private lifeTime:number;
    private direction:BABYLON.Vector3;
    private fireParticleSystem:BABYLON.ParticleSystem;
    private smokeParticleSystem:BABYLON.ParticleSystem;


    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super(FireBall.ASSET_NAME, pScene);
        FireBall.list.push(this);


        this.launcher           = pPlayer;
        this.position           = pPosition;
        this.rotationQuaternion = pRotation;
        this.addOffset();
        this.lifeTime           = 0;

        this.meshe.isVisible = false;
        this.initParticlesSystem();

        // this.scaling = new BABYLON.Vector3(1, 0.5, 1);
    }


    public get getLauncher():Player {
        return this.launcher;
    }


    private addOffset ():void {
        this.computeWorldMatrix(true);
        var movement  = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -1), this.getWorldMatrix());

        movement.subtractInPlace(this.position).normalize();
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }


    private initParticlesSystem ():void {
        var scene:BABYLON.Scene = this.getScene();
        this.initFireParticle(scene);
        this.initSmokeParticle(scene);
    }


    private initFireParticle (pScene:BABYLON.Scene):void {
        this.fireParticleSystem                 = new BABYLON.ParticleSystem('particleSystem', 3000, pScene);
        this.fireParticleSystem.particleTexture = new BABYLON.Texture("assets/Flare.png", pScene);
        this.fireParticleSystem.emitter         = this;

        this.fireParticleSystem.minEmitBox = new BABYLON.Vector3(-0.25, -0.25, -0.25);
        this.fireParticleSystem.maxEmitBox = new BABYLON.Vector3(0.25, 0.25, 0.25);

        this.fireParticleSystem.color1    = new BABYLON.Color4(1, 0.5, 0, 1.0);
        this.fireParticleSystem.color2    = new BABYLON.Color4(1, 0.5, 0, 1.0);
        this.fireParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        this.fireParticleSystem.minSize   = 1 * FireBall.RATIO_SCALE_PARTICLE;
        this.fireParticleSystem.maxSize   = 5 * FireBall.RATIO_SCALE_PARTICLE;

        this.fireParticleSystem.minLifeTime = 0.05;
        this.fireParticleSystem.maxLifeTime = 0.3;

        this.fireParticleSystem.emitRate = 1500;

        this.fireParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        this.fireParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        this.fireParticleSystem.direction1 = new BABYLON.Vector3(0, 0, 1);
        this.fireParticleSystem.direction2 = new BABYLON.Vector3(0, 0, 1);

        this.fireParticleSystem.minAngularSpeed = 0;
        this.fireParticleSystem.maxAngularSpeed = 0;

        this.fireParticleSystem.minEmitPower = 1;
        this.fireParticleSystem.maxEmitPower = 1;
        this.fireParticleSystem.updateSpeed  = 0.075;

        this.fireParticleSystem.start();
    }


    private initSmokeParticle (pScene:BABYLON.Scene):void {
        this.smokeParticleSystem                 = new BABYLON.ParticleSystem("particles", 1500, pScene);
        this.smokeParticleSystem.particleTexture = new BABYLON.Texture("assets/Flare.png", pScene);
        this.smokeParticleSystem.emitter         = this;
        this.smokeParticleSystem.minEmitBox      = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        this.smokeParticleSystem.maxEmitBox      = new BABYLON.Vector3(0.1, 0.1, 0.1);

        this.smokeParticleSystem.color1    = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.color2    = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        this.smokeParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

        this.smokeParticleSystem.minSize = 2 * FireBall.RATIO_SCALE_PARTICLE;
        this.smokeParticleSystem.maxSize = 5 * FireBall.RATIO_SCALE_PARTICLE;

        this.smokeParticleSystem.minLifeTime = 0.3;
        this.smokeParticleSystem.maxLifeTime = 0.5;

        this.smokeParticleSystem.emitRate = 750;

        this.smokeParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        this.smokeParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        this.smokeParticleSystem.direction1 = new BABYLON.Vector3(-0.5, -0.5, 2);
        this.smokeParticleSystem.direction2 = new BABYLON.Vector3(0.5, -0.5, 2);

        this.smokeParticleSystem.minAngularSpeed = 0;
        this.smokeParticleSystem.maxAngularSpeed = 0;

        this.smokeParticleSystem.minEmitPower = 0.5;
        this.smokeParticleSystem.maxEmitPower = 1.5;
        this.smokeParticleSystem.updateSpeed  = 0.060;

        this.smokeParticleSystem.start();
    }


    protected doActionNormal () {
        this.move();
        this.checkLifeTime();

        // this.meshe.rotation = this.meshe.rotation.add(BABYLON.Vector3.Up());
    }


    private move() {
        var v         = new BABYLON.Vector3(0, 0, -1);
        this.computeWorldMatrix(true);
        var m         = this.getWorldMatrix();
        var movement  = BABYLON.Vector3.TransformCoordinates(v, m);
        movement.subtractInPlace(this.position).normalize().scaleInPlace(FireBall.SPEED);
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }


    private checkLifeTime () {
        if (++this.lifeTime >= FireBall.MAX_LIFE_TIME) {
            this.destroy();
        }
    }


    public destroy () {
        super.destroy();
        FireBall.list.splice(FireBall.list.indexOf(this), 1);
    }
}
