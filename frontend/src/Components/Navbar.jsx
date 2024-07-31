// import axios from 'axios';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    const headers = { 'Authorization': 'Bearer ' + token }

    const handleLogout = async () => {
        try {
            const resp = await axios.post('http://localhost:8000/api/signout/', { refresh_token }, {
                headers: headers,
            });
            
        } catch (error){
            console.log("logout:", error.response?.data);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate('/signin');
        }
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-whight" data-bs-theme="dark">
                <div className="container">
                    <Link className="navbar-brand fw-bolder" to="/">ChatApp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {user ? (
                            <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                    <Link className="nav-link" to="/">My Room</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link">Welcome, {user.username?.toUpperCase()}</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notifications" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Invites"><i className="fa-regular fa-bell"></i></Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={handleLogout}>Logout</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav ms-auto">
                                <li><Link className="nav-link" to="/signin">Sign-in</Link></li>
                                <li><Link className="nav-link" to="/signup">Sign-up</Link></li>
                                {/* <li className="nav-item dropdown">
                            <Link className=" dropdown-toggle" to="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {UserName}
                            </Link>
                            <ul className="dropdown-menu">
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/">Logout</Link></li>
                            </ul>
                        </li> */}
                            </ul>)}
                    </div>
                </div>
            </nav>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
