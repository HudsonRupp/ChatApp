import './Messages.css';
import React, { useState } from 'react';
function Messages(props) {
    const [curMessage, setCurMessage] = useState("");



    function changeMessage(event) {
        setCurMessage(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        setCurMessage("")
        props.sendMessage(curMessage);
    }
    return (
        <div>
            <ul id="messages">
                {props.passedmessages.map((message, index) => <li key={props.passedmessages.length - index}>{message}</li>)}
            </ul>
            <form onSubmit={handleSubmit}>
                <input id="msgInp" onChange={changeMessage} value={curMessage} autocomplete="off" type="text"></input> <button id="submit">send</button>
            </form>
        </div>
    )
}

export default Messages