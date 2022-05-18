import './App.css'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, GeoJSON } from 'react-leaflet'
import { geosearch } from 'esri-leaflet-geocoder'
import L from 'leaflet'
import mars from './data/mars.json'
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
import Filters from './components/Filters'
const { BaseLayer } = LayersControl

const App = () => {
    const [geoJson, setGeoJson] = useState(null)
    const [filteredGeoJson, setFilteredGeoJson] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(Date.now())

    useEffect(() => {
        console.log('sending request')
        setTimeout(() => {
            setGeoJson(mars)
            setFilteredGeoJson(mars)
            setLastUpdated(Date.now())
        }, 1000)
    }, [])

    return (
        <MapContainer center={[0, 0]} zoom={3}>
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
            <Filters geoJson={geoJson} setFilteredGeoJson={(filteredGeoJson) => {
                setFilteredGeoJson(filteredGeoJson)
                setLastUpdated(Date.now())
            }} />
            <GeoJSON data={filteredGeoJson} key={lastUpdated} />

            {getMarkers(filteredGeoJson).map((marker) => (
                <Marker position={marker.position} key={marker.id}>
                    <Popup>
                        <img
                            src={marker.thumbnail}
                            className='popup-img'
                        />
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

function getMarkers(geoJson) {
    if (!geoJson) {
        return []
    }

    return geoJson.features.map((feature) => {
        return {
            // Used as a key for the react component, nothing else :)
            id: feature.properties.id,
            position: [
                parseFloat(feature.properties.Center_latitude),
                // The coordinates of the boxes (polygons that describe the shape)
                // worked correctly, however the Central_longitude was offset by 360 degrees
                // for some reason, and the markers were showing up after the 
                // map repeated itself (so on the second round, thus 360 degrees around the globe)
                parseFloat(feature.properties.Center_longitude) - 360
            ],
            thumbnail: feature.properties.browse_url
        }
    })
}

export default App


