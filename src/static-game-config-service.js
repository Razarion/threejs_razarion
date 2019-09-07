class StaticGameConfigService {
    constructor(staticGameConfigJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        this.slopeSkeletonConfigs = new Map();
        for (const slopeSkeletonConfig of this.staticGameConfigJson.slopeSkeletonConfigs) {
            const gui = datGui.addFolder('SlopeId: ' + slopeSkeletonConfig.internalName + ' (' + slopeSkeletonConfig.id + ')');
            gui.add(slopeSkeletonConfig, 'waterShininess');
            gui.add(slopeSkeletonConfig, 'waterSpecularStrength');
            gui.add(slopeSkeletonConfig, 'waterReflectionScale');
            gui.add(slopeSkeletonConfig, 'waterMapScale');
            gui.add(slopeSkeletonConfig, 'waterBumpMapDepth', 0, 1);
            gui.add(slopeSkeletonConfig, 'waterDistortionStrength');
            gui.add(slopeSkeletonConfig, 'waterTransparency', 0, 1);
            gui.add(slopeSkeletonConfig, 'waterAnimationDuration');
            gui.add(slopeSkeletonConfig, 'shallowWaterTextureScale');
            slopeSkeletonConfig.wireframeSlope = false;
            gui.add(slopeSkeletonConfig, "wireframeSlope", 0, 1);
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