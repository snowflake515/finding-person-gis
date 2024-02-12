import React, { useState } from "react";
import LocationShow from "../components/LocationShow";  
import { Map } from "../components/Map";
import { Radio, Typography, Input, Button } from "@material-tailwind/react";
import axios from 'axios';

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
    const [value, setValue] = useState(1);
    const [type, setType] = React.useState(false);
    const [word, setWord] = React.useState("");
    const [location, setLocation] = React.useState("current");
    const onType = ({ target }) => setType(target.value);
    const base_url = "http://localhost:3001/"
    const onValue = (e) => {
        setWord(e.target.value);
    }
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        if (e.target.value == 2) {
            setType(true);
        }else{
            setType(false);
        }     
    };
    const search = async(e) => {
        console.log(e)

        const configuration = {
            method: 'post',
            url:  base_url + 'profiles/search',
            data: {type: type, word: word, lati: localStorage.getItem('lati'), long: localStorage.getItem('long')}
        };

        await axios(configuration).then((result) => {
            if (result.data.result) {
                console.log(result.data.data);
                setLocation(result.data.data);
            }
            console.log(result);
        }).catch((error) => {
            console.log(error);
        });
    }
    return(
        <div>
            <div className="flex gap-10 m-[10px] justify-start">
                <div className="flex gap-10">
                    <Radio
                        name="type"
                        defaultChecked
                        onChange={onChange}
                        value={1}
                        ripple={false}
                        icon={<Icon />}
                        className="border-gray-900/10 bg-gray-900/5 p-0 transition-all hover:before:opacity-0"
                        label={
                        <Typography
                            color="blue-gray"
                            className="font-normal text-blue-gray-400"
                        >
                            Location
                        </Typography>
                        }
                    />
                    <Radio
                        name="type"
                        ripple={false}
                        icon={<Icon />}
                        value={2}
                        onChange={onChange}
                        className="border-gray-900/10 bg-gray-900/5 p-0 transition-all hover:before:opacity-0"
                        label={
                        <Typography
                            color="blue-gray"
                            className="font-normal text-blue-gray-400"
                        >
                            Type
                        </Typography>
                        }
                    />
                </div>
                <div className="relative flex w-full max-w-[24rem]">
                    <Input
                        type="text"
                        label="Input Type"
                        className="pr-20"
                        disabled={!type}
                        onChange={onValue}
                        value={word}
                        containerProps={{
                            className: "min-w-0",
                        }}
                    />
                    <Button
                        size="sm"
                        onClick={search}
                        className="!absolute right-1 top-1 rounded"
                    >
                        Search
                    </Button>
                </div>
            </div>
            <Map location={location} />
        </div>
    )
}