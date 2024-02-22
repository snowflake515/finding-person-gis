import React, { useEffect } from "react";
import { notification, ToastContainer1 } from "../components/notification";
import { ToastContainer, toast } from 'react-toastify';
import LocationShow from "../components/LocationShow";
import Map from "../components/SmallMap";
import { Input, Button, Collapse, Card, Typography, CardBody } from "@material-tailwind/react";
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
        const kkk = async () => {
            const configuration = {
                method: 'get',
                url:  base_url + 'profiles'
            };

            await axios(configuration).then((result) => {
                if (result.data.result) {
                    ref.current.log(result.data.data);
                }else{
                    toast.error("The user does not exist");
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        kkk();
    },[])

    const onUpdate = async(e) => {
        setData({
            ...data,
            latitude: localStorage.getItem("lati"),
            longitude: localStorage.getItem("long")
        });
        if (update) {
            console.log(data);
            const configuration = {
                method: 'post',
                url: base_url + 'profiles/update',
                data
            };
            window.temp = base_url

            await axios(configuration).then((result) => {
                if (result.data.result) {
                    toast("Updating profile is successful");
                    setUpdate(!update);
                    toggleOpen();
                }else{
                    setUpdate(!update);
                    toast.error(result.data.message);
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
        var data = {userid: userid};
        const configuration = {
            method: 'post',
            url:  base_url + 'profiles/getId',
            data
        };
        await axios(configuration).then((result) => {
            if (result.data.result) {
                ref.current.log(result.data.data);
                setData({
                    ...data,
                    userid: result.data.data[0].userid,
                    username: result.data.data[0].username,
                    type: result.data.data[0].type
                });
                toggleOpen();
            }else{
                ref.current.log('error');
                toast.error("Please select type again!");
            }
        }).catch((error) => {
            console.log(error);
        });
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
                            color={userid ? "gray" : "blue-gray"}
                            disabled={!userid}
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
                                                    <input
                                                        value={data.type}
                                                        size={10}
                                                        name="type"
                                                        onChange={onData}
                                                        className="border text-center"
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
                                            <td className="p-3 border-b border-blue-gray-50">
                                                <Button variant="outlined" onClick={onUpdate}>Update</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>         
            </div>
            <div className="p-8 basis-2/3">
                <Map ref={ref} />
            </div>
        </div>
    )
}