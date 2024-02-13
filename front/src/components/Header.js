import React from "react";
import {Navbar, Collapse, Typography, IconButton} from "@material-tailwind/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom"
export default function Header() {
    const [openNav, setOpenNav] = React.useState(false);

    const handleWindowResize = () => window.innerWidth >= 540 && setOpenNav(false);

    React.useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    return (
        <Navbar className="mx-auto max-w-screen-xl px-6 py-3 rounded-xl">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Typography variant="h6" className="mr-4 cursor-pointer py-1.5">
                    <Link to="#">FINDING LOGO</Link>
                </Typography>
                <div className="hidden sm:block">
                    <NavList/>
                </div>
                <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent sm:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}>
                    {openNav
                        ? (<XMarkIcon className="h-6 w-6" strokeWidth={2}/>)
                        : (<Bars3Icon className="h-6 w-6" strokeWidth={2}/>)}
                </IconButton>
            </div>
            <Collapse open={openNav}>
                <NavList/>
            </Collapse>
        </Navbar>
    )
}

const links = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "Add Profile",
        link: "/page1"
    }, {
        name: "Search User",
        link: "/page2"
    }, {
        name: "Update Profile",
        link: "/page3"
    }
]

function NavList() {
    return (
        <ul
            className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 sm:flex-row lg:items-center lg:gap-6">
            {links.map((link, index) => (
                <Typography
                    as="li"
                    key = {"header" + index}
                    variant="small"
                    color="blue-gray"
                    className="p-1 font-medium ">
                    <Link
                        to={link.link}
                        className="flex items-center hover:text-blue-500 transition-colors underline">
                        {link.name}
                    </Link>
                </Typography>
            ))}
        </ul>
    );
}