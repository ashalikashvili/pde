import React, { useMemo, useEffect, useState } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'

const MAX_FEATURES = 500

const SmartGeoJSON = ({ props, lastUpdated, data }) => {
    const map = useMap();
    const [bounds, setBounds] = useState({
        _northEast: { lat: 0, lng: 0 },
        _southWest: { lat: 0, lng: 0 },
    })
    const [internalLastUpdated, setInternalLastUpdated] = useState(lastUpdated)

    useEffect(() => {
        const updateBounds = (event) => {
            setBounds(map.getBounds())
            setInternalLastUpdated(Date.now())
        }

        setBounds(map.getBounds())

        map.on('dragend', updateBounds)
        map.on('zoomend', updateBounds)
        return () => {
            map.off('dragend', updateBounds)
            map.off('dragend', updateBounds)
        }
    }, [map])

    useEffect(() => {
        setInternalLastUpdated(lastUpdated)
    }, [lastUpdated])

    const features = useMemo(() => {
        if (!bounds || !bounds.contains) {
            return []
        }

        // Check if the polygon is within the bounds of the map
        return data.features.filter(feature => {
            let coordinates = feature.geometry.coordinates;
            if (coordinates.length === 1) {
                coordinates = coordinates[0];
            }
            
            try {
                for (let i = 0; i < coordinates.length; i++) {
                    const [lng, lat] = coordinates[i]
                    if (bounds.contains({ lat, lng }) === false) {
                        return false
                    }
                }
            } catch (e) {
                return false
            }

            return true
        })
    }, [data, bounds])

    return (
        <GeoJSON data={{
            ...data,
            features: features.slice(0, MAX_FEATURES)
        }} key={internalLastUpdated} />
    )
}

export default SmartGeoJSON