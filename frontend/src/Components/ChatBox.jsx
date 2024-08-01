import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBox = ({ selectedFriend }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigate = useNavigate();
    const chatBoxRef = useRef(null);
    const ws = useRef(null);
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));
    const receiver = selectedFriend?.username
    const sender = user?.username
    const me="you"

    console.log("Connected Frient", selectedFriend)
    useEffect(() => {
        if (!token) {
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user")
            navigate('/signin')
        }
    }, [token])


    useEffect(() => {
        if (selectedFriend) {
            setMessages([])
            ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${sender}_${receiver}/`)
            ws.current.onopen = function (e) {
                console.log('Chat WebSocket connection opened:', e);
            };


            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message) {
                    setMessages(prevMessages => [...prevMessages, data]);
                    console.log('WebSocket message received:', data);
                }
            };

            ws.current.onclose = function (e) {
                console.error('WebSocket connection closed:', e);
            };

            ws.current.onerror = function (e) {
                console.error('WebSocket error:', e);
            };
            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }
    }, [selectedFriend]);


    const sendMessage = () => {
        if (newMessage) {
            const message = {
                'message': newMessage,
                'sender': sender,
                'receiver': receiver
            };
            ws.current.send(JSON.stringify(message));
            setNewMessage('');
        }
    };

    useEffect(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        console.log("Messages sc:", messages)
    }, [messages]);

    return (
        <div className="mt-4">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <h5 className='card-title text-end px-2'>{selectedFriend ? selectedFriend.first_name + ' ' + selectedFriend.last_name : ''}</h5>
                    <div className="card">
                        <div className="card-body" style={{ height: '420px', overflowY: 'auto' }} ref={chatBoxRef}>
                            {messages.map((msg, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <strong className="ms-1">{msg.sender.username===user.username? me : msg.sender.username}</strong>
                                        <span className="text-muted me-1">{new Date(msg.timestamp).toLocaleTimeString() }</span>
                                    </div>
                                    
                                    <div className="p-2 bg-light border rounded-2">
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button className="btn btn-success rounded-pill mx-1" type="button" onClick={sendMessage}>Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ChatBox;
