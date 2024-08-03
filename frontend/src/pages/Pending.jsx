
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    }, [token]);


    return (
        <>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-sm-12 col-md-10 col-lg-8">
                        <div className="card shadow mt-5">
                            <div className="card-header d-flex  justify-content-around">
                                <h4 className="card-title text-center fw-bold">Invites Received</h4>
                                <h4 className="card-title text-center fw-bold">Invites Sent</h4>
                            </div>
                            <div className="card-body">
                                <div className='row'>
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
                </div>
            </div>
        </>
    );
}
