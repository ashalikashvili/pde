import './App.css'
import { useEffect, useState, useCallback } from 'react'
import {
    MapContainer,
    TileLayer,
    LayersControl
} from 'react-leaflet'

import GeoJSON from './components/GeoJSON'

import Api from './lib/Api'
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'

import Filters from './components/Filters'
import Markers from './components/Markers'

const { BaseLayer } = LayersControl

const App = () => {
    const [loaded, setLoaded] = useState(false)
    const [geoJson, setGeoJson] = useState(null)
    const [filteredGeoJson, setFilteredGeoJson] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(Date.now())
    window.geoJson = geoJson;

    useEffect(() => {
        const load = async () => {
            const geoJson = await Api.getMissions()
            setLoaded(true)
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
            {!loaded && (
                <div id="loader">
                    <div className="spinner"></div>
                    <span>Loading the data...</span>
                </div>
            )}
            <Filters geoJson={geoJson} setFilteredGeoJson={setFilteredGeoJsonWrapper} />
            {filteredGeoJson && (
                <GeoJSON data={filteredGeoJson} lastUpdated={lastUpdated} />
            )}

            <Markers geoJson={filteredGeoJson} />
        </MapContainer>
    )
}

export default App


