class CameraManager {

    constructor(pScene: BABYLON.Scene, pEngine: BABYLON.Engine) {
        // console.log('New Camera');
        this.init(pScene, pEngine);
    }

    private init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine) {
        // console.log(pEngine);
        let camera = new BABYLON.ArcRotateCamera('', -1.5, 1, 100, new BABYLON.Vector3(0, 0, 0), pScene);
        camera.attachControl(pEngine.getRenderingCanvas());
    }

}
