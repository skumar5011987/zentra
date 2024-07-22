
import { Link } from 'react-router-dom';

function Signup() {
    return (
        <div className="container mt-5">
            <div className="col-md-8 col-12 offset-2">
                <div className="card shadow">
                    <div className="card-header">
                        <h4 className="card-title">Sign-up</h4>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row">
                                <div className="col">
                                    <label for="fname" className="form-label">First name</label>
                                    <input type="text" className="form-control" id='fname' placeholder="First name" aria-label="First name" />
                                </div>
                                <div className="col">
                                    <label for="lname" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id='lname' placeholder="Last name" aria-label="Last name" />
                                </div>
                            </div>
                            <div className='row mt-1'>
                                <div className='col'>
                                    <label for="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" id="email" placeholder="email" />
                                </div>
                                <div className='col'>
                                    <label for="username" className="form-label">User name</label>
                                    <input type="text" className="form-control" id="username" placeholder="user name" />
                                </div>
                            </div>
                            <div className='row mt-1'>
                                <div className="col">
                                    <label for="pwd" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="pwd" placeholder="password" />
                                </div>
                            </div>
                            <div className="mt-4 justify-content-spacebetween ">
                                <Link to="/signin">Already registerd? Sign-in</Link>
                                <button type="submit" className="btn btn-success ml-4 mt-2 float-end">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signup;