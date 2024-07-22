import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-warning" data-bs-theme="dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Zentra Chat App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                            <li><Link className="nav-link" to="/signin">Sign-in</Link></li>
                            <li><Link className="nav-link" to="/signup">Sign-up</Link></li>
                        {/* <li className="nav-item dropdown">
                            <Link className=" dropdown-toggle" to="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Account
                            </Link>
                            <ul className="dropdown-menu">
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/">Logout</Link></li>
                            </ul>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
