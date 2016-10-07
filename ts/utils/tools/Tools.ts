class Tools {

    public static forEach(pElems: any[], pAction: (elem: any) => void) {
        var lLen = pElems.length;
        for (var i = 0; i < lLen; i++) {
            pAction(pElems[i]);
        }
    }

    public static displayEllipsoid = (scene, elem) => {
        var material = scene.getMaterialByName("__ellipsoidMat__") as BABYLON.StandardMaterial;
        if (! material) {
            material = new BABYLON.StandardMaterial("__ellipsoidMat__", scene);
            material.wireframe = true;
            material.emissiveColor = BABYLON.Color3.Green();
            material.specularColor = BABYLON.Color3.Black();
        }

        var s = BABYLON.Mesh.CreateSphere("__ellipsoid__", 8, 1, scene);
        s.scaling = elem.ellipsoid.clone();
        s.scaling.y *= 4;
        s.scaling.x *= 2;
        s.scaling.z *= 2;
        s.material = material;
        s.parent = elem;
        s.computeWorldMatrix(true);
    };

}
