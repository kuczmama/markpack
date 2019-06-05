const fs = require('fs');
const path = require("path");

var args = process.argv.slice(2);

let ENTRY_PATH = "src/root.js";
let OUTPUT_PATH = "bundle/bundle.js";
let CONFIG = "";
let MODE = "development";

for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (/--config/.test(arg)) {
        if (arg.indexOf("=") !== -1) {
            let splitted = arg.split("=");
            CONFIG = splitted[1];
        } else {
            CONFIG = args[i + 1];
        }
    } else if (/--mode/.test(arg)) {
        if (arg.indexOf("=") !== -1) {
            let splitted = arg.split("=");
            MODE = splitted[1];
        } else {
            MODE = args[i + 1];
        }
    } else if (/--entry-path/.test(arg)) {
        if (arg.indexOf("=") !== -1) {
            let splitted = arg.split("=");
            ENTRY_PATH = splitted[1];
        } else {
            ENTRY_PATH = args[i + 1];
        }
    } else if (/--output-path/.test(arg)) {
        if (arg.indexOf("=") !== -1) {
            let splitted = arg.split("=");
            OUTPUT_PATH = splitted[1];
        } else {
            OUTPUT_PATH = args[i + 1];
        }
    }

}

function getNodeName(node) {
    if (node && node.id && node.id.type === "Identifier" && !!node.id.name) {
        // console.log("Found name!!", node.id.name);
        return node.id.name;
    } else {
        if (node.id) {
            return getNodeName(node.id);
        } else if (node.declaration) {
            return getNodeName(node.declaration);
        } else if (node.declarations) {
            let result = null;
            for (let i = 0; i < node.declarations.length; i++) {
                result = getNodeName(node.declarations[i]);
            }
            return result;
        } else {
            throw new Error(`Unable to get node name ${JSON.stringify(node, null, 2)}`);
        }
    }
    throw new Error(`Unable to get node name ${JSON.stringify(node, null, 2)}`);
}

function getUsedFunctions(root) {
    console.log(root.type);
    if (root.body) {
        for (let i = 0; i < root.body.length; i++) {
            getUsedFunctions(root.body[i]);
        }
    } else if (root.declaration) {
        getUsedFunctions(root.declaration);
    } else if (root.declarations) {
        for (let i = 0; i < root.declarations.length; i++) {
            getUsedFunctions(root.declarations[i]);
        }
    } else {
        return;
    }
}


const exportsDeclarations = {
    ExportDefaultDeclaration: true,
    DeclareExportDeclaration: true,
    DeclareExportAllDeclaration: true,
    ExportNamedDeclaration: true,
};

function createAsset(filename) {
    const dependencies = [];
    const namedExports = {}; // name => code
    const namedImports = {}; // name => boolean
    const usedFunctions = {};
    const usedVariables = {};

    let content = "";
    try {
        content = fs.readFileSync(filename, 'utf-8');
    } catch (err) {
        console.log("caught error reading " + filename);
        console.log(err);
    }

    console.log(filename);
    const ast = require("@babel/parser").parse(content, {
        sourceType: "module",
    });
    let code = "";
    getUsedFunctions(ast.program);
    ast.program.body.map((node) => {

        //CallExpression
        if (node.type === "ImportDeclaration") {
            if (node.specifiers && node.specifiers.length > 0) {
                node.specifiers.map((specifier) => {
                    let name = specifier.imported.name;
                    namedImports[name] = true;
                })
            }
            dependencies.push(node.source.value);
        } else if (exportsDeclarations[node.type]) {
            if (node.type === "ExportNamedDeclaration") {
                let declaration = node.declaration;
                let code = content.slice(declaration.start, declaration.end);
                let name = getNodeName(node);

                namedExports[name] = code;
            }
        } else {
            code += content.slice(node.start, node.end);
        }
    });


    // console.log("namedImports", namedImports);
    // console.log("namedExports", namedExports)
    return {
        filename,
        dependencies,
        code,
        namedExports,
        namedImports
    }

}

function bundle(entry) {
    const initialAsset = createAsset(entry);
    const assets = [initialAsset];
    let result = initialAsset.code + "\n";
    const loadedDependencies = {};
    const importsToLoad = {};
    for (let namedImport in initialAsset.namedImports) {
        importsToLoad[namedImport] = initialAsset;
    }

    let namedExports = {};

    loadedDependencies[initialAsset.filename] = true;


    for (const asset of assets) {
        const dirname = path.dirname(asset.filename);

        asset.dependencies.forEach(relativePath => {
            const extname = path.extname(asset.filename);
            const absolutePath = path.join(dirname, relativePath + extname);
            const childAsset = createAsset(absolutePath);
            namedExports = {
                ...namedExports,
                ...childAsset.namedExports
            };

            for (let namedImport in childAsset.namedImports) {
                importsToLoad[namedImport] = childAsset;
            }


            if (!loadedDependencies[childAsset.filename]) {
                childAsset.filename = relativePath + extname;

                result = childAsset.code + "\n" + result;
                assets.push(childAsset);
                loadedDependencies[childAsset.filename] = true;
            }
        });
    }
    for (let name in importsToLoad) {
        if (namedExports[name]) {
            result = namedExports[name] + "\n" + result;
        } else {
            throw new Error(`Unable to import '${name}' in ${importsToLoad[name].filename} '${name}' is never exported`);
        }
    }

    return result;
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function createBundle() {
    ensureDirectoryExistence(OUTPUT_PATH);
    if (fs.existsSync(OUTPUT_PATH)) {
        fs.unlinkSync(OUTPUT_PATH);
    }

    fs.appendFile(OUTPUT_PATH, bundle(ENTRY_PATH), err => {
        console.log(`${OUTPUT_PATH} created`);
    });
}

createBundle();

console.log("Watching for file changes...");

fs.watch('src', {
    recursive: true
}, function (event, filename) {
    if (filename) {
        console.log("File changed... Regenerating bundle")
        createBundle();

    } else {
        console.log('filename not provided');
    }
});