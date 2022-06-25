import config from './config.json' assert { type: 'json' };
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'node:fs';
import fetch from 'node-fetch';
import { RateLimit } from 'async-sema';
import csvToJson from 'csvtojson/index.js'

const FIELDS = config['fields'];
const LIMIT = RateLimit(config['rate-limit']);
const RESULTS_DIR = config['results-directory'];
const DIRECT = config['direct-json'];
let datafile;

/**
 * Function to methodically identify all image URLs in the input data
 */
function extractImages() {
    datafile.forEach(entry => {
        let ref = entry.Reference;
        console.log(ref);
        console.log("\n");

        FIELDS.forEach(field => {
            //incrementing variable to differentiate multiple images in same field
            let i = 0;

            let URLs = entry[field].split(", ");
            URLs.forEach(url => {
                if (url !== "") processImage(url, ref, field, i++);
            });
        });
    });
}

/**
 * An extremely multi-threaded function to request images from the server and pipe them to the filesystem
 * @param {string} URL The URL of the image to request
 * @param {string} ref The reference of the job the image belongs to
 * @param {string} name The name of the field the image is in
 * @param {int} i The differentiator between multiple images in the same field
 */
async function processImage(URL, ref, name, i) {
    await LIMIT(); //the server will kick us if we request too fast

    console.log(URL);
    let res = await fetch(URL);

    let fileStream = createWriteStream(`${RESULTS_DIR}/${ref}-${name}-${i}.jpg`);

    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
}

//Note: Direct JSON support assumes there are no arrays in the fields
if (DIRECT) {
    datafile = JSON.parse(readFileSync('input.json', 'utf8'));
} else {
    datafile = await csvToJson().fromFile('input.csv');
}

if (!existsSync(RESULTS_DIR)) {
    mkdirSync(RESULTS_DIR);
}

extractImages();