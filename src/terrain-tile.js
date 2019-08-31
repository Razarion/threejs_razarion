import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";

class TerrainTile {


    constructor(terrainTileJson, scene, datGui) {
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
        for (const terrainWaterTile of terrainTileJson.terrainWaterTilea) {
            let water = new Water(this.datGuiFolder, terrainWaterTile);
            water.generateMesh(scene);
            this.waters.push(water);
        }
    }

    doGround(slopeId, groundVertices, groundNorms) {
        let ground = new Ground(this.datGuiFolder, slopeId, groundVertices, groundNorms);
        ground.generateMesh(this.scene);
    }

    update() {
        this.slopes.forEach(slope => slope.update())
        this.waters.forEach(water => water.update())
    }

}

export {
    TerrainTile
}