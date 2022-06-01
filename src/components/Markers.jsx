import React, { useState, useEffect } from 'react'
import {
    Marker,
    Popup,
    useMap
} from 'react-leaflet'
import MissionPreview from './MissionPreview'
import { getMissionMarkers } from '../lib/helpers'

const MAX_MARKERS = 500

const Markers = ({ geoJson }) => {
    const map = useMap();
    const [bounds, setBounds] = useState({
        _northEast: { lat: 0, lng: 0 },
        _southWest: { lat: 0, lng: 0 },
    })

    useEffect(() => {
        const updateBounds = (event) => {
            setBounds(map.getBounds())
        }

        setBounds(map.getBounds())

        map.on('dragend', updateBounds)
        map.on('zoomend', updateBounds)
        return () => {
            map.off('dragend', updateBounds)
            map.off('zoomend', updateBounds)
        }
    }, [map])

    return (
        getMissionMarkers(geoJson, MAX_MARKERS, bounds).map((mission) => (
            <Marker
                key={mission.id}
                position={mission.position}
                alt={!mission.thumbnail && 'no-preview'}
            >
                <Popup>
                    <MissionPreview mission={mission} />
                </Popup>
            </Marker>
        ))
    )
}

export default Markers