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
  const [mission, setMission] = useState(null)
  const [type, setType] = useState(null)
  const [inst, setInst] = useState(null)

  useEffect(() => {
    if (!props.geoJson) {
      return;
    }

    const features = props.geoJson.features
    const filtered = []
    features.forEach(feature => {
      if (mission && feature.properties.mission != mission) {
        return
      }
      if (type && feature.properties.type != type) {
        return
      }
      if (inst && feature.properties.inst != inst) {
        return
      }

      filtered.push(feature)
    });


    const filteredGeoJson = {
      ...props.geoJson,
      features: filtered
    }

    props.setFilteredGeoJson(filteredGeoJson)
  }, [mission, type, inst]);

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
        <label>Filter by Mission</label>
        <Select
          className='filter-select'
          options={wrapOptions(options.missions)}
          onChange={(selected) => {
            setMission(selected ? selected.value : null)
          }}
          isClearable
        />

        <label>Filter by Types</label>
        <Select
          className='filter-select'
          options={wrapOptions(options.types)}
          onChange={(selected) => {
            setType(selected ? selected.value : null)
          }}
          isClearable
        />

        <label>Filter by Insts</label>
        <Select
          className='filter-select'
          options={wrapOptions(options.insts)}
          onChange={(selected) => {
            setInst(selected ? selected.value : null)
          }}
          isClearable
        />
      </div>
    </Control>
  )
}

export default Filters;
