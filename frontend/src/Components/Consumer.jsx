import axios from 'axios'
import React from 'react'

export default function Consumer(props) {

    const token = localStorage.getItem("access_token")
    const headers = { 'Authorization': 'Bearer ' + token }

    const sendInterest = async (receiver) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/interests/`, { receiver }, {
                headers: headers
            });
            console.log("Interest sent response:", response.data)
        } catch (erroor) {
            console.log("Error in send Interest:", erroor.response?.error)
        }
    }

    const cancelInterest = async (interest_id) => {
        try {
            ;
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}api/interests/`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                data: {
                    interest_id: interest_id
                }
            });

        } catch (error) {
            console.log("Error cancel request:", error.response?.data)
        }
    }
    const acceptInterest = async (interest_id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}api/interests/`, { interest_id }, {
                headers: headers
            });

        } catch (error) {
            console.log("Error accept request:", error.response?.data)
        }
    }

    return (
        <>
            <div className="card m-2 rounded-pill border-2 border-success shadow-sm" style={{ maxWidth: "100%", maxHeight: "100px" }}>
                <div className="row g-0 align-items-center">
                    <div className="col-3 col-sm-2 d-flex justify-content-center p-1">
                        {props.online
                            ? <i className="fa-solid fa-circle-user fa-2x text-success"></i>
                            : <i className="fa-solid fa-circle-user fa-2x text-secondary"></i>}
                    </div>
                    <div className="col-9 col-sm-8">
                        <div className="card-body p-0">
                            <p className="m-0 fs-8 text-truncate d-none d-sm-block p-0">{props.vals.first_name} {props.vals.last_name}</p>
                            <small className="text-muted fs-10 d-none d-md-block text-truncate">{props.vals.username}</small>
                        </div>
                    </div>
                    <div className='col-12 col-sm-2 d-flex justify-content-center align-items-center p-0'>
                        {
                            props.friend ? (
                                <div className="d-flex">
                                    <i className="fa-regular fa-comments text-success" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Start Chat"></i>
                                </div>
                            ) : props.requesteR ? (
                                <div className="d-flex">
                                    <i className="fa-regular fa-circle-check text-success me-2" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Accept Invite" onClick={() => acceptInterest(props.vals.id)}></i>
                                    <i className="fa-regular fa-trash-can text-danger" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Reject Invite" onClick={() => cancelInterest(props.vals.id)}></i>
                                </div>
                            ) : props?.requesteS ? (
                                <i className="fa-regular fa-trash-can text-danger" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cancel Invite" onClick={() => cancelInterest(props.vals.id)}></i>
                            ) : (
                                <i className="fa-regular fa-paper-plane text-primary" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Send Invite" onClick={() => sendInterest(props.vals.id)}></i>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
