import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        navigate('/room');
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/token/`, { username, password });
            const token = response.data.access;
            const decoded = jwtDecode(token);
            console.log("decoded", decoded)
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            let headers = { 'Authorization': `Bearer ${token}` }
            const resp = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}api/users/`, {
                headers: headers,
                params: { user_id: decoded.user_id }
            }

            );

            localStorage.setItem(`user`, JSON.stringify(resp.data));
            navigate('/room');
        } catch (error) {
            console.error('Logging in error:', error.response.data);
        }
    };
    return (
        <>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow mt-5">
                            <div className="card-header">
                                <h4 className="card-title text-center fw-bold">Sign-in</h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">User name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pwd" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="pwd"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Link className="" to="/signup">Not registered yet? Sign-up</Link>
                                        <button type="submit" className="btn btn-success mt-2 float-end">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Signin;