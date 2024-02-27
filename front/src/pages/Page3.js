import React, { useEffect } from "react";
import { notification, ToastContainer1 } from "../components/notification";
import { ToastContainer, toast } from 'react-toastify';
import LocationShow from "../components/LocationShow";
import Map from "../components/SmallMap";
import {types} from "../global/type";
import { PencilIcon, CheckIcon, CheckCircleIcon  } from "@heroicons/react/24/solid";
import { Input, Button, Collapse, Card, Typography, CardBody, Tooltip, IconButton } from "@material-tailwind/react";
import { Select } from 'antd';
import axios from 'axios';

const base_url = "http://localhost:3001/"
export default function Page3() {
    const ref = React.createRef();
    const [userid, setUserid] = React.useState("");
    const [data, setData] = React.useState({userid: "", username: "", type: "", latitude: "", longitude: ""});
    const onChange = ({ target }) => setUserid(target.value);
    const [openc, setOpenc] = React.useState(false);
    const [update, setUpdate] = React.useState(false);
   
    const toggleOpen = () => setOpenc((cur) => !cur);
    useEffect(() => { 
        kkk();
    },[])

    const onSelect = (e) => {
        setData({
            ...data,
            type: e
        });
    };

    const kkk = async () => {
        console.log("kkk")
        const configuration = {
            method: 'get',
            url:  base_url + 'profiles'
        };

        await axios(configuration).then((result) => {
            if (result.data.result) {
                ref.current.log(result.data.data, false);
            }else{
                toast.error("The user does not exist");
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    const onUpdate = async(e) => {
        setData({
            ...data,
            latitude: localStorage.getItem("lati"),
            longitude: localStorage.getItem("long")
        });
        if (update) {
            if (data.type == "") {
                toast.error("Require type!");
                return;
            }
            if (data.username == "") {
                toast.error("Require username!");
                return;
            }
            const configuration = {
                method: 'post',
                url: base_url + 'profiles/update',
                data
            };
            window.temp = base_url

            await axios(configuration).then((result) => {
                if (result.data.result) {
                    toast("Updated profile is successful");
                    setUpdate(!update);
                    toggleOpen();
                }else{
                    setUpdate(!update);
                    toast.error("Please check updated field!");
                    toggleOpen();
                }
            }).catch((error) => {
                console.log(error);
                toast.error(error.message)
            });
        }
        setUpdate(!update);
    }

    const onData = (e) => {
        console.log(e);
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const search = async(e) => {
        if (userid) {
            var data = {userid: userid};
            const configuration = {
                method: 'post',
                url:  base_url + 'profiles/getId',
                data
            };
            await axios(configuration).then((result) => {
                if (result.data.result) {
                    localStorage.setItem("lati", result.data.data[0].latitude);
                    localStorage.setItem("long", result.data.data[0].longitude);
                    ref.current.log(result.data.data, true);
                    setData({
                        ...data,
                        userid: result.data.data[0].userid,
                        username: result.data.data[0].username,
                        type: result.data.data[0].type
                    });
                    setOpenc(true);
                }else{
                    toast.error("No exist the user!");
                }
            }).catch((error) => {
                console.log(error);
            });
        }else{
            window.location.reload();
            setOpenc(false);
        }
    }
    const TABLE_HEAD = ["UserID", "UserName", "Type", "Action"]

    return(
        <div className="flex flex-row" style={{ minHeight: 850 }}>
            <div className="basis-1/3 grid place-items-center">
                <div className="relative bottom-0 w-full">
                    <div className="relative flex w-full max-w-[24rem] ml-20">
                        <Input
                            type="text"
                            label="UserID"
                            value={userid}
                            onChange={onChange}
                            className="pr-20"
                            containerProps={{
                            className: "min-w-0",
                            }}
                        />
                        <Button
                            size="sm"
                            color="gray"
                            onClick={search}
                            className="!absolute right-1 top-1 rounded"
                        >
                            Search
                        </Button>
                    </div>
                    <Collapse open={openc} className="relative top-0 left-0 ml-14">
                        <Card className="">
                            <CardBody> 
                                <table className="w-full max-w-[24rem] table-auto text-center border">
                                    <thead>
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
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border-b border-blue-gray-50">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {data.userid}
                                                </Typography> 
                                            </td>
                                            <td className="p-3 border-b border-blue-gray-50">
                                                {update? 
                                                    <input
                                                        value={data.username}
                                                        size={15}
                                                        name="username"
                                                        onChange={onData}
                                                        className="border text-center"
                                                    /> : 
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {data.username}
                                                    </Typography>
                                                }  
                                            </td>
                                            <td className="p-3 border-b border-blue-gray-50">
                                                {update? 
                                                    <Select 
                                                        // label="Type" 
                                                        onChange={onSelect} 
                                                        name="type"
                                                        value={data.type}
                                                        options={types}
                                                        defaultValue='all'
                                                        style={{ maxHeight: 26, maxWidth: 140 }}
                                                    /> : 
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {data.type}
                                                    </Typography>
                                                }  
                                            </td>
                                            <td  className="p-3 border-b border-blue-gray-50">
                                                <IconButton variant="text">
                                                    {update? 
                                                        <CheckCircleIcon className="h-8 w-8" color="green" onClick={onUpdate}/> :
                                                        <PencilIcon className="h-4 w-4" onClick={onUpdate}/>
                                                    }
                                                </IconButton>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>         
            </div>
            <ToastContainer1 />
            <div className="p-8 basis-2/3">
                <Map ref={ref} />
            </div>
        </div>
    )
}