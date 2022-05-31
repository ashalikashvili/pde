// Normalizes a longitude to be between -180 and 180
function getLongitude(lng) {
    const value = parseFloat(lng)
    if (value > 180) {
        return value - 360
    }

    if (value < -180) {
        return value + 360
    }

    return value
}

export function getMissionMarkers(geoJson, max, bounds) {
    if (!geoJson) {
        return []
    }

    return geoJson.features.filter(feature => {
        const [lat, lng] = [
            parseFloat(feature.properties.Center_latitude),
            getLongitude(feature.properties.Center_longitude)
        ]

        return (
            lat < bounds._northEast.lat
            && lat > bounds._southWest.lat 
            && lng < bounds._northEast.lng
            && lng > bounds._southWest.lng
        )
    }).slice(0, max).map(feature => {
        return {
            // Used as a key for the react component, nothing else :)
            id: feature.properties.id,
            position: [
                parseFloat(feature.properties.Center_latitude),
                // The coordinates of the boxes (polygons that describe the shape)
                // worked correctly, however the Central_longitude was offset by 360 degrees
                // for some reason, and the markers were showing up after the 
                // map repeated itself (so on the second round, thus 360 degrees around the globe)
                getLongitude(feature.properties.Center_longitude)
            ],
            thumbnail: feature.properties.browse_url,
            fullImage: feature.properties.image_url,
            
            start: new Date(feature.properties.UTC_start_time),
            end: new Date(feature.properties.UTC_stop_time),
            observationTime: feature.properties.Observation_time && new Date(feature.properties.Observation_time)
        }
    })
}

