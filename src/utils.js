const commandExists = require("command-exists-promise");
const { readFileSync, Dir, mkdirSync } = require("fs");
const { get, set, setupConfig } = require("./config");
const pathM = require("path");
const { exec } = require("child_process");
let slash = "/";
if (require("os").type() === "Windows_NT") slash = "\\";
let TMP = process.env.TMP || "/tmp";
const fs = require("fs");

let statuses = ["infected in 13.69 seconds lul", "best infect cli", "imagine getting backdoored", "qlutch go brrr", "infect.kaddon.wtf", "20+ plugins infected >:)", "mcforceop.com"]

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
        if (help) {
            console.log("-h --help Opens this help gui");
			console.log("-c --credits Opens the credits");
            console.log("--auto answers Y to infecting and building");
            console.log(
                "Usage: Infectplugin [file location/github url] [options]"
            );
            return process.exit();
        } else if(process.argv.includes("-c") || process.argv.includes("--credits")){
			console.log(`\nInfect was created by ${chalk.hex("#c93849")("kindled")} // ${chalk.hex("#c93849")("_walk")}.`)
			console.log(`${chalk.hex("#c93849")("Cryogenetics")} // ${chalk.hex("#c93849")("H H")} improved Infect making it out of beta and added several planned features.\n`);
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
            if (dst.startsWith("https://") && dst.endsWith(".git")) {
                if (await commandExists("git")) {
                    console.log("Pulling repo....");
                    done = false;
                    let waiting = setInterval(() => {
                        done = false;
                    }, 10);
                    if (fs.existsSync(TMP + slash + "Infect-Git"))
                        await fs.rmdirSync(TMP + slash + "Infect-Git", {
                            recursive: true,
                        });
                    await mkdirSync(TMP + slash + "Infect-Git");
                    await exec(
                        `cd ${TMP + slash + "Infect-Git"} && git clone ${
                            process.argv[2]
                        }`,
                        (err, out, serr) => {
                            console.log(
                                `Finished in ${
                                    (+new Date() - startT) / 1000
                                } seconds`
                            );
                            let dir = serr
                                .split("Cloning into '")[1]
                                .split("'")[0];
                            console.log(dir);
                            path = TMP + slash + "Infect-Git" + slash + dir;
                            console.log(path);
                            console.log("Finished pulling!");
                            clearInterval(waiting);
                            done = true;
                        }
                    );
                }
            } else {
                if (process.argv.filter((m) => !m.includes("--"))[2]) {
                    path = pathM.join(
                        process.cwd(),
                        process.argv.filter((m) => !m.includes("--"))[2]
                    );
                } else if (dst.startsWith("https://")) {
                    return console.log("Malformed URI");
                } else {
                    path = process.cwd();
                }
            }
        } else {
            (async () => {
                path = process.cwd();
            })();
        }
        // init config
        if (get("discordRPC") == undefined) {
            await setupConfig();
        }
        if (get("discordRPC")) {
            client.updatePresence({
                state: statuses[Math.floor(Math.random()*statuses.length)],
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
