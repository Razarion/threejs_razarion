import ColladaLoader from "three-collada-loader-2";

class ColladaModel {
    constructor(x, y,z, modelUrl) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.modelUrl = modelUrl;
    }

    generateScene(scene) {
        let self = this;
        let loader = new ColladaLoader();
        loader.load(this.modelUrl, function (collada) {
            collada.scene.position.x = self.x;
            collada.scene.position.y = self.y;
            collada.scene.position.z = self.z;
            collada.scene.rotation.x = 0;
            collada.scene.rotation.y = 0;
            collada.scene.rotation.z = 0;

            collada.scene.castShadow = true;


            for (const child of collada.scene.children) {
                child.castShadow = true;
            }

            scene.add(collada.scene);
        });
    }

}

export {
    ColladaModel
}