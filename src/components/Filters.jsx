import React, { useState, useEffect } from 'react'
import Select, { mergeStyles } from 'react-select'
import Control from 'react-leaflet-custom-control';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


function getOptions(geoJson) {
  let missions = []
  let types = []
  let insts = []

  let features = geoJson.features
  for (let i = 0; i < features.length; i++) {
    const { mission, type, inst } = features[i].properties
    if (missions.indexOf(mission) == -1) {
      missions.push(mission)
    }

    if (types.indexOf(type) == -1) {
      types.push(type)
    }

    if (insts.indexOf(inst) == -1) {
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

  useEffect(() => {
    if (!props.geoJson) {
      return;
    }

    const features = props.geoJson.features
    const filtered = []
    features.forEach(feature => {
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
    });


    const filteredGeoJson = {
      ...props.geoJson,
      features: filtered
    }

    props.setFilteredGeoJson(filteredGeoJson)
  }, [missions.length, types.length, insts.length]);

  if (!props.geoJson) {
    return null
  }

  const options = getOptions(props.geoJson)
  return (
    <Control position='topright' style={{ borderRadius: 5 }}>
      <button className='filter-toggle' onClick={() => {
        setIsOpen(!isOpen)
      }}>
        <img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/funnel-icon.png" />
      </button>

      <div className='filter-container' style={{
        display: isOpen ? 'block' : 'none'
      }}>
        <label>Filter by Missions</label>
        <Select
          isMulti={true}
          className='filter-select'
          options={wrapOptions(options.missions)}
          onChange={(selected) => {
            setMissions(selected.map(item => item.value))
          }}
          isClearable
        />

        <label>Filter by Types</label>
        <Select
          isMulti={true}
          className='filter-select'
          options={wrapOptions(options.types)}
          onChange={(selected) => {
            setTypes(selected.map(item => item.value))
          }}
          isClearable
        />

        <label>Filter by Insts</label>
        <Select
          isMulti={true}
          className='filter-select'
          options={wrapOptions(options.insts)}
          onChange={(selected) => {
            setInsts(selected.map(item => item.value))
          }}
          isClearable
        />
      </div>
    </Control>
  )
}

export default Filters;
