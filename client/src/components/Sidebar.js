
import './Sidebar.css';
import React from 'react';


function Sidebar(props) {

    return (
        <div class="sidebar">
            <h4>Server stats:</h4>
            <p>Connected: {props.connected ? "true" : "false"}</p>
            <p>Last Ping: {props.lastPing}</p>
            <button onClick={props.ping}>Ping Server</button>
            <h4>Online Users:</h4>
            {props.connectedUsers.map(user => <p key={user}>{user}</p>)}

        </div>
    )
}

export default Sidebar