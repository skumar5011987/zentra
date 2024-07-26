import axios from 'axios'
import React from 'react'

export default function Consumer(props) {
    
    const token = localStorage.getItem("access_token")
    const headers = { 'Authorization': 'Bearer ' + token }

    const sendInterest = async (receiver) => {
        try {
            const response = await axios.post('http://localhost:8000/api/interests/', { receiver }, {
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
            const response = await axios.delete('http://localhost:8000/api/interests/', {
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
            const response = await axios.put('http://localhost:8000/api/interests/', { interest_id }, {
                headers: headers
            });

        } catch (error) {
            console.log("Error accept request:", error.response?.data)
        }
    }

    return (
        <>
            <div className="card m-2 rounded-pill border-2 border-success shadow" style={{ "maxWidth": "400px", "maxHeight": "80px" }}>
                <div className="row m-0 p-0 g-0">
                    <div className="col-md-2 d-flex justify-content-center align-items-center">
                        {props.online ?<i className="m-2 fa-solid fa-circle-user fa-2x text-success"></i> : <i className="m-2 fa-solid fa-circle-user fa-2x text-secondary"></i>}
                    </div>
                    <div className="col-md-8">
                        <div className="card-body p-0 m-0">
                            <p className="m-0 p-0">{props.vals.first_name} {props.vals.last_name}</p>
                            <small className="m-0 p-0"><small className="text-muted">{props.vals.username}</small></small>
                        </div>
                    </div>
                    <div className='col-md-2 d-flex justify-content-end align-items-center'>
                        {
                            props.friend ? (
                                <div className="d-flex hover" >{}
                                    <i className="mx-3 fa-regular fa-comments text-success" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Start Chat"></i>
                                </div>
                            ) : props.requesteR ? (
                                <div className="d-flex">
                                    <i className="me-3 fa-regular fa-circle-check text-success" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Accept Invite" onClick={() => acceptInterest(props.vals.id)}></i>
                                    <i className="me-3 fa-regular fa-trash-can text-danger" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Reject Invite" onClick={() => cancelInterest(props.vals.id)}></i>
                                </div>
                            ): props?.requesteS ? (
                                <i className="me-3 fa-regular fa-trash-can text-danger" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cancle Invite" onClick={() => cancelInterest(props.vals.id)}></i>
                            ) : (
                                <i className="mx-3 fa-regular fa-paper-plane text-primary" role="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Send Invite" onClick={() => sendInterest(props.vals.id)}></i>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
