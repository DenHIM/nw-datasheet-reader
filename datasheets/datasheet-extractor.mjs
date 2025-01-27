import {open} from 'yauzl';
import workerpool from 'workerpool';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = workerpool.pool(__dirname + '/extract-worker.js', {workerType: 'process'});

let resultCount = 0;

export async function extractDatasheets(pakFilePaths, outPath, extensionPatterns) {
    const start = Date.now();

    let recordsPromises;

    process.stdout.write('Extracting datasheets..\r');
    recordsPromises = pakFilePaths.map( function(x) { return extractRelevantRecords(x, extensionPatterns); });

    const records = [].concat(...(await Promise.all(recordsPromises)));
    const groupedByPakFile =
        Object.entries(
            records.reduce((acc, entry) => {
                if (acc[entry.pakFile] == null) {
                    acc[entry.pakFile] = [];
                }
                acc[entry.pakFile].push(entry);
                return acc;
            }, {}));

    return new Promise(resolve => {
        for (let [pakFilePath, fileEntries] of groupedByPakFile) {
            const serializedParameters = JSON.stringify({pakFilePath, fileEntries, outPath});
            
            pool.exec('extractFromPak', [serializedParameters])
                .then(async () => {
                    resultCount += 1;
                    console.log('File ' + pakFilePath + '. Progress: ' + resultCount + '/' + groupedByPakFile.length);
                    if (resultCount === groupedByPakFile.length) {
                        console.log('File ' + pakFilePath + '. Extracting datasheets.. finished in ' + (Date.now() - start) + 'ms');
                        await pool.terminate();
                        resolve();
                    }
                });
        }
    });
}

async function extractRelevantRecords(filePath, extensionPatterns) {
    return new Promise(resolve => {
        const entries = [];

        open(filePath, {lazyEntries: true}, (err, zipFile) => {
            zipFile.readEntry();

            zipFile.on('entry', entry => {
                let fileNamePattern = new RegExp(extensionPatterns,"gm");
                if (fileNamePattern.test(entry.fileName)) {
                    entries.push({
                        pakFile: filePath,
                        offset: entry.relativeOffsetOfLocalHeader,
                        fileName: entry.fileName,
                        compressedSize: entry.compressedSize,
                        uncompressedSize: entry.uncompressedSize
                    });
                }
                zipFile.readEntry();
            });

            zipFile.once('end', () => resolve(entries));
        });
    });
}
