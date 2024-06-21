const fs = require('fs');
const path = require("path");
import { LocalizationCompiler } from './localizationCompiler';
const watch = require("node-watch");

let completeData: {[path: string]: LocalizationData} = {};
const resourcePath = "node_modules/~resource";
const generatorPath = "node_modules/~generator";

const folderPath = resourcePath + "/localization";

let watcher = watch([folderPath], {recursive: true})
watcher.on("change", (eventType ?: 'update' | 'remove' | undefined, filePath ?: string) => {
    if (!filePath) return;
    if (filePath.includes("localizationCompiler.ts")) {
        compiler = loadCompiler();
    }
    let match = /(node_modules[\\/])?(.*[\/|\\](.+)).ts/g.exec(filePath);
    if (eventType == "update" && filePath && match) {
        const curpath = match[2];
        const data = getDataFromFile(curpath + ".ts");
        if (data) {
            completeData[curpath] = data;
            combineData();
        }
    } else if (eventType == "remove" && match) {
        if (completeData.hasOwnProperty(match[2])) {
            delete completeData[match[2]];
            combineData();
        }
    }
})

// not really neccessarry:
watcher.on("error", (error: Error) => {
    console.log("\x1b[31m%s\x1b[0m", "Something went wrong!");
    console.log(error);
})

watcher.on("ready", () => {
    console.log("\x1b[32m%s\x1b[0m", "Ready!");
})

let compiler = loadCompiler();

function getDataFromFile(filePath: string): LocalizationData | undefined {
    if (!fs.existsSync("node_modules/" + filePath)){
        return;
    }
    delete require.cache[require.resolve(filePath)]
    let file = require(filePath);
    if (file["GenerateLocalizationData"]) {
        const localizationArr: LocalizationData = file["GenerateLocalizationData"]();
        return localizationArr;
    }
    return;
}

function combineData() {
    compiler.OnLocalizationDataChanged(completeData);
}

function loadCompiler(): LocalizationCompiler
{
    // Clear require cache
    delete require.cache[require.resolve("~generator/localizationCompiler")]
    // Require latest compiler version
    const compilerClass: new () => LocalizationCompiler = require("~generator/localizationCompiler").LocalizationCompiler;
    return new compilerClass();
}

const __getAllFiles = (dirPath: string, arrayOfFiles?: string[]) =>
{
    const files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles ?? []

    files.forEach(function (file)
    {
        if (fs.statSync(dirPath + "/" + file).isDirectory())
        {
            arrayOfFiles = __getAllFiles(path.join(dirPath, file), arrayOfFiles)
        } else
        {
            arrayOfFiles?.push(path.join(dirPath, file))
        }
    })

    return arrayOfFiles
}

const files = __getAllFiles(folderPath);

Promise.all(files.map(x =>
{
    const temp = fs.readFileSync(x);
    fs.writeFile(x, ' ', err =>
    {
        fs.writeFileSync(x, temp);
    });
}
))
