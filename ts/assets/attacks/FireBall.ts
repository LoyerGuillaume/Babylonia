class FireBall extends AssetGraphic {

    public static list: FireBall[] = [];

    private static get ASSET_NAME():string { return 'elfe';};
    private static get SPEED():number { return 25;};
    private static get MAX_LIFE_TIME():number { return 60;};

    private launcher:Player;

    private lifeTime:number;
    private direction:BABYLON.Vector3;


    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super(FireBall.ASSET_NAME, pScene);
        FireBall.list.push(this);

        this.launcher           = pPlayer;
        this.position           = pPosition;
        this.rotationQuaternion = pRotation;
        this.lifeTime           = 0;

        this.initParticlesSystem();

        this.scaling = new BABYLON.Vector3(1, 0.5, 1);
    }


    public get getLauncher():Player {
        return this.launcher;
    }


    private initParticlesSystem ():void {
        var scene:BABYLON.Scene = this.getScene();
        // var fountain = BABYLON.Mesh.CreateBox("fountain", 1.0, scene);
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("assets/Flare.png", scene);
        particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
        particleSystem.emitter = this; // the starting object, the emitter, a box in this case.
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all From
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        // Size of each particle (random between...)
        particleSystem.minSize = 0.1 * 100;
        particleSystem.maxSize = 0.5 * 100;
        // Life time of each particle (random between...)
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        particleSystem.emitRate = 1000;

        particleSystem.manualEmitCount = 300;

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        //Set the gravity of all particles (not necessarily down)
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;


        particleSystem.start();

    }


    protected doActionNormal () {
        this.move();
        this.checkLifeTime();

        this.meshe.rotation = this.meshe.rotation.add(BABYLON.Vector3.Up());
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
