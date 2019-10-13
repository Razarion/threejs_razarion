class StaticGameConfigService {
    constructor(staticGameConfigJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        // Add ground menu
        if (staticGameConfigJson.hasOwnProperty('groundSkeletonConfig')) {
            const gui = datGui.addFolder('Ground (Id: ' + staticGameConfigJson.groundSkeletonConfig.id + ')');
            this.addPhongMaterialConfig(gui, "Top Texture", staticGameConfigJson.groundSkeletonConfig.topTexture);
            if(staticGameConfigJson.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                this.addPhongMaterialConfig(gui, "Bottom Texture", staticGameConfigJson.groundSkeletonConfig.bottomTexture);
            }
            if(staticGameConfigJson.groundSkeletonConfig.hasOwnProperty('splatting')) {
                const splattingGui = gui.addFolder('Splatting');
                splattingGui.add(staticGameConfigJson.groundSkeletonConfig.splatting, 'scale', 0);
                splattingGui.add(staticGameConfigJson.groundSkeletonConfig, 'splattingScale2', 0);
                splattingGui.add(staticGameConfigJson.groundSkeletonConfig, 'splattingOffset', 0, 1);
                splattingGui.add(staticGameConfigJson.groundSkeletonConfig, 'splattingFadeThreshold', 0, 1);
            }
            staticGameConfigJson.groundSkeletonConfig.wireframe = false;
            gui.add(staticGameConfigJson.groundSkeletonConfig, "wireframe", 0, 1);
        }

        // Add slope menu
        this.slopeSkeletonConfigs = new Map();
        for (const slopeSkeletonConfig of this.staticGameConfigJson.slopeSkeletonConfigs) {
            const gui = datGui.addFolder('SlopeId: ' + slopeSkeletonConfig.internalName + ' (' + slopeSkeletonConfig.id + ')');

            gui.add(slopeSkeletonConfig, 'slopeTextureScale', 0);
            gui.add(slopeSkeletonConfig, 'slopeBumpMapDepth', 0.0, 1.0);
            gui.add(slopeSkeletonConfig, 'slopeShininess');
            gui.add(slopeSkeletonConfig, 'slopeSpecularStrength');
            if (slopeSkeletonConfig.hasOwnProperty('slopeFoamTextureId')) {
                gui.add(slopeSkeletonConfig, 'slopeFoamDistortionStrength');
                gui.add(slopeSkeletonConfig, 'slopeFoamAnimationDuration');
            }
            slopeSkeletonConfig.wireframeSlope = false;
            gui.add(slopeSkeletonConfig, "wireframeSlope", 0, 1);
            if (slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
                const groundrGui = gui.addFolder('Ground');
                groundrGui.add(slopeSkeletonConfig, 'groundTextureScale', 0);
                groundrGui.add(slopeSkeletonConfig, 'groundBumpMapDepth', 0.0, 1.0);
                groundrGui.add(slopeSkeletonConfig, 'groundShininess');
                groundrGui.add(slopeSkeletonConfig, 'groundSpecularStrength');
                slopeSkeletonConfig.wireframeSlopeGround = false;
                groundrGui.add(slopeSkeletonConfig, "wireframeSlopeGround", 0, 1);
            }
            if (slopeSkeletonConfig.hasOwnProperty('waterLevel')) {
                const waterGui = gui.addFolder('Water');
                waterGui.add(slopeSkeletonConfig, 'waterFresnelOffset');
                waterGui.add(slopeSkeletonConfig, 'waterFresnelDelta', 0.0);
                waterGui.add(slopeSkeletonConfig, 'waterShininess');
                waterGui.add(slopeSkeletonConfig, 'waterSpecularStrength');
                waterGui.add(slopeSkeletonConfig, 'waterReflectionScale');
                waterGui.add(slopeSkeletonConfig, 'waterMapScale');
                waterGui.add(slopeSkeletonConfig, 'waterBumpMapDepth', 0, 1);
                waterGui.add(slopeSkeletonConfig, 'waterDistortionStrength');
                waterGui.add(slopeSkeletonConfig, 'waterTransparency', 0, 1);
                waterGui.add(slopeSkeletonConfig, 'waterAnimationDuration');
                waterGui.add(slopeSkeletonConfig, 'shallowWaterTextureScale');
                waterGui.add(slopeSkeletonConfig, 'shallowWaterDistortionStrength');
                waterGui.add(slopeSkeletonConfig, 'shallowWaterAnimation');
                slopeSkeletonConfig.wireframeWater = false;
                waterGui.add(slopeSkeletonConfig, "wireframeWater", 0, 1);
            }
            this.slopeSkeletonConfigs.set(parseInt(slopeSkeletonConfig.id), slopeSkeletonConfig);
        }
    }

    addPhongMaterialConfig(gui, name, phongMaterialConfig) {
        const phongGui = gui.addFolder(name);
        phongGui.add(phongMaterialConfig.textureScaleConfig, 'scale', 0);
        phongGui.add(phongMaterialConfig, 'bumpMapDepth', 0);
        phongGui.add(phongMaterialConfig, 'shininess', 0);
        phongGui.add(phongMaterialConfig, 'specularStrength', 0);
    }

    getSlopeSkeletonConfig(slopeSkeletonConfigId) {
        return this.slopeSkeletonConfigs.get(parseInt(slopeSkeletonConfigId));
    }

    getGround() {
        return this.staticGameConfigJson.groundSkeletonConfig;
    }
}

export {
    StaticGameConfigService
}