
import React, { useState, useEffect } from 'react'
import { useNavigate, } from 'react-router-dom'
import Consumer from '../Components/Consumer'
import ChatBox from '../Components/ChatBox'
import OnlineStatus from '../static/js/OnlineStatus';
import axios from 'axios'


export default function Chatroom() {
    const navigate = useNavigate()
    const token = localStorage.getItem('access_token')
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requested, setRequested] = useState([])
    const [selectedFriend, setSelectedFriend] = useState(null)
    let headers = { 'Authorization': 'Bearer ' + token };
    const onlineUsers = OnlineStatus();

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate("/signin");
        }
        else {
            getUsers();
            getFriends();
            getRequested();
        }
    }, [token]);

    const getUsers = async () => {
        try {

            let response = await axios.get('http://localhost:8000/api/users/', {
                headers: headers,
            });
            setUsers(response.data);
        } catch (error) {
            console.log("Error getting users:", error.response?.data)
        }
    }
    const getFriends = async () => {

        try {
            let response = await axios.get('http://localhost:8000/api/friends/', { headers });
            setFriends(response.data)
        } catch (error) {
            console.log("Error getting users:", error.response?.data)
        }
    }
    const getRequested = async () => {
        try {
            let resp = await axios.get('http://localhost:8000/api/requested/', {
                headers: headers,
            })
            setRequested(resp.data);
            console.log("requests:", requested);
        } catch (error) {
            console.log("Error getting requests:", error.response?.error)
        }
    }
    const onUserClick = (user) => {
        setSelectedFriend(user);
    }


    return (
        <div className="container border-2 rounded- shadow p-3 mb-5 bg-body rounded mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="border-bottom border-2 mb-4">
                        <h4 className='text-left mt-2 mx-4 fw-bold'>Friends</h4>
                    </div>
                    <div style={{ height: '500px', overflowY: 'auto' }}>
                        {friends.length > 0 ? friends.map(friend => (
                            <div key={friend.id} onClick={() => onUserClick(friend)}>
                                <Consumer vals={friend} friend={true} online={onlineUsers.includes(friend.id) ? true : false} />

                            </div>
                        )) : <p className="card-text text-center">No Friends</p>}
                    </div>

                </div>
                <div className="f-block col-md-6 bg-gradient">
                    <div className="border-bottom border-2">
                        <h4 className="mt-2 mx-4 fw-bold">ChatBox</h4>
                    </div>
                    <ChatBox selectedFriend={selectedFriend} />
                </div>
                <div className="col-md-3">
                    <div className="border-bottom border-2 mb-4">
                        <h4 className='text-left mt-2 mx-4 fw-bold'>Users</h4>
                    </div>
                    <div style={{ height: '500px', overflowY: 'auto' }}>
                        {
                            users ? users.map(user => (
                                <Consumer key={user.id} vals={user} />
                            )) : <small className="text text-center">No usres</small>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

