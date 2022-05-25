import React, { useState, useEffect } from "react"
import Select from "react-select"
import Control from "react-leaflet-custom-control"

function getOptions(geoJson, filters) {
    let missions = []
    let types = []
    let insts = []

    const features = geoJson.features
    for (let i = 0; i < features.length; i++) {
        const { mission, type, inst } = features[i].properties

        // Always add missions to total missions. this way if a user
        // user can always select multiple missions
        if (missions.indexOf(mission) === -1) {
            missions.push(mission)
        }

        // After pushing a unique mission value to the missions array
        // now check if user selected some mission. In that case we have to only show
        // types/insts that match the selection missions
        if (filters.missions.length > 0 && filters.missions.indexOf(mission) === -1) {
            continue
        }

        if (filters.types.length > 0 && filters.types.indexOf(type) === -1) {
            continue
        }

        if (types.indexOf(type) === -1) {
            types.push(type)
        }

        if (insts.indexOf(inst) === -1) {
            insts.push(inst)
        }
    }

    return { missions, types, insts }
}

// Transforms a normal string array to an array that would work
// with react-select
// Array[{ label: string, value: string }]
function wrapOptions(array) {
    return array.map((item) => {
        return { label: item, value: item }
    })
}

const Filters = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [missions, setMissions] = useState([])
    const [types, setTypes] = useState([])
    const [insts, setInsts] = useState([])

    const { geoJson, setFilteredGeoJson } = props

    useEffect(() => {
        if (!geoJson) {
            return
        }

        const features = geoJson.features
        const filtered = []
        features.forEach((feature) => {
            const { mission, type, inst } = feature.properties

            if (missions.length > 0 && missions.indexOf(mission) === -1) {
                return
            }

            if (types.length > 0 && types.indexOf(type) === -1) {
                return
            }

            if (insts.length > 0 && insts.indexOf(inst) === -1) {
                return
            }

            filtered.push(feature)
        })

        const filteredGeoJson = {
            ...geoJson,
            features: filtered,
        }

        setFilteredGeoJson(filteredGeoJson)
    }, [missions, types, insts, geoJson, setFilteredGeoJson])

    if (!geoJson) {
        return null
    }

    const options = getOptions(geoJson, {
        missions,
        types
    })
    return (
        <Control position="topright" style={{ borderRadius: 5 }}>
            <button
                className="filter-toggle"
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/funnel-icon.png" />
            </button>

            <div
                className="filter-container"
                style={{
                    display: isOpen ? "block" : "none",
                }}
            >
                <label>Filter by Missions</label>
                <Select
                    isMulti={true}
                    className="filter-select"
                    options={wrapOptions(options.missions)}
                    onChange={(selected) => {
                        setMissions(selected.map((item) => item.value))
                    }}
                    isClearable
                />

                <label>Filter by Types</label>
                <Select
                    isMulti={true}
                    className="filter-select"
                    options={wrapOptions(options.types)}
                    onChange={(selected) => {
                        setTypes(selected.map((item) => item.value))
                    }}
                    isClearable
                />

                <label>Filter by Insts</label>
                <Select
                    isMulti={true}
                    className="filter-select"
                    options={wrapOptions(options.insts)}
                    onChange={(selected) => {
                        setInsts(selected.map((item) => item.value))
                    }}
                    isClearable
                />
            </div>
        </Control>
    )
}

export default Filters
