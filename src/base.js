import * as THREE from "three";
import {sawtooth} from "./utils";
import riGroundUrl from "./textures/RiGround.png";
import riGroundBmUrl from "./textures/RiGroundBm.png";
import grassTextureUrl from "./textures/GrassTexture.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import coastUrl from "./textures/Coast.png";
import underWaterUrl from "./textures/UnderWater.png";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";

class Base {
    static get EDGE_LENGTH() {
        return 8;
    }

    setupTextureScaled(textureUrl, textureScale, xLength, yLength) {
        let texture = new THREE.TextureLoader().load(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat = new THREE.Vector2(textureScale, textureScale * yLength / xLength);
        return texture;
    }

    setupTextureSimple(textureUrl) {
        let texture = new THREE.TextureLoader().load(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    setupWaterAnimation(animationDuration) {
        return sawtooth(Date.now(), animationDuration * 1000, 0);
    }

    imageTable(imageId) {
        switch (imageId) {
            case 1 : // Razar Industries Ground
                return riGroundUrl;
            case 2 : // Razar Industries BM
                return riGroundBmUrl;
            case 3 :
                return waterSurfaceTextureUrl;
            case 4 :
                return distortionMapUrl;
            case 5 :
                return bumpMapUrl;
            case 6 :
                return underWaterUrl;
            case 7 :
                return underWaterUrl; // TODO replace with bump map
        }
        console.error("Can nat find entry in image table for: " + imageId)
    }
}

export {
    Base,
}