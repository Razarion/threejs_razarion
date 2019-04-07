function js2Terrain(jsField) {
    let webGlField = [];
    for (let y = 0; y < jsField.length; y++) {
        for (let x = 0; x < jsField[0].length; x++) {
            if(webGlField[x] === undefined) {
                webGlField[x] = [];
            }
            webGlField[x][y] = jsField[jsField.length - y - 1][x];
        }
    }
    return webGlField;
}

function sawtooth(millis, durationMs, offsetMs) {
    let totMillis = millis + offsetMs;
    return (totMillis % durationMs) / durationMs; // Saegezahn
}

export {
    js2Terrain,
    sawtooth,
}