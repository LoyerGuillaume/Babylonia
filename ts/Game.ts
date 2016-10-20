class Game {

    private engine: BABYLON.Engine;
    public scene: BABYLON.Scene;

    constructor(canvasId: string) {

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);

        this.scene = null;

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this._run();
    }

    private _run() {

        this._initScene();

        this.scene.executeWhenReady(() => {

            // Remove loader
            var loader = <HTMLElement> document.querySelector("#loader");
            loader.style.display = "none";

            this._initGame();

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        });
    }

    private _initScene() {

        this.scene = new BABYLON.Scene(this.engine);

        let light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

    }


    private _initGame () {
        this.scene.debugLayer.show();

        var app:Babylonia = new Babylonia(this.scene, this.engine);
    }
}
