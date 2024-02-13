import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';
import { latLng } from 'leaflet';

const center = {
    lat:  51.505,
    lng: -0.09,
};

var map;
var position_mark = center;

function DraggableMarker() {
    const [position, setPosition] = useState(center);
    const markerRef = useRef(null);
    const [latlng, setLatlng] = useState({});
    useEffect(()=>{
        map.locate()
    }, [])
    map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setLatlng(e.latlng)
            position_mark = e.latlng;
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
                    localStorage.setItem('lati', marker.getLatLng().lat);
                    localStorage.setItem('long', marker.getLatLng().lng);
                    position_mark = marker.getLatLng();
                    console.log(marker.getLatLng());
                }
            },
        }), []
    );

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position_mark}
            ref={markerRef}
        >
            <Popup minWidth={90}>
                lat:{position_mark.lat}<br/>
                lng:{position_mark.lng}<br/>
            </Popup>
        </Marker>
    );
}

const Map = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        log(param1) {
            console.log("child function", param1);
            map.flyTo({lng: param1.longitude, lat: param1.latitude}, map.getZoom());
            position_mark = {lng: param1.longitude, lat: param1.latitude};
            console.log("child function1111", position_mark);
        }
    }));

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            attributionControl={true}
            style={{position: 'fixed'}}
            className='w-screen h-[calc(100vh-64px)]'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <DraggableMarker/>
        </MapContainer>
    );
});

Map.displayName = "Map";

export default Map;