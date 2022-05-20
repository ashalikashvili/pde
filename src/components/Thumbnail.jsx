import React, { useState } from 'react';

const Thumbnail = (props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const url = props.url;

    if (!url) {
        return (
            <div className='thumbnail-wrapper'>
                <span>No preview</span>
            </div>
        )
    }

    return (
        <div className='thumbnail-wrapper'>
            <img
                src={url}
                onLoad={() => {
                    setIsLoaded(true);
                }}
            />
            {!isLoaded && <div className='spinner' />}
        </div>
    )
}

export default Thumbnail;