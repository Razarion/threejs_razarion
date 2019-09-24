import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";
import {ShallowWater} from "./shallow-water";

class TerrainTile {


    constructor(terrainTileJson, scene, staticGameConfigService) {
        this.scene = scene;

        this.grounds = [];
        for (let slopeConfigId in terrainTileJson.groundSlopeVertices) {
            let slopeSkeletonConfig = null;
            if (slopeConfigId != null) {
                slopeSkeletonConfig = staticGameConfigService.getSlopeSkeletonConfig(slopeConfigId);
            }
            let ground = new Ground(terrainTileJson.groundSlopeVertices[slopeConfigId], terrainTileJson.groundSlopeNorms[slopeConfigId], slopeSkeletonConfig);
            ground.generateMesh(this.scene);
            this.grounds.push(ground);
        }

        this.slopes = [];
        if (Array.isArray(terrainTileJson.terrainSlopeTiles)) {
            for (const terrainSlopeTile of terrainTileJson.terrainSlopeTiles) {
                let slope = new Slope(terrainSlopeTile, staticGameConfigService.getSlopeSkeletonConfig(terrainSlopeTile.slopeConfigId));
                slope.generateMesh(this.scene);
                this.slopes.push(slope);
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
    }

    update() {
        this.grounds.forEach(ground => ground.update());
        this.slopes.forEach(slope => slope.update());
        this.waters.forEach(water => water.update());
        this.shallowWaters.forEach(shallowWater => shallowWater.update());
    }

}

export {
    TerrainTile
}