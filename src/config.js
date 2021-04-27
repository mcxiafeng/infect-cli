const nconf = require("nconf");
const fs = require("fs");
const path = require("path");
nconf.file({ file: path.join(__dirname, "config.json") });

module.exports = {
    setupConfig: async function () {
        nconf.set("discordRPC", true);
        nconf.set("autoOpenMainClass", false);
        nconf.set("debug", false);
        nconf.save(function (err) {
            if (err) console.log(err);
        });
        console.log(`setupConfig successfully ${nconf.get("discordRPC")}`);
    },
    get: function (option) {
        return nconf.get(option);
    },
    set: function (option, text) {
        nconf.set(option, text);
        nconf.save(function (err) {
            if (err) console.log(err);
        });
    },
};
