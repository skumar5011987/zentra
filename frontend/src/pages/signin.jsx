
import { Link } from 'react-router-dom';

function Signin() {
    return (
        <div className="container mt-5">
            <div className="col-md-8 col-12 offset-2">
                <div className="card shadow">
                    <div className="card-header">
                        <h4 className="card-title">Sign-in</h4>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-2">
                                <label for="username" className="form-label">User name</label>
                                <input type="text" className="form-control" id="username" required />
                            </div>
                            <div className="mb-2">
                                <label for="pwd" className="form-label">Password</label>
                                <input type="password" className="form-control" id="pwd" required />
                            </div>
                            <div className="mt-4 justify-content-spacebetween ">
                                <Link className="mt-4" to="/signup">Not registerd yet? Sign-up</Link>
                                <button type="submit" className="btn btn-success mt-2 float-end">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signin;