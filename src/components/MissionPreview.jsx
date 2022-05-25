import React, { useEffect, useState } from 'react'
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Api from '../lib/Api'

const formatSize = (size) => {
    if (size === 0) {
        return '0 B'
    }

    const powerOf1000 = Math.floor(Math.log10(size) / 3)
    const number = size / Math.pow(1000, powerOf1000)
    const unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'][powerOf1000]

    return (Math.round(number * 100) / 100) + ' ' + unit
}

const MissionPreview = ({ mission }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [size, setSize] = useState(-1)
    
    useEffect(() => {
        if (mission.fullImage) {
            Api.fetchResourceSize(mission.fullImage).then(size => {
                setSize(size)
            })
        }
    }, [mission.fullImage])

    return (
        <div className="mission-preview">
            {mission.thumbnail ? (
                <div className="thumbnail-wrapper">
                    <img
                        alt={mission.id + " preview"}
                        src={mission.thumbnail}
                        onLoad={() => {
                            setIsLoaded(true)
                        }}
                    />
                    {!isLoaded && <div className="spinner" />}
                </div>
            ) : (
                <div className="no-preview">No Thumbnail Available</div>
            )}
            <div className="mission-info">
                <div className="row">
                    <b>Mission ID:</b>
                    <span>{mission.id}</span>
                </div>
                <div className="row">
                    <b>Mission Start:</b>
                    <span>{mission.start.toLocaleString()}</span>
                </div>
                <div className="row">
                    <b>Mission End:</b>
                    <span>{mission.end.toLocaleString()}</span>
                </div>
                <div className="row">
                    <b>Observation Time:</b>
                    <span>{mission.observationTime.toLocaleString()}</span>
                </div>
            </div>
            <div className="download">
                <h5 className="download-title">Download Full Image</h5>
                <a
                    href={mission.fullImage}
                    target="_blank"
                    rel="noreferrer"
                    className="download-button"
                >
                    <FontAwesomeIcon
                        icon={faExternalLink}
                    />
                    &nbsp; Download
                    {size !== -1 && ' (' + formatSize(size) + ')'}
                </a>
            </div>
        </div>
    )
}

export default MissionPreview
