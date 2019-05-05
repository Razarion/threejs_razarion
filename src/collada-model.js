import ColladaLoader from "three-collada-loader";

class ColladaModel {
    constructor(x, y,z, modelUrl, datGui) {
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
            scene.add(collada.scene);
        });
    }

}

export {
    ColladaModel
}