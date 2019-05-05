import ColladaLoader from "three-collada-loader";

class ColladaModel {
    constructor(x, y, modelUrl, datGui) {
        this.modelUrl = modelUrl;
    }

    generateScene(scene) {
        let loader = new ColladaLoader();
        loader.load(this.modelUrl, function (collada) {
            scene.add(collada.scene);
        });
    }

}

export {
    ColladaModel
}