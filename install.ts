const fs = require('fs');
const child = require('child_process');

interface packageSnippet {
	scripts?: {[name: string]: string};
	_moduleAliases?: {[name: string]: string};
	dependencies?: {[name: string]: string};
	devDependencies?: {[name: string]: string};
}

// define package insertions
const devScripts = [
	["dev:runlocalizationWatcher", "ts-node -P node_modules/~resource/tsconfig.json node_modules/~generator/fsWatcher.ts"]
]
const initSCript = ["init", "link-module-alias && ts-node node_modules/~generator/init.ts"]
const aliases = [
	["~resource", "resource"],
	["~generator", "node_modules/@cabin-icarus/tooltip_generator"]
]

// Check package.json
function CheckPackage() {
	console.log("Tooltip Searching for package.json...");
	const rootPath = "../../../";
	const scriptPath = "./";

	// adjust existing package.json
	if (fs.existsSync(rootPath + "package.json")) {
		console.log("Checking existing package.json...")
		const goalPackageRaw = fs.readFileSync(rootPath + "package.json");
		const goalPackage = JSON.parse(goalPackageRaw.toString()) as packageSnippet;

		// check script part
		let hasDev = false;
		let hasInit = false;
		if (goalPackage.scripts) {
			let scripts = goalPackage.scripts;
			for (const name in scripts) {
				if (name == "dev") {
					if (scripts[name] !== "run-p dev:*") {
						console.log("\x1b[31m%s\x1b[0m", "Unexpected 'dev' script in package.json!");
						return;
					}
					hasDev = true;
				}
				if (name == "init") {
					if (scripts[name] !== "link-module-alias && node node_modules/~generator/init.ts") {
						console.log("\x1b[31m%s\x1b[0m", "Unexpected 'init' script in package.json!");
						return;
					}
					hasInit = true;
				}
			}
		} else {
			goalPackage.scripts = {};
		}
		if (!hasDev) {
			goalPackage.scripts["dev"] = "run-p dev:*";
		}
		for (const [name, cmd] of devScripts) {
			goalPackage.scripts[name] = cmd;
		}
		if (!hasInit) {
			goalPackage.scripts["init"] = "link-module-alias && ts-node node_modules/~generator/init.ts";
		}

		// check module aliases
		let hasResource = false;
		let hasGenerator = false;
		if (goalPackage._moduleAliases) {
			for (const name in goalPackage._moduleAliases) {
				if (name == "~resource") {
					hasResource = true;
				}
				if (name == "~generator") {
					hasGenerator = true;
				}
			}
		} else {
			goalPackage._moduleAliases = {};
		}
		if (!hasResource) {
			goalPackage._moduleAliases["~resource"] = "resource";
		}
		if (!hasGenerator) {
			goalPackage._moduleAliases["~generator"] = "node_modules/@cabin-icarus/tooltip_generator";
		}

		const origPackagePath = scriptPath + "package.json";
		if (fs.existsSync(origPackagePath)) {
			const origPackageRaw = fs.readFileSync(scriptPath + "package.json");
			const origPackage = JSON.parse(origPackageRaw.toString()) as packageSnippet;

			if (!goalPackage.dependencies) {
				goalPackage.dependencies = {};
			}
			if (!goalPackage.devDependencies) {
				goalPackage.devDependencies = {};
			}
			origPackage.dependencies!["@cabin-icarus/tooltip_generator"] = "latest"

			for (const name in origPackage.devDependencies!) {
				if (!goalPackage.devDependencies.hasOwnProperty(name) && !goalPackage.dependencies.hasOwnProperty(name)) {
					goalPackage.devDependencies[name] = origPackage.devDependencies[name];
				}
			}
			for (const name in origPackage.dependencies!) {
				if (!goalPackage.dependencies.hasOwnProperty(name) && !goalPackage.devDependencies.hasOwnProperty(name)) {
					goalPackage.dependencies[name] = origPackage.dependencies[name];
				}
			}
		}

		console.log("Creating backup of package.json...");
		fs.copyFileSync(rootPath + "package.json", rootPath + "backup_package.json");
		console.log("Adjusting package.json...");
		let data = JSON.stringify(goalPackage, undefined, 2);
		fs.writeFileSync(rootPath + "package.json", data);

	// copy the default package.json if there wasn't any previously
	} else {
		console.log("\x1b[31m%s\x1b[0m", "\n项目根目录没有package.json文件")
		return;
	}
	console.log("Running final installation, please wait for the success message...")
	child.exec("yarn install", {
		cwd: rootPath,
	}, (err, stdout) => {
		if (err) {
			console.log("\x1b[31m%s\x1b[0m", "Something went wrong...\n\n");
			console.log(err);
		} else {
			console.log("\x1b[32m%s\x1b[0m", "package.json adjustments successful!");
		}
	})
}

CheckPackage();