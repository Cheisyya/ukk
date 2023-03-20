import React from 'react'

export default class Navbar extends React.Component {
    logout = () => {
        window.location = "/login"
        localStorage.clear()
    }

    setting = () => {
        window.location = "/profile"
    }

    render() {
        return (
            <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    {/* <a className="navbar-brand brand-logo mr-5" href="/"><img src="images/logo-mini.svg" className="mr-2" alt="logo" /></a>
                    <a className="navbar-brand brand-logo-mini" href="/"><img src="images/logo-mini.svg" alt="logo" /></a> */}
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
                    <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                        <span className="icon-menu"></span>
                    </button>
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item nav-profile dropdown">
                            <a className="nav-link dropdown-toggle" href="/" data-toggle="dropdown" id="profileDropdown">
                                <img src="https://drh.co.id/images/profile.png" alt="profile" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                                <a className="dropdown-item" onClick={() => this.setting()}>
                                    <i className="ti-settings text-primary"></i>
                                    Profile Setting
                                </a>
                                <button className="dropdown-item" onClick={() => this.logout()}>
                                    <i className="ti-power-off text-primary"></i>
                                    Logout
                                </button>
                            </div>
                        </li>
                    </ul>
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                        <span className="icon-menu"></span>
                    </button>
                </div>
            </nav>
        )
    }
}