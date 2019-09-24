import * as THREE from "three";
import {sawtooth} from "./utils";
import riGroundUrl from "./textures/RiGround.png";
import riGroundBmUrl from "./textures/RiGroundBm.png";
import grassTextureUrl from "./textures/GrassTexture.png";
import coastUrl from "./textures/Coast.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import coastFoamUrl from "./textures/Foam.png";
import coastFoamDistortionUrl from "./textures/FoamDistortion.png";
import underWaterUrl from "./textures/UnderWater.png";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";
import noTextureUrl from "./models/textures/TextureHelpers512.png";

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
            case 3 : // Water reflection
                return waterSurfaceTextureUrl;
            case 4 :  // Water distortion
                return distortionMapUrl;
            case 5 : // Water bump map
                return bumpMapUrl;
            case 6 : // Water ground
                return underWaterUrl;
            case 7 : // Water ground  bump map
                return underWaterUrl; // TODO replace with bump map
            case 8 : // Slope coast texture
                return coastUrl;
            case 9 : // Slope coast bump map
                return coastBumpMapUrl;
            case 10 : // Slope foam distortion
                return coastFoamDistortionUrl;
            case 11 : // Slope foam distortion
                return coastFoamUrl;
        }
        console.error("Can nat find entry in image table for: " + imageId)
        return noTextureUrl;
    }
}

export {
    Base,
}