const fs = require('fs')
const shp = require('shpjs')
const path = require('path')

const map = {
    'CenterLat':'Center_latitude',
    'CenterLon':'Center_longitude',
    'EastLon':'Easternmost_longitude',
    'WestLon':'Westernmost_longitude',
    'MaxLat':'Maximum_latitude',
    'MinLat':'Minimum_latitude',
    'EmAngle':'Emission_angle',
    'InAngle':'Incidence_angle',
    'PhAngle':'Phase_angle',
    'SolLong':'Solar_longitude',
    'Target':'Target_name',
    'ProductId':'id',
    'InstHostId':'mission',
    'InstId':'inst',
    'UTCstart':'UTC_start_time',
    'UTCend':'UTC_stop_time',
    'ProdType':'type',
    'LabelURL':'image_url'
}

function getShape(filePath) {
    const content = fs.readFileSync(filePath)
    console.log(`${filePath}: Loaded into memory`)
    shp(content).then(geojson => {
        console.log(`${filePath}: Got GeoJSON. ${geojson.features.length} features`)

        const ids = {}

        geojson.features = geojson.features.filter(feature => {
            const id = feature.properties.ProductId
            if (id in ids) {
                return false
            }

            ids[id] = true
            return true
        })

        geojson.features.forEach(feature => {
            const properties = {}
            for (const oldKey in map) {
                const newKey = map[oldKey]
                properties[newKey] = feature.properties[oldKey]
            }
            feature.properties = properties
        })

        console.log(`${filePath}: Mutated GeoJSON. ${geojson.features.length} features now`)
        const json = JSON.stringify(geojson)
        console.log(`${filePath}: Generated JSON string`)
        fs.writeFileSync(filePath.replace('.zip', '.json'), json)
        console.log(`${filePath}: Wrote JSON file`)
    })
}

// getShape('files/mars_mro_ctx_edr_c0a.zip')
getShape('files/mars_mro_ctx_edr_na.zip')