import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";
import {ShallowWater} from "./shallow-water";

class TerrainTile {


    constructor(terrainTileJson, scene, datGui, staticGameConfigService) {
        this.scene = scene;
        this.datGuiFolder = datGui.addFolder('Terrain Tile [' + terrainTileJson.indexX + ":" + terrainTileJson.indexY + "]");

        this.doGround(null, terrainTileJson.groundVertices, terrainTileJson.groundNorms);
        for (let slopeId in terrainTileJson.groundSlopeVertices) {
            this.doGround(slopeId, terrainTileJson.groundSlopeVertices[slopeId], terrainTileJson.groundSlopeNorms[slopeId]);
        }

        this.slopes = [];
        for (const terrainSlopeTile of terrainTileJson.terrainSlopeTiles) {
            let slope = new Slope(this.datGuiFolder, terrainSlopeTile);
            slope.generateMesh(this.scene);
            this.slopes.push(slope);
        }

        this.waters = [];
        this.shallowWaters = [];
        for (const terrainWaterTile of terrainTileJson.terrainWaterTiles) {
            let water = new Water(terrainWaterTile, staticGameConfigService.getSlopeSkeletonConfig(terrainWaterTile.slopeId));
            water.generateMesh(scene);
            this.waters.push(water);
            let shallowWater = new ShallowWater(terrainWaterTile, staticGameConfigService.getSlopeSkeletonConfig(terrainWaterTile.slopeId));
            shallowWater.generateMesh(scene);
            this.shallowWaters.push(shallowWater);
        }
    }

    doGround(slopeId, groundVertices, groundNorms) {
        let ground = new Ground(this.datGuiFolder, slopeId, groundVertices, groundNorms);
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