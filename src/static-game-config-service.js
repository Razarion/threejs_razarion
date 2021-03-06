import {VertexContainer} from "./vertex-container";

class StaticGameConfigService {
    constructor(staticGameConfigJson, threeJsShapeJson, datGui) {
        this.staticGameConfigJson = staticGameConfigJson;
        // Add ground menu
        if (staticGameConfigJson.hasOwnProperty('groundSkeletonConfig')) {
            const gui = datGui.addFolder('Ground (Id: ' + staticGameConfigJson.groundSkeletonConfig.id + ')');
            this.addPhongMaterialGui(gui, "Top Texture", staticGameConfigJson.groundSkeletonConfig.topTexture);
            if (staticGameConfigJson.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                this.addPhongMaterialGui(gui, "Bottom Texture", staticGameConfigJson.groundSkeletonConfig.bottomTexture);
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
        this.slopeConfigs = new Map();
        let slopesDatGui = datGui.addFolder("Slopes");
        for (const slopeConfig of this.staticGameConfigJson.slopeConfigs) {
            const gui = slopesDatGui.addFolder(slopeConfig.internalName + ' (' + slopeConfig.id + ')');

            gui.add(slopeConfig, 'slopeTextureScale', 0);
            gui.add(slopeConfig, 'slopeBumpMapDepth', 0.0, 1.0);
            gui.add(slopeConfig, 'slopeShininess');
            gui.add(slopeConfig, 'slopeSpecularStrength');
            if (slopeConfig.hasOwnProperty('slopeFoamTextureId')) {
                gui.add(slopeConfig, 'slopeFoamDistortionStrength');
                gui.add(slopeConfig, 'slopeFoamAnimationDuration');
            }
            slopeConfig.wireframeSlope = false;
            gui.add(slopeConfig, "wireframeSlope", 0, 1);
            if (slopeConfig.hasOwnProperty('groundSkeletonConfig')) {
                const groundGui = gui.addFolder('Ground');
                this.addPhongMaterialGui(groundGui, "Top Texture", slopeConfig.groundSkeletonConfig.topTexture);
                if (slopeConfig.groundSkeletonConfig.hasOwnProperty('bottomTexture')) {
                    this.addPhongMaterialGui(groundGui, "Bottom Texture", slopeConfig.groundSkeletonConfig.bottomTexture);
                }
                if (slopeConfig.groundSkeletonConfig.hasOwnProperty('splatting')) {
                    const splattingGui = groundGui.addFolder('Splatting');
                    splattingGui.add(slopeConfig.groundSkeletonConfig.splatting, 'scale', 0);
                    splattingGui.add(slopeConfig.groundSkeletonConfig, 'splattingScale2', 0);
                    splattingGui.add(slopeConfig.groundSkeletonConfig, 'splattingOffset', 0, 1);
                    splattingGui.add(slopeConfig.groundSkeletonConfig, 'splattingFadeThreshold', 0, 1);
                }
                slopeConfig.groundSkeletonConfig.wireframe = false;
                groundGui.add(slopeConfig.groundSkeletonConfig, "wireframe", 0, 1);
            }
            if (slopeConfig.hasOwnProperty('outerSplatting')) {
                this.addSplattingGui(gui, 'Outer Splatting', slopeConfig.outerSplatting);
            }
            if (slopeConfig.hasOwnProperty('innerSplatting')) {
                this.addSplattingGui(gui, 'Inner Splatting', slopeConfig.innerSplatting);
            }
            if (slopeConfig.hasOwnProperty('waterLevel')) {
                const waterGui = gui.addFolder('Water');
                waterGui.add(slopeConfig, 'waterFresnelOffset');
                waterGui.add(slopeConfig, 'waterFresnelDelta', 0.0);
                waterGui.add(slopeConfig, 'waterShininess');
                waterGui.add(slopeConfig, 'waterSpecularStrength');
                waterGui.add(slopeConfig, 'waterReflectionScale');
                waterGui.add(slopeConfig, 'waterMapScale');
                waterGui.add(slopeConfig, 'waterBumpMapDepth', 0, 1);
                waterGui.add(slopeConfig, 'waterDistortionStrength');
                waterGui.add(slopeConfig, 'waterTransparency', 0, 1);
                waterGui.add(slopeConfig, 'waterAnimationDuration');
                waterGui.add(slopeConfig, 'shallowWaterTextureScale');
                waterGui.add(slopeConfig, 'shallowWaterDistortionStrength');
                waterGui.add(slopeConfig, 'shallowWaterAnimation');
                slopeConfig.wireframeWater = false;
                waterGui.add(slopeConfig, "wireframeWater", 0, 1);
            }
            this.slopeConfigs.set(parseInt(slopeConfig.id), slopeConfig);
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
                    if (!vertexContainer.hasOwnProperty('bumpMapDepth')) {
                        vertexContainer.bumpMapDepth = 0.0;
                    }
                    matGui.add(vertexContainer, 'bumpMapDepth', 0.0).name('Bump Map Depth');
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

    addPhongMaterialGui(gui, name, phongMaterialConfig) {
        const phongGui = gui.addFolder(name);
        phongGui.add(phongMaterialConfig.textureScaleConfig, 'scale', 0);
        phongGui.add(phongMaterialConfig, 'bumpMapDepth', 0);
        phongGui.add(phongMaterialConfig, 'shininess', 0);
        phongGui.add(phongMaterialConfig, 'specularStrength', 0);
    }

    addSplattingGui(gui, name, slopeGroundSplattingConfig) {
        let outerSplatting = gui.addFolder(name);
        outerSplatting.add(slopeGroundSplattingConfig, 'scale', 0);
        outerSplatting.add(slopeGroundSplattingConfig, 'fadeThreshold', 0, 1);
        outerSplatting.add(slopeGroundSplattingConfig, 'offset', 0, 1);
        outerSplatting.add(slopeGroundSplattingConfig, 'impact', 0);
    }

    getSlopeConfig(slopeConfigId) {
        return this.slopeConfigs.get(parseInt(slopeConfigId));
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