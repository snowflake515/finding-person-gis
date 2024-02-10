import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    // Textarea,
    Typography
} from "@material-tailwind/react";
import {useEffect} from "react";
import { notification, ToastContainer1 } from "../components/notification";
import { ToastContainer, toast } from 'react-toastify';
import LocationShow from "../components/LocationShow";
import axios from 'axios';

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props}/>;
// }

const base_url = "http://localhost:3001/"
export default function Page1() {
    const [open,
        setOpen] = React.useState(false);
    const [showAlert,
        setShowAlert] = React.useState(false);
    const [data,
        setData] = React.useState({userid: "", username: "", type: "", latitude: 0, longitude: 0});
    const [isSubmitting,
        setIsSubmitting] = React.useState(false);
    const handleDataChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleOpen = () => setOpen(!open);
    const handleSubmit = async(e) => {
        console.log(e)
        setIsSubmitting(true);

        const configuration = {
            method: 'post',
            url: base_url + 'profiles/create',
            data
        };
        window.temp = base_url

        await axios(configuration).then((result) => {
            if (result.data.result) {
                // setShowAlert(true);
                toast("done");
                setOpen(false);
            }
            console.log(result);
            setIsSubmitting(false);
        }).catch((error) => {
            console.log(error);
            toast.error(error.message)
            setIsSubmitting(false);
        });
    }

    useEffect(() => {
        // Get user's location
        navigator
            .geolocation
            .getCurrentPosition((position) => {
                setData({
                    ...data,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.error('Error getting location:', error);
            });
    }, []);

    return (
        <div className="justify-center items-center flex flex-col p-4">
            <Button onClick={handleOpen}>Add me</Button>
            {/* <LocationShow/> {showAlert && <Alert severity="success">Create Profile Success! Please check your database !</Alert>} */}
            <Dialog open={open} size="xs" handler={handleOpen}>
                <div className="flex items-center justify-between">
                    <DialogHeader className="flex flex-col items-start">
                        {" "}
                        <Typography className="mb-1" variant="h4">
                            Add your location to DB{" "}
                        </Typography>
                    </DialogHeader>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5"
                        onClick={handleOpen}>
                        <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"/>
                    </svg>
                </div>
                <DialogBody>
                    {/* <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
                        Add your location to DB.
                    </Typography> */}
                    <div className="grid gap-2 ">
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Username
                        </Typography>
                        <Input
                            label="Username"
                            name="username"
                            value={data["username"]}
                            onChange={handleDataChange}/>
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            UserID
                        </Typography>
                        <Input
                            label="UserID"
                            name="userid"
                            value={data["userid"]}
                            onChange={handleDataChange}/>
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Type
                        </Typography>
                        <Input
                            label="Type"
                            name="type"
                            value={data["type"]}
                            onChange={handleDataChange}/>
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Latitude
                        </Typography>
                        <Input label="Type" value={data["latitude"]} disabled/>
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Longitude
                        </Typography>
                        <Input label="Type" value={data["longitude"]} disabled/>
                    </div>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        cancel
                    </Button>
                    <Button
                        variant="gradient"
                        color="gray"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting
                        ? true
                        : false}>
                        {isSubmitting
                            ? "..."
                            : "Add"}
                    </Button>
                </DialogFooter>
            <ToastContainer1 autoClose={2000} />
            </Dialog>
        </div>
    )
}