import './App.css'
import { useEffect, useState, useCallback } from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
    GeoJSON,
    useMap
} from 'react-leaflet'


import { getMissionMarkers } from './lib/helpers'

import Api from './lib/Api'
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
import Filters from './components/Filters'
import MissionPreview from './components/MissionPreview'

const { BaseLayer } = LayersControl

const MAX_MARKERS = 500

const Markers = ({ geoJson }) => {
    const map = useMap();
    const [bounds, setBounds] = useState({
        _northEast: { lat: 0, lng: 0 },
        _southWest: { lat: 0, lng: 0 },
    })

    useEffect(() => {
        const onDragEnd = (event) => {
            setBounds(map.getBounds())
        }

        setBounds(map.getBounds())

        map.on('dragend', onDragEnd)
        return () => map.off('dragend', onDragEnd)
    }, [])

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

const App = () => {
    const [geoJson, setGeoJson] = useState(null)
    const [filteredGeoJson, setFilteredGeoJson] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(Date.now())
    window.geoJson = geoJson;

    useEffect(() => {
        const load = async () => {
            const geoJson = await Api.getMissions()
            setGeoJson(geoJson)
            setFilteredGeoJson(geoJson)
            setLastUpdated(Date.now())
        }

        load()
    }, [])

    const setFilteredGeoJsonWrapper = useCallback((filteredGeoJson) => {
        setFilteredGeoJson(filteredGeoJson)
        setLastUpdated(Date.now())
    }, [])

    return (
        <MapContainer center={[0, 0]} zoom={5}>
            <LayersControl>
                <BaseLayer checked name='SatelliteMap'>
                    <TileLayer
                        attribution='<a href="https://www.openplanetary.org/opm" target="blank">OpenPlanetaryMap</a>'
                        url='http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/celestia_mars-shaded-16k_global/{z}/{x}/{y}.png'
                        tms={true}
                        scroll
                        maxNativeZoom={5}
                    />
                    <BaseLayer name='VectorMap'>
                        <TileLayer
                            attribution='<a href="https://www.openplanetary.org/opm" target="blank">OpenPlanetaryMap</a>'
                            url='https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-2/all/{z}/{x}/{y}.png'
                            tms={false}
                            scroll
                        />
                    </BaseLayer>
                </BaseLayer>
            </LayersControl>
            <Filters geoJson={geoJson} setFilteredGeoJson={setFilteredGeoJsonWrapper} />
            {filteredGeoJson && (
                <GeoJSON data={{
                    ...filteredGeoJson,
                    features: filteredGeoJson.features.slice(0, MAX_MARKERS)
                }} key={lastUpdated} />
            )}

            <Markers geoJson={filteredGeoJson} />
        </MapContainer>
    )
}

export default App


