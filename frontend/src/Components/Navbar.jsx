import axios from 'axios';
// import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    const headers = { 'Authorization': 'Bearer ' + token }

    const handleLogout = async () => {
        try {
            const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/signout/`, { refresh_token }, {
                headers: headers,
            });

        } catch (error) {
            console.log("logout:", error.response?.data);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate('/signin');
        }
    };

    const searchAndInvite = async () => {

    }

    return (
        <>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark" data-bs-theme="dark">
                <div className="container">
                    <Link className="navbar-brand fw-bolder" to="/">ChatApp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {user ? (
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/inviteusers">Search & Invite</Link>
                                </li>
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

                            </ul>)}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
