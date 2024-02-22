import React, { useState, useRef  } from "react";
import LocationShow from "../components/LocationShow";  
import Map from "../components/Map";
import { Radio, Typography, Input, Button, Collapse, Card, CardBody } from "@material-tailwind/react";
import { Select } from 'antd';
import axios from 'axios';
import {types} from "../global/type";
import { notification, ToastContainer1 } from "../components/notification";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-full w-full scale-105"
        >
            <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function Page2() {
    const [type, setType] = React.useState(false);
    const [word, setWord] = React.useState("");
    const [radius, setRadius] = React.useState("");
    const [location, setLocation] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const TABLE_HEAD = ["No", "ID", "Distance"];
    const ref = React.createRef();
    const base_url = "http://localhost:3001/"
    const onSelect = (e) => {
        setWord(e);
    };
    const onRadius = (e) => {
        setRadius(e.target.value);
    };
    
    navigator
        .geolocation
        .getCurrentPosition((position) => {
            localStorage.setItem('lati1', position.coords.latitude);
            localStorage.setItem('long1', position.coords.longitude);
        }, (error) => {
            toast.error("Error while getting location: " + error.message)
    });
    const search = async(e) => {
        var data = {radius: radius, word: word, lati: localStorage.getItem('lati'), long: localStorage.getItem('long')};
        const configuration = {
            method: 'post',
            url:  base_url + 'profiles/search',
            data
        };
        await axios(configuration).then((result) => {
            if (result.data.result) {
                setLocation(result.data.data);
                if (!open) {
                    setOpen(true)
                }
                ref.current.log(result.data.data);
            }else{
                ref.current.log('error');
                toast.error("Please select type again!");
                setOpen(false)
            }
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
    return(
        <div>
            <div className="flex gap-10 m-[10px] justify-between">
                <div className="flex gap-10">
                    <Typography
                        color="blue-gray"
                        className="font-normal text-black mt-2"
                    >
                        Radius:
                    </Typography>     
                    <Input 
                        type="number" 
                        label="Input Radius(40 Km)"
                        onChange={onRadius}
                        value={radius}
                    />
                    <Typography
                        color="blue-gray"
                        className="font-normal text-black mt-2"
                    >
                        Type:
                    </Typography>
                    <Select 
                        // label="Type" 
                        onChange={onSelect} 
                        name="type"
                        value={word}
                        options={types}
                        defaultValue='all'
                        style={{ marginTop: 2, minHeight: 40, minWidth: 200 }}
                    />
                </div>
                <div className="relative flex w-full max-w-[24rem]">
                    <Button
                        color="blue"
                        size="sm"
                        onClick={search}
                        className="!absolute right-1 top-1 rounded"
                    >
                        Search
                    </Button>
                </div>
            </div>
            <Map ref={ref} />
            <div className="fixed bottom-4 right-4 z-50">
                <Collapse open={open}>
                    <Card className="">
                        <CardBody> 
                            <table className="w-full min-w-max table-auto text-left">
                                {/* <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-3"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead> */}
                                <tbody>
                                    {location.map(({ username, distance }, index) => {
                                        const isLast = index === location.length - 1;
                                        const classes = isLast ? "p-3" : "p-3 border-b border-blue-gray-50";
                            
                                        return (
                                            <tr key={index}>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {index+1}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {username}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {Math.ceil(distance * 1000)} m
                                                    </Typography>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        </div>
    )
}