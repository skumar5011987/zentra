import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Consumer from '../Components/Consumer';
import axios from 'axios';

export default function InviteUsers() {
    const token = localStorage.getItem("access_token");
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const headers = { "Authorization": "Bearer " + token };
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            navigate("/signin");
        } else {
            fetchAllUsers();
        }
    }, [token, navigate]);

    const fetchAllUsers = async () => {
        try {
            let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/`, {
                headers: headers
            });
            setAllUsers(response.data);
            setUsers(response.data); 
        } catch (error) {
            console.log("Error getting users:", error.response?.data);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault(); 

        try {
            if (searchTerm.trim() === "") {
                setUsers(allUsers);
                return;
            }
            let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/`, {
                headers: headers,
                params: { query: searchTerm }
            });
            console.log("Response Data:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.log("Error searching users:", error.response?.data);
        }
    };

    const handleChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);

        if (newSearchTerm.trim() === "") {
            setUsers(allUsers);
        }
    };

    return (
        <>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-4 col-lg-4">
                        <div className="card shadow mt-5">
                            <div className="card-header d-flex justify-content-around">
                                <form className='d-flex' onSubmit={handleSearch}>
                                    <input
                                        className="form-control rounded-pill me-2"
                                        type="search"
                                        placeholder="Search & Invite friends"
                                        value={searchTerm}
                                        onChange={handleChange}
                                        aria-label="Search"
                                    />
                                    <button className="btn btn-outline-success" type="submit">Search</button>
                                </form>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '400px', overflowY: 'auto' }}>
                                    {
                                        users.length > 0 ? users.map(user => (
                                            <Consumer key={user.id} vals={user} />
                                        )) : <p className="text text-center">No users found</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
