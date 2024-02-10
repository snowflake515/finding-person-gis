import React from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

function LocationMarker() {
    const [position,
        setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        }
    })

    return position === null
        ? null
        : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
}

export const Map = () => {
    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            className='w-screen h-[calc(100vh-64px)]'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup.
                    <br/>
                    Easily customizable.
                </Popup>
            </Marker>
            <LocationMarker/>
        </MapContainer>
    );
};