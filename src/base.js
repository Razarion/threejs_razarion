import * as THREE from "three";
import {sawtooth} from "./utils";
import riGroundUrl from "./textures/RiGround.png";
import riGroundBmUrl from "./textures/RiGroundBm.png";
import riSlopeUrl from "./textures/RiSlope.png";
import riSlopeBmUrl from "./textures/RiSlopeBm.png";
import groundTopUrl from "./textures/GrassTexture.png";
import groundTopBmUrl from "./textures/GrassBm.png";
import groundBottomUrl from "./textures/GroundBottom.png";
import groundBottomBmUrl from "./textures/GroundBottomBm.png";
import groundSplattingUrl from "./textures/GroundSplatting.png";
import coastUrl from "./textures/Coast.png";
import coastBumpMapUrl from "./textures/CoastBumpMap.png";
import coastFoamUrl from "./textures/Foam.png";
import coastFoamDistortionUrl from "./textures/FoamDistortion.png";
import underWaterUrl from "./textures/UnderWater.png";
import waterSurfaceTextureUrl from "./textures/WaterCloudReflection.png";
import distortionMapUrl from "./textures/WaterDistortion.png";
import bumpMapUrl from "./textures/WaterBumpMap.png";
import shallowWaterUrl from "./textures/ShallowWaterFoam.png";
import shallowWaterStencilUrl from "./textures/WaterStencil.png";
import shallowWaterDistortionUrl from "./textures/FoamDistortion.png";
import bushTextureUrl from "./models/Plant.png";
import palmLeavesTextureUrl from "./models/PalmTree3.png";
import palmTrunkTextureUrl from "./models/PalmTree3.png";
import palm1LeavesTextureUrl from "./models/PalmTree01Leaf.png";
import palm1TrunkTextureUrl from "./models/PalmTree01Trunk.png";
import rock1TextureUrl from "./models/Rock1Texture.png";
import rock1BmUrl from "./models/Rock1Bm.png";
import rock2Url from "./models/Rock2.png";
import rock2BmUrl from "./models/Rock2Bm.png";
import textureHelpers512Url from "./models/TextureHelpers512.png";
import textureHelpers512BmUrl from "./models/TextureHelpersBm512.png";
import noTextureUrl from "./models/TextureHelpers512.png";
import transparentHelperTextureUrl from "./models/TransparenceHelper.png";

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
            case 10 : // Slope distortion
                return coastFoamDistortionUrl;
            case 11 : // Slope foam distortion
                return coastFoamUrl;
            case 12 : // Razar Industries Slope
                return riSlopeUrl;
            case 13 : // Razar Industries Slope bump map
                return riSlopeBmUrl;
            case 14 : // Ground Top
                return groundTopUrl;
            case 15 : // Ground Top Slope bump map
                return groundTopBmUrl;
            case 16 : // Ground Bottom
                return groundBottomUrl;
            case 17 : // Ground Bottom Slope bump map
                return groundBottomBmUrl;
            case 18 : // Ground Splatting
                return groundSplattingUrl;
            case 19 : // Slope Splatting
                return groundSplattingUrl; // TODO own image
            case 20 : // Terrain Object bush
                return bushTextureUrl;
            case 21 : // Palm Tree trunk
                return palmLeavesTextureUrl;
            case 22 : // Palm Tree leaves
                return palmTrunkTextureUrl;
            case 23 : // Rock 1 Texture
                return rock1TextureUrl;
            case 24 : // Rock 1 Bm
                return rock1BmUrl;
            case 25 : // shallow Water
                return shallowWaterUrl;
            case 26 : // shallow Water stencil
                return shallowWaterStencilUrl;
            case 27 : // shallow water distortion
                return shallowWaterDistortionUrl;
            case 28 : // Helper
                return textureHelpers512Url;
            case 29 : // Helper Bm
                return textureHelpers512BmUrl;
            case 30 : // Helper
                return rock2Url;
            case 31 : // Helper Bm
                return rock2BmUrl;
            case 33 : // Palm Tree trunk bm
                return groundTopBmUrl;
            case 34 : // Palm Tree leaves bm
                return groundTopBmUrl;
            case 35 : // Palm Tree 1 trunk
                return palm1TrunkTextureUrl;
            case 36 : // Palm Tree 1 leaves
                return palm1LeavesTextureUrl;
            case 37 : // Palm Tree 1 trunk bm
                return groundTopBmUrl;
            case 38 : // Palm Tree 1 leaves bm
                return groundTopBmUrl;
        }
        console.warn("Can not find entry in image table for: " + imageId);
        return noTextureUrl;
    }
}

export {
    Base,
}