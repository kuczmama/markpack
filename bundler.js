const fs = require('fs');
const path = require("path");

const exportsDeclarations = {
    ExportDefaultDeclaration: true,
    DeclareExportDeclaration: true,
    DeclareExportAllDeclaration: true,
    ExportNamedDeclaration: true,
}

function createAsset(filename) {
    const dependencies = [];
    const content = fs.readFileSync(filename, 'utf-8');

    const ast = require("@babel/parser").parse(content, {
        sourceType: "module",
    });
    let code = "";
    ast.program.body.map((node) => {
        if (node.type === "ImportDeclaration") {
            dependencies.push(node.source.value)
        } else if (exportsDeclarations[node.type]) {
            // skip
        } else {
            code += content.slice(node.start, node.end);
        }
    })

    return {
        filename,
        dependencies,
        code
    }

}

function bundle(entry) {
    const initialAsset = createAsset(entry);
    const assets = [initialAsset];
    let result = initialAsset.code;
    for (const asset of assets) {
        const dirname = path.dirname(asset.filename);

        asset.dependencies.forEach(relativePath => {
            const extname = path.extname(asset.filename);
            const absolutePath = path.join(dirname, relativePath + extname);
            const childAsset = createAsset(absolutePath);
            childAsset.filename = relativePath + extname;

            result = childAsset.code + result;
            assets.push(childAsset);
        });
    }

    return result;
}


if (fs.existsSync("./bundle.js")) {
    fs.unlinkSync("./bundle.js");
}

fs.appendFile("bundle.js", bundle("example/entry.js"), err => {
    if (err) throw err;
    console.log("bundle.js created");
});