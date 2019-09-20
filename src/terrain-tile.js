import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";
import {ShallowWater} from "./shallow-water";

class TerrainTile {


    constructor(terrainTileJson, scene, datGui, staticGameConfigService) {
        this.scene = scene;
        this.datGuiFolder = datGui.addFolder('Terrain Tile [' + terrainTileJson.indexX + ":" + terrainTileJson.indexY + "]");

        this.doGround(null, terrainTileJson.groundVertices, terrainTileJson.groundNorms);
        for (let slopeConfigId in terrainTileJson.groundSlopeVertices) {
            this.doGround(slopeConfigId, terrainTileJson.groundSlopeVertices[slopeConfigId], terrainTileJson.groundSlopeNorms[slopeConfigId]);
        }

        this.slopes = [];
        if (Array.isArray(terrainTileJson.terrainSlopeTiles)) {
            for (const terrainSlopeTile of terrainTileJson.terrainSlopeTiles) {
                let slope = new Slope(this.datGuiFolder, terrainSlopeTile, staticGameConfigService.getSlopeSkeletonConfig(terrainSlopeTile.slopeConfigId));
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

    doGround(slopeConfigId, groundVertices, groundNorms) {
        let ground = new Ground(this.datGuiFolder, slopeConfigId, groundVertices, groundNorms);
        ground.generateMesh(this.scene);
    }

    update() {
        this.slopes.forEach(slope => slope.update());
        this.waters.forEach(water => water.update());
        this.shallowWaters.forEach(shallowWater => shallowWater.update());
    }

}

export {
    TerrainTile
}