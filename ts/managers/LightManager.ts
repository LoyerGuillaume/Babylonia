class LightManager {

    private directionalLight:BABYLON.DirectionalLight;
    private pointLight:BABYLON.PointLight;


    constructor (pScene:BABYLON.Scene) {
        this.initDirectionalLight(pScene);
        // this.initPointLight(pScene);
    }

    private initDirectionalLight (pScene:BABYLON.Scene):void {
        this.directionalLight          = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), pScene);
        this.directionalLight.diffuse  = new BABYLON.Color3(255 / 255, 186 / 255, 122 / 255);
        this.directionalLight.specular = new BABYLON.Color3(1, 1, 1);
    }

    private initPointLight (pScene:BABYLON.Scene):void {
        this.pointLight           = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 100, 0), pScene);
        this.pointLight.range     = 3000;
        this.pointLight.intensity = 10;
        this.pointLight.diffuse   = new BABYLON.Color3(24 / 255, 240 / 255, 1);
        this.pointLight.specular  = new BABYLON.Color3(1, 1, 1);
    }

}
