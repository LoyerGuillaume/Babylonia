class CameraManager {

    constructor(pScene: BABYLON.Scene, pEngine:) {
        console.log('New Camera');
        this.init();
    }

    private init() {
        console.log('init camera');
        let camera = new BABYLON.ArcRotateCamera('', -1.5, 1, 100, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
    }

}
