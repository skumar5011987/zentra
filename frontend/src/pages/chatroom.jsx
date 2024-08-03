import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Consumer from '../Components/Consumer';
import ChatBox from '../Components/ChatBox';
import OnlineStatus from '../static/js/OnlineStatus';
import axios from 'axios';

export default function Chatroom() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [friends, setFriends] = useState([]);
    const [requested, setRequested] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const headers = { 'Authorization': 'Bearer ' + token };
    const onlineUsers = OnlineStatus();

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate("/signin");
        } else {
            getFriends();
            getRequested();
        }
    }, [token, navigate]);

    const getFriends = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/friends/`, { headers });
            setFriends(response.data);
        } catch (error) {
            console.log("Error getting friends:", error.response?.data);
        }
    };

    const getRequested = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/requested/`, { headers });
            setRequested(response.data);
        } catch (error) {
            console.log("Error getting requested:", error.response?.data);
        }
    };

    const onUserClick = (user) => {
        setSelectedFriend(user);
    };

    return (
        <>
            {/* Offcanvas Drawer for Small Devices */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasFriends" aria-labelledby="offcanvasFriendsLabel">
                <div className="offcanvas-header">
                    <h5 id="offcanvasFriendsLabel">Friends</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {friends.length > 0 ? friends.map(friend => (
                        <div key={friend.id} onClick={() => onUserClick(friend)}>
                            <Consumer vals={friend} friend={true} online={onlineUsers.includes(friend.id)} />
                        </div>
                    )) : <p className="text-center">No Friends</p>}
                </div>
            </div>

            <div className="container border-2 rounded shadow p-3 mb-5 bg-body rounded mt-4">
                <div className="row">
                    {/* Sidebar Toggle Button for Small Devices */}
                    <div className="d-md-none mb-3">
                        <button className="btn btn-success" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFriends" aria-controls="offcanvasFriends" aria-expanded="false" aria-label="Toggle Friends">
                            Friends
                        </button>
                    </div>

                    {/* Friends List for Larger Screens */}
                    <div className="col-md-4 col-lg-4 d-none d-md-block">
                        <div className="border-bottom border-2 mb-4">
                            <h4 className='text-left mt-2 mx-4 fw-bold'>Friends</h4>
                        </div>
                        <div style={{ height: '450px', overflowY: 'auto' }}>
                            {friends.length > 0 ? friends.map(friend => (
                                <div key={friend.id} onClick={() => onUserClick(friend)}>
                                    <Consumer vals={friend} friend={true} online={onlineUsers.includes(friend.id)} />
                                </div>
                            )) : <p className="card-text text-center">No Friends</p>}
                        </div>
                    </div>

                    {/* ChatBox */}
                    <div className="col-sm-12 col-md-8 col-lg-8 bg-gradient">
                        <div className="border-bottom border-2">
                            <h4 className="mt-2 mx-4 fw-bold">ChatBox</h4>
                        </div>
                        <ChatBox selectedFriend={selectedFriend} />
                    </div>
                </div>
            </div>
        </>
    );
}

