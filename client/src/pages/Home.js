import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar"
import Messages from "../components/Messages"
import "./Home.css"
const token = document.cookie.split('; ').find((row) => row.startsWith("token="))?.split("=")[1];
const socket = io("http://localhost:3000", { path: '/chat/', auth: { token: token }, autoConnect: false, reconnectionDelay: 1000 })



function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [lastPong, setLastPong] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [iserror, setisError] = useState(false);

    function sendMessage(content) {
        socket.emit("chat_message", content)
    }
    function sendPing() {
        socket.emit("ping");
    }

    useEffect(() => {
        setMessages([])
        console.log("Attempting to connect")
        socket.auth.token = document.cookie.split('; ').find((row) => row.startsWith("token="))?.split("=")[1];
        socket.connect();
        socket.emit('setup');

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected')
        });
        socket.on('setup', (data) => {
            setConnectedUsers(data.online)
            setMessages(data.messages)
        })
        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected')
        });
        socket.on('chat_message', (msg) => {
            setMessages(oldMsg => [...oldMsg, msg.author + ": " + msg.message]);
        })
        socket.on('pong', () => {
            setLastPong(new Date().toISOString());
        });
        socket.on("connect_error", (err) => {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            socket.disconnect();
            setisError(true)
            console.log(`connect_error due to ${err.message}`);
        });

        return () => {
            socket.off('setup');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
            socket.off('connect_error')
            socket.off('chat_message')
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on('user_connect', (data) => {
            var newUser = data.filter(x => !connectedUsers.includes(x));
            setConnectedUsers(data)

            setMessages(oldMsg => [...oldMsg, "SERVER -- USER " + newUser + " HAS CONNECTED"]);
        })
        socket.on('user_disconnect', (data) => {
            var oldUser = connectedUsers.filter(x => !data.includes(x));
            setConnectedUsers(data)
            setMessages(oldMsg => [...oldMsg, "SERVER -- USER " + oldUser + " HAS DISCONNECTED"]);
        })
        return () => {
            socket.off('user_connect')
            socket.off('user_disconnect')
        }
    }, [connectedUsers])
    return (
        <>
            <Sidebar ping={sendPing} connected={isConnected} lastPing={lastPong} connectedUsers={connectedUsers} />
            {iserror && <Navigate to="/auth" />}
            <div class="content">
                <Messages sendMessage={sendMessage} passedmessages={messages} />
            </div>
        </>
    );
}

export default Home;