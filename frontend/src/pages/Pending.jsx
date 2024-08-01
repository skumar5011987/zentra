
import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import Consumer from '../Components/Consumer';

export default function PendingRequestes() {
    const navigate = useNavigate()
    // const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access_token')
    const headers = { 'Authorization': 'Bearer ' + token }
    const [requesteR, setRequesteR] = useState([])
    const [requesteS, setRequesteS] = useState([])

    const getRequested = async () => {
        try {
            ;
            let resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/requested/`, {
                headers: headers,
            })
            console.log("req:", resp)
            const rr = resp.data.received
            const rs = resp.data.send
            setRequesteR(rr);
            setRequesteS(rs);
            console.log("requesteR, RequesteS:", requesteR, requesteS);
        } catch (error) {
            console.log("Error getting requests:", error.response?.error)
        }
    }

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate("/signin");
        }
        else {
            getRequested();
        }
    }, [token, getRequested]);

    

    return (
        <div className="container justify-content-center align-content-center  mt-5">
            <div className='row'>
                <div className="col">
                    <div className="card shadow">
                        <div className="row align-content-start card-body">
                            <div className='col'>
                                <h4 className="card-title border-2 border-bottom pb-2">Requests Received</h4>
                            </div>
                            <div className='col'>
                                <h4 className="card-title border-2 border-bottom pb-2">Requests Sent</h4>
                            </div>
                        </div>
                        <div className="row card-body">
                            <div className="col align-content-start">
                                {requesteR?.map(item => (
                                    <Consumer key={item.id} vals={item} requesteR={true} />
                                ))}
                            </div>
                            <div className='col align-content-start'>
                                {requesteS?.map(item => (
                                    <Consumer key={item.id} vals={item} requesteS={true} />
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
