const commandExists = require("command-exists-promise");
const { readFileSync, Dir, mkdirSync } = require("fs");
const { get, set, setupConfig } = require("./config");
const pathM = require("path");
const { exec } = require("child_process");
let slash = "/";
let fsRegex = /^\//;
if (require("os").type() === "Windows_NT") {
    slash = "\\";
    fsRegex = /^[A-Z]:/;
}
let TMP = process.env.TMP || "/tmp";
TMP += slash + "Infect-Git";
const fs = require("fs");

let statuses = [
    "infected in 13.69 seconds lul",
    "best infect cli",
    "imagine getting backdoored",
    "qlutch go brrr",
    "infect.kaddon.wtf",
    "20+ plugins infected >:)",
    "mcforceop.com",
];

module.exports = {
    randomColor: function () {
        let color = "#";
        for (let i = 0; i < 6; i++) {
            const random = Math.random();
            const bit = (random * 16) | 0;
            color += bit.toString(16);
        }
        return color;
    },
    startup: async function () {
        help = process.argv.includes("--help") || process.argv.includes("-h");
        credits =
            process.argv.includes("-c") || process.argv.includes("--credits");

        if (help) {
            console.log("-h --help Opens this help gui");
            console.log("-c --credits Opens the credits");
            console.log("--auto answers Y to infecting and building");
            console.log(
                "Usage: Infectplugin [file location/github url] [options]"
            );
            return process.exit();
        } else if (credits) {
            console.log(
                `\nInfect was created by ${chalk.hex("#c93849")(
                    "kindled"
                )} // ${chalk.hex("#c93849")("_walk")}.`
            );
            console.log(
                `${chalk.hex("#c93849")("Cryogenetics")} // ${chalk.hex(
                    "#c93849"
                )(
                    "H H"
                )} improved Infect making it out of beta and added several planned features.\n`
            );
            return process.exit();
        }
        console.clear();
        figlet("infect", function (err, data) {
            console.log(chalk.hex("#c93849")(data));
        });
        process.title = "loading infect...";
        let dst = process.argv.filter((m) => !m.includes("--"))[2];
        // init path
        if (dst) {
            // Git repo
            if (dst.startsWith("https://") && dst.endsWith(".git")) {
                if (await commandExists("git")) {
                    console.log("Pulling repo....");
                    done = false;
                    let waiting = setInterval(() => {
                        done = false;
                    }, 10);
                    if (fs.existsSync(TMP))
                        await fs.rmdirSync(TMP, {
                            recursive: true,
                        }); // Clean previous builds if not already cleaned.
                    await mkdirSync(TMP);
                    //clone the repo
                    await exec(
                        `cd ${TMP} && git clone ${process.argv[2]}`,
                        (err, out, serr) => {
                            console.log(
                                `Finished in ${
                                    (+new Date() - startT) / 1000
                                } seconds`
                            );
                            let dir = serr
                                .split("Cloning into '")[1]
                                .split("'")[0];
                            basePath = TMP + slash + dir;
                            console.log("Finished pulling! TMP: " + basePath);
                            clearInterval(waiting);
                            done = true;
                        }
                    );
                }
                // C:\ and / checks
            } else if (fsRegex.exec(dst)) {
                basePath = dst;
                done = true;
                //url that doesn't end with git
            } else if (dst.startsWith("https://")) {
                return console.log("Malformed URI");
                // If arg is supplied but fits no criteria, interpret as a relative location
            } else {
                basePath = pathM.join(process.cwd(), dst);
                done = true;
            }
            // assume it is current directory.
        } else {
            path = process.cwd();
        }
        // init config
        if (get("discordRPC") == undefined) {
            await setupConfig();
        }
        if (get("discordRPC")) {
            client.updatePresence({
                state: statuses[Math.floor(Math.random() * statuses.length)],
                details: "currently initalizing...",
                startTimestamp: Date.now(),
                largeImageKey: "kaddon",
                largeImageText: "infect.kaddon.wtf",
                smallImageKey: "kindled",
                smallImageText: "made by kindled#5860",
                instance: true,
            });
            client.on("connected", () => {
                console.log(
                    `Thanks for using infect, ` +
                        chalk.hex("#c93849")(`${client.getUser().username}`) +
                        "!"
                );
                console.log("");
                done = true;
                rpcConnected = true;
            });
        } else {
            done = true;
        }
        process.on("unhandledRejection", (error) => {
            if (error.message) {
                if (error.message.includes("Could not connect")) {
                    done = true;
                    return;
                }
                if (error.message.includes("closed")) {
                    return;
                }
            } else {
                console.log(error);
            }
        });
    },
    whichLine: function (file, text) {
        return new Promise((resolve, reject) => {
            const file1 = readFileSync(file, { encoding: "utf8", flag: "r" });
            let lines = 0;
            let textArr = file1.split("\n");
            textArr.forEach((line) => {
                lines++;
                if (line.includes(text)) {
                    resolve(lines);
                }
            });
            reject("[utils] Could not find line. Reason:\nText not found");
        });
    },
    VSCInstalled: function () {
        return new Promise(async (resolve, reject) => {
            try {
                const exists = await commandExists("code");
                if (exists) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    VSCOpenFile: async function (path, line, column) {
        try {
            await exec(
                `start code -g "${path}_:${line}:${column ? column : 0}`
            );
        } catch (e) {
            console.log(e);
        }
    },
};
