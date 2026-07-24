import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom";
import Logo from '../assets/TNPC_LOGO.png'
import { Menu, User2, X, LogOut } from "lucide-react";

const Navbar = ({ user, setUser }) => {
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        setUser({
            isLogin: false,
            role: "",
            name: "",
        });
    };

    const links = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/placements", label: "Placements" },
        { to: "/departments", label: "Departments" },
        { to: "/drives", label: "Drives" },
    ];

    return (
        <>
            <div className='sticky top-0 z-50 bg-white shadow-md'>
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={Logo} alt="TNPC Logo" className="w-25 h-10" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `relative px-2 py-1 transition-all duration-400
                                    ${isActive ? "text-blue-700 font-semibold" : "text-gray-700 font-semibold"}
                                    after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                                    after:bg-blue-700 after:transition-all after:duration-300
                                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {!user.isLogin ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `relative font-semibold transition-colors duration-300
                                        ${isActive ? "text-blue-700" : "text-blue-500 hover:text-blue-800"}`
                                    }
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) =>
                                        `px-3 py-1 rounded-lg text-white transition-colors
                                        ${isActive ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`
                                    }
                                >
                                    Signup
                                </NavLink>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600 transition-all duration-300"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300"
                        aria-label='Toggle menu'
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className='lg:hidden bg-white shadow-md animate-in slide-in-from-top-2 duration-300'>
                        <nav className='flex flex-col items-center gap-4 py-4'>
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `text-lg font-medium transition-colors duration-300 ${isActive ? "text-blue-700 font-bold" : "text-gray-800"}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}

                            {!user.isLogin ? (
                                <>
                                    <Link
                                        to="/login"
                                        className='text-blue-600 text-lg font-medium hover:text-blue-700 transition-colors'
                                        onClick={() => setOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className='bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors'
                                        onClick={() => setOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        handleLogout();
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-lg font-medium hover:bg-red-600 transition-colors"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </>
    )
}

export default Navbar;