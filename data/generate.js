// This file generates a large JSON file containing all of the
// shapes from all of the .shp files in the files/ directory
const fs = require('fs');
const shp = require('shpjs');

const map = {
    'CenterLat': 'Center_latitude',
    'CenterLon': 'Center_longitude',
    'ProductId': 'id',
    'InstHostId': 'mission',
    'InstId': 'inst',
    'UTCstart': 'UTC_start_time',
    'UTCend': 'UTC_stop_time',
    'ProdType': 'type',
    'LabelURL': 'image_url'
}

class Generator {
    constructor() {
        this.files = fs.readdirSync('./files').filter(file => file.endsWith('.zip'));
        this.finalGeoJson = {
            type: 'FeatureCollection',
            features: []
        }
    }

    async parseAndMerge(fileName) {
        const lineStart = (fileName + ':').padEnd(32, ' ');

        const filePath = `./files/${fileName}`;
        const content = fs.readFileSync(filePath);
        console.log(`${lineStart} Loaded into memory`);

        const geojson = await shp(content);
        console.log(`${lineStart} Got GeoJSON. ${geojson.features.length} features`)

        let added = 0;
        const ids = {}
        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i];
            const id = feature.properties.ProductId;
            if (id in ids) {
                continue;
            }

            ids[id] = true;

            // Copy over some of the properties
            const properties = {};
            for (const oldKey in map) {
                const newKey = map[oldKey];
                properties[newKey] = feature.properties[oldKey];
            }

            feature.properties = properties;
            this.finalGeoJson.features.push(feature);
            added++;
        }

        console.log(`${lineStart} Merged in ${added} features\n\n`)
    }

    async run() {
        for (let i = 0; i < this.files.length; i++) {
            const name = this.files[i];
            await this.parseAndMerge(name);
        }

        console.log('Writing a merged JSON file...');
        const str = JSON.stringify(this.finalGeoJson, null, 4);
        console.log('Generated a file of size', (str.length / 1024 / 1024).toFixed(2), 'MB');
        fs.writeFileSync('data.json', str);
    }
}

const generator = new Generator();
generator.run();