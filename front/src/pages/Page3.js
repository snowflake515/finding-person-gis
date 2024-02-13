import React, { useEffect } from "react";
import LocationShow from "../components/LocationShow";  
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import axios from 'axios';


const position = [0, -0.0]
const base_url = "http://localhost:3001/"
export default function Page3() {
    const [latlng, setLatlng] = useState([])
    useEffect(() => { 
        const kkk = async () => {
            const configuration = {
                method: 'get',
                url:  base_url + 'profiles'
            };

            await axios(configuration).then((result) => {
                if (result.data.result) {
                    console.log(result.data.data);
                }
                console.log(result.data);
                setLatlng(result.data)
            }).catch((error) => {
                console.log(error);
            });
        }
        kkk();
    },[])
    return(
        <div>
            <h1>page3</h1>
            <MapContainer
                center={position}
                zoom={1.5}
                scrollWheelZoom={true}
                attributionControl={false}
                className='w-screen h-[calc(100vh-64px)]'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={position}>
                </Marker>
                {latlng.map((pos, i)=>{
                    console.log(pos);
                    return(
                        <Marker key={i} position={[pos.latitude, pos.longitude]}>
                            <Popup minWidth={90}>
                                lat:{pos.latitude}<br/>
                                lng:{pos.longitude}<br/>
                            </Popup>
                        </Marker>
                    )}
                )}
            </MapContainer>
        </div>
    )
}