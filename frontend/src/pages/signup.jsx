
import { Link, useNavigate, } from 'react-router-dom';
import {useState} from 'react'
import axios from 'axios';

function Signup() {
    const [firstname, setFirstname]= useState('')
    const [lastname, setLastname]= useState('')
    const [email, setEmail]= useState('')
    const [username, setUsername]= useState('')
    const [password, setPassword]= useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response =  await axios.post('http://localhost:8000/api/register/', 
                {firstname, lastname,email, username, password });
            const data = response.data
            console.log("User:",response?.data)
            // localStorage.setItem(`access_token`, data.access)
            // localStorage.setItem(`refresh_token`, data.access)
            // localStorage.setItem(`user`, JSON.stringify(data.user))
            navigate('/signin')
        } catch (error) {
            console.error('Sign up error:', error.response.data);
        }

    }
    return (
        <>
            <div className="container mt-5">
                <div className="col-md-8 col-12 offset-2">
                    <div className="card shadow">
                        <div className="card-header">
                            <h4 className="card-title">Sign-up</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col">
                                        <label htmlFor="fname" className="form-label">First name</label>
                                        <input
                                            type="text" 
                                            className="form-control" 
                                            id='fname'
                                            value={firstname}
                                            onChange={(e)=> setFirstname(e.target.value)}
                                            placeholder="First name" 
                                            aria-label="First name" 
                                            />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="lname" className="form-label">Last name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id='lname'
                                            value={lastname}
                                            onChange={(e)=> setLastname(e.target.value)}
                                            placeholder="Last name" 
                                            aria-label="Last name" 
                                            
                                            />
                                    </div>
                                </div>
                                <div className='row mt-1'>
                                    <div className='col'>
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input 
                                            type="email"
                                            className="form-control" 
                                            id="email" 
                                            value={email}
                                            onChange={(e)=> setEmail(e.target.value)}
                                            placeholder="email"
                                        />
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="username" className="form-label">User name</label>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            id="username" 
                                            value={username}
                                            onChange={(e)=> setUsername(e.target.value)}
                                            placeholder="user name" 
                                            />
                                    </div>
                                </div>
                                <div className='row mt-1 mb-2'>
                                    <div className="col">
                                        <label htmlFor="pwd" className="form-label">Password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="pwd" 
                                            value={password}
                                            onChange={(e)=> setPassword(e.target.value)}
                                            placeholder="password" 
                                            />
                                    </div>
                                </div>
                                <div>
                                    <Link className="mt-5" to="/signin">Already registered? Sign-in</Link>
                                    <button type="submit" className="btn btn-success ml-4 mt-2 float-end">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Signup;