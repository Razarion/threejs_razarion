class StaticGameConfigService {
    constructor(staticGameConfigJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        this.slopeSkeletonConfigs = new Map();
        for (const slopeSkeletonConfig of this.staticGameConfigJson.slopeSkeletonConfigs) {
            const gui = datGui.addFolder('SlopeId: ' + slopeSkeletonConfig.internalName + ' (' + slopeSkeletonConfig.id + ')');
            slopeSkeletonConfig.wireframeSlope = false;
            gui.add(slopeSkeletonConfig, "wireframeSlope", 0, 1);
            if (slopeSkeletonConfig.hasOwnProperty('waterLevel')) {
                gui.add(slopeSkeletonConfig, 'waterFresnelOffset');
                gui.add(slopeSkeletonConfig, 'waterFresnelDelta', 0.0);
                gui.add(slopeSkeletonConfig, 'waterShininess');
                gui.add(slopeSkeletonConfig, 'waterSpecularStrength');
                gui.add(slopeSkeletonConfig, 'waterReflectionScale');
                gui.add(slopeSkeletonConfig, 'waterMapScale');
                gui.add(slopeSkeletonConfig, 'waterBumpMapDepth', 0, 1);
                gui.add(slopeSkeletonConfig, 'waterDistortionStrength');
                gui.add(slopeSkeletonConfig, 'waterTransparency', 0, 1);
                gui.add(slopeSkeletonConfig, 'waterAnimationDuration');
                gui.add(slopeSkeletonConfig, 'shallowWaterTextureScale');
                gui.add(slopeSkeletonConfig, 'shallowWaterDistortionStrength');
                gui.add(slopeSkeletonConfig, 'shallowWaterAnimation');
                slopeSkeletonConfig.wireframeWater = false;
                gui.add(slopeSkeletonConfig, "wireframeWater", 0, 1);
            }
            this.slopeSkeletonConfigs.set(slopeSkeletonConfig.id, slopeSkeletonConfig);
        }
    }

    getSlopeSkeletonConfig(slopeSkeletonConfigId) {
        return this.slopeSkeletonConfigs.get(slopeSkeletonConfigId);
    }
}

export {
    StaticGameConfigService
}