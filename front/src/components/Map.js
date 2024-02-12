import React, { useEffect } from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';
var locate;

const center = {
    lat:  51.505,
    lng: -0.09,
};
  
function DraggableMarker() {
    const [position, setPosition] = useState(center);
    const markerRef = useRef(null);
    const [pos,setPos] = useState(null)
    const [latlng, setLatlng] = useState({});
    var map_value;
    useEffect(()=>{
        map.locate()
    }, [])

    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setLatlng(e.latlng)
            setPosition(e.latlng)
            localStorage.setItem('lati', e.latlng.lat);
            localStorage.setItem('long', e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom())
        }
    })

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                setPosition(marker.getLatLng());
                console.log(marker.getLatLng());
                }
            },
        }), []
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
            <Popup minWidth={90}>
                lat:{position.lat}<br/>
                lng:{position.lng}<br/>
            </Popup>
        </Marker>
    );
}

export const Map = ({ location }) => {
    locate = location;
    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            className='w-screen h-[calc(100vh-64px)]'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <DraggableMarker/>
        </MapContainer>
    );
};

Map.propTypes = {
    location: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      // Include other properties if needed
    }).isRequired,// Adjust the type according to what 'location' should be
};