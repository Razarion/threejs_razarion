import {VertexContainer} from "./vertex-container";

class StaticGameConfigService {
    constructor(staticGameConfigJson, threeJsShapeJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        // Add ground menu
        if (staticGameConfigJson.hasOwnProperty('groundSkeletonConfig')) {
            const gui = datGui.addFolder('Ground (Id: ' + staticGameConfigJson.groundSkeletonConfig.id + ')');
            this.addPhongMaterialConfig(gui, "Top Texture", staticGameConfigJson.groundSkeletonConfig.topTexture);
            if (staticGameConfigJson.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                this.addPhongMaterialConfig(gui, "Bottom Texture", staticGameConfigJson.groundSkeletonConfig.bottomTexture);
            }
            if (staticGameConfigJson.groundSkeletonConfig.hasOwnProperty('splatting')) {
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
        let slopesDatGui = datGui.addFolder("Slopes");
        for (const slopeSkeletonConfig of this.staticGameConfigJson.slopeSkeletonConfigs) {
            const gui = slopesDatGui.addFolder(slopeSkeletonConfig.internalName + ' (' + slopeSkeletonConfig.id + ')');

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
            if (slopeSkeletonConfig.hasOwnProperty('groundSkeletonConfig')) {
                const groundGui = gui.addFolder('Ground');
                this.addPhongMaterialConfig(groundGui, "Top Texture", slopeSkeletonConfig.groundSkeletonConfig.topTexture);
                if (slopeSkeletonConfig.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                    this.addPhongMaterialConfig(groundGui, "Bottom Texture", slopeSkeletonConfig.groundSkeletonConfig.bottomTexture);
                }
                if (slopeSkeletonConfig.groundSkeletonConfig.hasOwnProperty('splatting')) {
                    const splattingGui = groundGui.addFolder('Splatting');
                    splattingGui.add(slopeSkeletonConfig.groundSkeletonConfig.bottomTexture.splatting, 'scale', 0);
                    splattingGui.add(slopeSkeletonConfig.groundSkeletonConfig, 'splattingScale2', 0);
                    splattingGui.add(slopeSkeletonConfig.groundSkeletonConfig, 'splattingOffset', 0, 1);
                    splattingGui.add(slopeSkeletonConfig.groundSkeletonConfig, 'splattingFadeThreshold', 0, 1);
                }
                slopeSkeletonConfig.wireframeSlopeGround = false;
                groundGui.add(slopeSkeletonConfig, "wireframeSlopeGround", 0, 1);
            }
            let outerSplatting = gui.addFolder('Outer Splatting');
            outerSplatting.add(slopeSkeletonConfig, 'slopeSplattingScale1', 0);
            outerSplatting.add(slopeSkeletonConfig, 'slopeSplattingScale2', 0);
            outerSplatting.add(slopeSkeletonConfig, 'slopeSplattingFadeThreshold', 0, 1);
            outerSplatting.add(slopeSkeletonConfig, 'slopeSplattingOffset', 0, 1);
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

        // Shape 3d
        this.shapes3d = new Map();
        this.vertexConatinerBuffers = new Map();
        threeJsShapeJson.forEach(composite => {
            this.shapes3d[composite.shape3D.dbId] = composite.shape3D;
            composite.vertexContainerBuffer.forEach(vertexContainerBuffer => {
                this.vertexConatinerBuffers[vertexContainerBuffer.key] = vertexContainerBuffer;
            });
        });

        // Add terrain objects
        this.terrainObjectConfigs = new Map();
        let terrainObjectsDatGui = datGui.addFolder("Terrain Objects");
        for (const terrainObjectConfig of this.staticGameConfigJson.terrainObjectConfigs) {
            const tOgui = terrainObjectsDatGui.addFolder(terrainObjectConfig.internalName + ' (' + terrainObjectConfig.id + ')');
            tOgui.add(terrainObjectConfig, 'radius');
            this.terrainObjectConfigs[terrainObjectConfig.id] = terrainObjectConfig;
            let shape3D = this.shapes3d[terrainObjectConfig.shape3DId];
            let shape3DGui = tOgui.addFolder('Shape3D Id: ' + terrainObjectConfig.shape3DId + ' (' + shape3D.internalName + ')');
            this.vertexContainers = [];
            shape3D.element3Ds.forEach(element3D => {
                element3D.vertexContainers.forEach(vertexContainer => {
                    let matGui = shape3DGui.addFolder(vertexContainer.materialName + " (" + vertexContainer.materialId + ")");
                    // matGui.add(this.material.uniforms.uBumpMapDepth, 'value', 0.0, 2.0).name('BumpMap Depth');
                    matGui.add(vertexContainer, 'shininess', 0.0).name('Shininess');
                    matGui.add(vertexContainer.specular, 'r', 0.0).name('SpecularStrength');
                    if (!vertexContainer.hasOwnProperty('alphaCutout')) {
                        vertexContainer.alphaCutout = 0.0;
                    }
                    matGui.add(vertexContainer, 'alphaCutout', 0.0, 1.0).name('Alpha Cutout (0:Off)');
                    vertexContainer.wireframe = false;
                    matGui.add(vertexContainer, "wireframe", 0.0, 1.0).name('Wireframe');
                });
            });
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

    getTerrainObjectConfig(terrainObjectConfigId) {
        return this.terrainObjectConfigs[terrainObjectConfigId];
    }

    getShape3d(id) {
        return this.shapes3d[id];
    }

    getVertexConatinerBuffer(key) {
        return this.vertexConatinerBuffers[key];
    }
}

export {
    StaticGameConfigService
}