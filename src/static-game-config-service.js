class StaticGameConfigService {
    constructor(staticGameConfigJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        this.slopeSkeletonConfigs = new Map();
        for (const slopeSkeletonConfig of this.staticGameConfigJson.slopeSkeletonConfigs) {
            const gui = datGui.addFolder('SlopeId: ' + slopeSkeletonConfig.internalName + ' (' + slopeSkeletonConfig.id + ')');
            if (slopeSkeletonConfig.hasOwnProperty('groundTextureId')) {
                const groundrGui = gui.addFolder('Ground');
                groundrGui.add(slopeSkeletonConfig, 'groundTextureScale', 0);
                groundrGui.add(slopeSkeletonConfig, 'groundBumpMapDepth', 0.0, 1.0);
                groundrGui.add(slopeSkeletonConfig, 'groundShininess');
                groundrGui.add(slopeSkeletonConfig, 'groundSpecularStrength');
            }
            slopeSkeletonConfig.wireframeSlope = false;
            gui.add(slopeSkeletonConfig, "wireframeSlope", 0, 1);
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

    getSlopeSkeletonConfig(slopeSkeletonConfigId) {
        return this.slopeSkeletonConfigs.get(parseInt(slopeSkeletonConfigId));
    }
}

export {
    StaticGameConfigService
}