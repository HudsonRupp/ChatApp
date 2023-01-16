
import './Navbar.css';
import React, { useEffect, useState } from 'react';
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';


function Navbar(props) {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        var token = document.cookie.split('; ').find((row) => row.startsWith("token="))?.split("=")[1];
        if (token) {
            setLoggedIn(true)
            setUser(decodeToken(token).username)
        } else {
            setLoggedIn(false)
            setUser(null)
        }
    })

    function logOut() {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/auth");
    }

    return (
        <div id="container">
            <ul class="nav">
                <li class="nav" id="header">{user ? user : "Title"}</li>
                <li class="nav">{loggedIn && <button id="log" onClick={logOut}>Log out</button>}</li>
            </ul>
        </div>
    )
}

export default Navbar