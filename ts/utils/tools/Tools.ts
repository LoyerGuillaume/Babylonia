interface bumpParams {
    prim2D   :BABYLON.Prim2DBase,
    scale?   :number,
    duration?:number,
    times?   :number
}

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


    public static clampNumber(value:number, min:number, max:number):number {
        return Math.max(Math.min(value, min), max);

    }


    public static getRandomRotation ():number {
        return Math.floor(Math.random() * 360);
    }


    public static minusVector3 (pVector:BABYLON.Vector3, pVectorMinus:BABYLON.Vector3):BABYLON.Vector3 {
        return new BABYLON.Vector3(pVector.x - pVectorMinus.x, pVector.y - pVectorMinus.y, pVector.z - pVectorMinus.z)
    }


    public static intersectOnHorizontalPlan (pVector:BABYLON.Vector3, pVectorMinus:BABYLON.Vector3, collisionOffset:number = 1):boolean {
        var vect1:BABYLON.Vector3 = pVector.clone();
        var vect2:BABYLON.Vector3 = pVectorMinus.clone();
        vect1.y = 0;
        vect2.y = 0;
        return Tools.minusVector3(vect1, vect2).length() < collisionOffset;
    }


    public static lerp (pInitialValue:number, pTargetValue:number, pRatio:number):number {
        return (1 - pRatio) * pInitialValue + pRatio * pTargetValue;
    }


    private static bumpInterval;


    public static bump (params:bumpParams) {
        if (typeof Tools.bumpInterval !== 'undefined') {
            clearInterval(Tools.bumpInterval);
        }
        params.times    = params.times    || 1;
        params.duration = params.duration || 250;
        params.scale    = params.scale    || 2;

        var duration:number = 0;
        var durationRatio:number = 0;

        var cycleDuration:number = params.duration / (params.times * 2);
        var cycleCount:number = 0;
        var grow:boolean = true;

        var initialScale:number = params.prim2D.scale;
        var targetScale:number = params.scale;

        Tools.bumpInterval = setInterval(function () {
            durationRatio = duration / params.duration;

            if (cycleCount >= cycleDuration) {
                grow = !grow;
                cycleCount = 0;
            }

            if (grow) {
                params.prim2D.scale = Tools.lerp(initialScale, targetScale, cycleCount / cycleDuration);
            } else {
                params.prim2D.scale = Tools.lerp(targetScale, initialScale, cycleCount / cycleDuration);
            }

            cycleCount += 16;
            duration   += 16;
            if (duration >= params.duration) {
                clearInterval(Tools.bumpInterval);
                params.prim2D.scale = 1;
            }
        }, 16);
    }

}
