import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import {promises as fs} from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {extract, extractExt, extractAll, convert} from './datasheets/extract-and-convert.mjs';

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node nw-datasheet-reader.mjs OUTPUT_FORMAT(scv|json) "PATH_TO_PAKS" MODE(default|ext|all)');
    console.log('Example: node nw-datasheet-reader.mjs csv "C:/Program Files (x86)/Steam/steamapps/common/New World Closed Beta" default');
    process.exit();
}

let outputFormat = args[0].toLowerCase();
const validOutputFormats = ['csv', 'json'];
if (!validOutputFormats.includes(outputFormat)) {
    console.log(`Invalid output format. Supported: ${validOutputFormats.join(', ')}`);
    process.exit(1);
}

let assetsPath = args[1].replace(/"/g, '').replace(/\\/g, '/');

if (assetsPath.endsWith('/')) {
    assetsPath = assetsPath.slice(0, -1);
}

let mode = args[2].toLowerCase();
const validModes = ['default', 'ext', 'all'];
if (!validModes.includes(mode)) {
    console.log(`Invalid mode. Supported: ${validModes.join(', ')}`);
    process.exit(1);
}

var recursive = require("recursive-readdir");

const assetFilePaths = await recursive(assetsPath);
const pakFilePaths = assetFilePaths.filter(file => file.endsWith(".pak"));
console.log(pakFilePaths);

const outPath = dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/') + '/out/';
await fs.mkdir(outPath, {recursive: true});

switch (mode) {
    case 'default':
        await extract(pakFilePaths, outPath);
        await convert(outPath, outputFormat);
        break;
    case 'ext':
        await extractExt(pakFilePaths, outPath);
        break;
    case 'all':
        await extractAll(pakFilePaths, outPath);
        break;
}
