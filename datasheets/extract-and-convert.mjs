import {extractDatasheets} from './datasheet-extractor.mjs';
import {convertDatasheets} from './datasheet-converter.mjs';

export async function extract(pakFilePaths, outPath) {
    await extractDatasheets(pakFilePaths, outPath, '\.datasheet$');
}

export async function extractExt(pakFilePaths, outPath) {
    await extractDatasheets(pakFilePaths, outPath, '\.(datasheet|json|vegetation)$');
}

export async function extractAll(pakFilePaths, outPath) {
    await extractDatasheets(pakFilePaths, outPath, '\.[^.]+$');
}

export async function convert(outPath, format) {
    await convertDatasheets(outPath, format);
}
