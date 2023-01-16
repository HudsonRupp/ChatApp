import React, { Component } from 'react';
import { decodeToken } from "react-jwt";
import { Navigate } from 'react-router-dom'
import "./Auth.css"
class Auth extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resp: "",
            username: "",
            password: "",
            loggedIn: false
        }
    }
    componentDidMount() {
        const token = document.cookie.split('; ').find((row) => row.startsWith("token="))?.split("=")[1];
        if (decodeToken(token) != null) {
            this.setState({ loggedIn: true });
        }
    }

    handleLogIn() {
        var token;
        var decoded
        var user;
        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(res => res.json())
            .then((data) => {
                token = data.token;
                decoded = JSON.stringify(decodeToken(token))
                this.setState({
                    resp: data.message + "\nTOKEN:" + token + "\nDECODE: " + decoded
                })
                if (data.success) {
                    document.cookie = "token=" + token + "; path='/'"
                    this.setState({
                        loggedIn: true
                    });
                }
            },
                (error) => {
                    console.log(error);
                })

    }
    handleSignUp() {
        fetch("/api/auth/registration", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    resp: data.message
                })
            },
                (error) => {
                    console.log(error);
                })
    }
    handleChange(val, event) {
        this.setState({
            [val]: event.target.value
        })
    }

    render() {

        return (
            <div id="container">
                {this.state.loggedIn && (<Navigate to="/home" replace={true} />)}
                <h2>Auth page</h2>
                <p> {this.state.resp} </p>
                <input type="text" name="username" value={this.state.username} onChange={(event) => this.handleChange("username", event)} />
                <br />
                <input type="text" name="password" value={this.state.password} onChange={(event) => this.handleChange("password", event)} />
                <br />
                <button onClick={() => this.handleLogIn()}>Log In</button>
                <button onClick={() => this.handleSignUp()}>Sign Up</button>

            </div>
        )
    }
}


export default Auth;