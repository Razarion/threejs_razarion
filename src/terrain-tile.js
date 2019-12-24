import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";
import {ShallowWater} from "./shallow-water";
import {Shapes3D} from "./shape-3d";
import {Base} from "./base";
import * as THREE from "three";

class TerrainTile extends Base {


    constructor(terrainTileJson, scene, staticGameConfigService, threeJsShapeJson) {
        super();
        this.scene = scene;

        this.grounds = [];
        for (let slopeConfigId in terrainTileJson.groundSlopeVertices) {
            if (slopeConfigId == null) {
                continue
            }
            let slopeSkeletonConfig = staticGameConfigService.getSlopeSkeletonConfig(slopeConfigId);
            let groundSkeletonConfig = staticGameConfigService.getGround();
            if (slopeSkeletonConfig.hasOwnProperty('groundSkeletonConfig')) {
                groundSkeletonConfig = slopeSkeletonConfig.groundSkeletonConfig;
            }
            let ground = new Ground(terrainTileJson.groundSlopeVertices[slopeConfigId],
                terrainTileJson.groundSlopeNorms[slopeConfigId],
                groundSkeletonConfig);
            ground.generateMesh(this.scene);
            this.grounds.push(ground);
        }
        if (terrainTileJson.hasOwnProperty('groundVertices')) {
            let ground = new Ground(terrainTileJson.groundVertices,
                terrainTileJson.groundNorms,
                staticGameConfigService.getGround());
            ground.generateMesh(this.scene);
            this.grounds.push(ground);
        }

        this.slopes = [];
        if (Array.isArray(terrainTileJson.terrainSlopeTiles)) {
            for (const terrainSlopeTile of terrainTileJson.terrainSlopeTiles) {
                let slopeSkeletonConfig = staticGameConfigService.getSlopeSkeletonConfig(terrainSlopeTile.slopeSkeletonConfigId);
                if (terrainSlopeTile.hasOwnProperty('outerSlopeGeometry')) {
                    this.setupSlope(terrainSlopeTile.outerSlopeGeometry, slopeSkeletonConfig, staticGameConfigService.getGround());
                }
                if (terrainSlopeTile.hasOwnProperty('centerSlopeGeometry')) {
                    this.setupSlope(terrainSlopeTile.centerSlopeGeometry, slopeSkeletonConfig, null);
                }
                if (terrainSlopeTile.hasOwnProperty('innerSlopeGeometry')) {
                    let groundSkeletonConfig = staticGameConfigService.getGround();
                    if (slopeSkeletonConfig.hasOwnProperty('groundSkeletonConfig')) {
                        groundSkeletonConfig = slopeSkeletonConfig.groundSkeletonConfig;
                    }
                    this.setupSlope(terrainSlopeTile.innerSlopeGeometry, slopeSkeletonConfig, groundSkeletonConfig);
                }

            }
        }

        this.waters = [];
        this.shallowWaters = [];
        if (Array.isArray(terrainTileJson.terrainWaterTiles)) {
            for (const terrainWaterTile of terrainTileJson.terrainWaterTiles) {
                let water = new Water(terrainWaterTile, staticGameConfigService.getSlopeSkeletonConfig(terrainWaterTile.slopeConfigId));
                water.generateMesh(scene);
                this.waters.push(water);
                let shallowWater = new ShallowWater(terrainWaterTile, staticGameConfigService.getSlopeSkeletonConfig(terrainWaterTile.slopeConfigId));
                shallowWater.generateMesh(scene);
                this.shallowWaters.push(shallowWater);
            }
        }

        this.shape3Ds = [];
        if (Array.isArray(terrainTileJson.terrainTileObjectLists)) {
            for (const terrainTileObjectList of terrainTileJson.terrainTileObjectLists) {
                let terrainObjectConfig = staticGameConfigService.getTerrainObjectConfig(terrainTileObjectList.terrainObjectConfigId);
                let shape3D = new Shapes3D(staticGameConfigService.getShape3d(terrainObjectConfig.shape3DId), staticGameConfigService);
                this.shape3Ds.push(shape3D);
                terrainTileObjectList.nativeMatrices.forEach(m => {
                    let matrix4 = new THREE.Matrix4();
                    matrix4.set(
                        m[0], m[4], m[8], m[12],
                        m[1], m[5], m[9], m[13],
                        m[2], m[6], m[10], m[14],
                        m[3], m[7], m[11], m[15]
                    );
                    shape3D.generateMesh(scene, matrix4);
                });
            }
        }

    }

    setupSlope(slopeGeometry, slopeSkeletonConfig, groundSkeletonConfig) {
        let slope = new Slope(slopeGeometry, slopeSkeletonConfig, groundSkeletonConfig);
        slope.generateMesh(this.scene);
        this.slopes.push(slope);
    }

    update() {
        this.grounds.forEach(ground => ground.update());
        this.slopes.forEach(slope => slope.update());
        this.waters.forEach(water => water.update());
        this.shallowWaters.forEach(shallowWater => shallowWater.update());
        this.shape3Ds.forEach(shape3D => shape3D.update());
    }

}

export {
    TerrainTile
}