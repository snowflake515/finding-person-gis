import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import {MapContainer, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet';
import { useCallback, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';
import { latLng } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

var center = {lat: localStorage.getItem('lati1'), lng: localStorage.getItem('long1')};

var map;
var position_mark = center;
var userid = "ME";
var search_flag = false;
var page3_flag = true;
var search_data;
var markerRef;

function DraggableMarker() {
    const [position, setPosition] = useState(center);
    const [popupOpen, setPopupOpen] = useState(false);
    markerRef = useRef(null);
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
            center = e.latlng
            position_mark = e.latlng;
            localStorage.setItem('lati', e.latlng.lat);
            localStorage.setItem('long', e.latlng.lng);
        },
        zoomend: (event) => {
            // console.log('Zoom level changed to:', event.target.getZoom());
            // if (event.target.getZoom() >= 15) {
            //     markerRef.current.openPopup();
            //     setPopupOpen(true);
            // }else{
            //     setPopupOpen(false);
            //     markerRef.current.closePopup();
            // }
        },
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

                    // const base_url = "http://localhost:3001/"
                    // const configuration = {
                    //     method: 'post',
                    //     url: base_url + 'profiles/test',
                    //     data: {latitude: marker.getLatLng().lat, longitude: marker.getLatLng().lng}
                    // };
            
                    // axios(configuration).then((result) => {
                    //     if (result.data.result) {
                    //         console.log(result.data.result)
                    //     }
                    // }).catch((error) => {
                    // });
                    
                }
            },
        }), []
    );

    if (!search_flag) {
        const customIcon1 = new L.Icon({
            iconUrl: 'marker-icon.png',
            // iconSize: [50, 89], // size of the icon
            iconAnchor: [12.5, 45], // point of the icon which will correspond to marker's location
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position_mark}
                icon={customIcon1}
                ref={markerRef}  
            >
                <Popup minWidth={90} autoClose={false} offset={[0, -42]} onClose={() => setPopupOpen(false)}>
                    userid: {userid}<br/>
                    lat:{position_mark.lat}<br/>
                    lng:{position_mark.lng}<br/>
                </Popup>
            </Marker>
        );
    }else{
        const customIcon1 = new L.Icon({
            iconUrl: 'marker-icon2.png',
            // iconSize: [50, 89], // size of the icon
            iconAnchor: [12.5, 45], // point of the icon which will correspond to marker's location
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        return (
            <div>
                {search_data.map((pos, i)=>{
                    return(
                        <Marker 
                            key={i} 
                            position={[pos.latitude, pos.longitude]} 
                            ref={markerRef}
                            draggable={true}
                            icon={customIcon1}
                            eventHandlers={eventHandlers}
                        >
                            {popupOpen && (
                                <Tooltip direction="bottom" permanent>
                                    <span>Username:{pos.username}<br/></span>
                                    <span>UserID:{pos.userid}<br/></span>
                                    <span>Type:{pos.type}<br/></span>
                                </Tooltip>
                            )}
                        </Marker>
                    )
                })}
            </div>
        )
    }
}

const Map = forwardRef((props, ref) => {
    const [zoom, setZoom] = useState(13);
    // const handleChildEvent = () => {
    //     parentFunction(); // Call the parent function
    // };
    useImperativeHandle(ref, () => ({
        log(param1, param2) {
            if (param1 == 'error') {
                search_flag = false;
                position_mark = {lat: localStorage.getItem('lati'), lng: localStorage.getItem('long')};
            }else{
                userid = param1[0].userid;
                page3_flag = param2;
                console.log(param1, param2);
                map.flyTo({lng: localStorage.getItem("long"), lat: localStorage.getItem("lati")}, map.getZoom());
                position_mark = {lng: localStorage.getItem("long"), lat: localStorage.getItem("lati")};
                search_data = param1;
                if (param2) {
                    search_flag = false
                }else{
                    search_flag = true;
                }
                setZoom(13);
            }
        }
    }));
    center = {lat: localStorage.getItem('lati'), lng: localStorage.getItem('long')};
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            attributionControl={false}
            // style={{position: 'fixed', width: 735, height: 500}}
            className='w-full h-full relative'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <DraggableMarker/>
            
        </MapContainer>
    );
});

// Map.propTypes = {
//     parentFunction: PropTypes.func.isRequired, // Assuming parentFunction is a function
// };

Map.displayName = "Map";

export default Map;