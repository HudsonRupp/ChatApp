import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'

//renders nothing until the token is checked, then is either given resource or redirected to login
function Protected(props) {
    const [doc, setDoc] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)
    function checkToken() {
        fetch("/api/auth/checkToken", {
            method: "POST"
        })
            .then(res => res.json())
            .then((data) => {
                data.success ? setDoc(props.children) : setDoc(<Navigate to="/auth" replace={true} />)
            },
                (error) => {
                    console.log(error);
                })
    }
    useEffect(() => {
        checkToken()
    }, [loggedIn])

    return doc
}

export default Protected