const GascoigneApp = require("../nodeApp/app.js");
let mockMainWindow = {
    on: function () { },
    webContents: { send: function () { } }
}
let app = new GascoigneApp(mockMainWindow);