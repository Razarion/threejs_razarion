import {Ground} from "./ground";
import {Slope} from "./slope";
import {Water} from "./water";

class TerrainTile {


    constructor(terrainTileJson, scene, datGui) {
        this.scene = scene;
        this.datGuiFolder = datGui.addFolder('Terrain Tile [' + terrainTileJson.indexX + ":" + terrainTileJson.indexY + "]");

        this.doGround(null, terrainTileJson.groundVertices, terrainTileJson.groundNorms);
        for(let slopeId in terrainTileJson.groundSlopeVertices) {
            this.doGround(slopeId, terrainTileJson.groundSlopeVertices[slopeId], terrainTileJson.groundSlopeNorms[slopeId]);
        }

        this.slopes = [];
        for(let slopeId in terrainTileJson.terrainSlopeTiles) {
            let slope = new Slope(this.datGuiFolder, terrainTileJson.terrainSlopeTiles[slopeId]);
            slope.generateMesh(this.scene);
            this.slopes.push(slope);
        }

        //
        // this.water = new Water(datGui);
        // this.water.generateMesh(scene);
    }

    doGround(slopeId, groundVertices, groundNorms) {
        let ground = new Ground(this.datGuiFolder, slopeId, groundVertices, groundNorms);
        ground.generateMesh(this.scene);
    }

    update() {
        this.slopes.forEach(slope => slope.update())
        // this.water.update();
        // this.slope.update();
    }

}

export {
    TerrainTile
}